#!/bin/bash

#pre installation of all required programs (Mac OS only)
if [[ ! $(kubectl version --client) ]]; then
  brew install kubectl
fi
if [[ ! $(helm version) ]]; then
  brew install helm
fi
if [[ ! $(minikube version) ]]; then
  brew install hyperkit &&
  #binary downloads
  #  curl -LO https://github.com/kubernetes/minikube/releases/download/v1.19.0/minikube-darwin-amd64 &&\
  #curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 &&
  #sudo install minikube-darwin-amd64 /usr/local/bin/minikube &&
  brew install minikube &&
  brew unlink minikube &&
  brew link minikube &&
  brew link hyperkit

  #linux
  #curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
  #sudo install minikube-linux-amd64 /usr/local/bin/minikube
fi
#docker hub credentials and repo details
USERNAME=$1
PASSWORD=$2
ORGANIZATION=$1
LOCAL="${3:-false}"
BACKEND_IMAGE=books_backend_mongo
KAFKA_PRODUCER_IMAGE=books_kafka_producer
KAFKA_CONSUMER_IMAGE=books_kafka_consumer
FRONTEND_IMAGE=books_frontend_mongo
PROJECT_NAME=books-store
GCP_PROJECT_NAME="k8s-books-store"
SHA=$(git rev-parse HEAD)

#deleting local tags
docker rmi $USERNAME/$BACKEND_IMAGE:latest &&
docker rmi $USERNAME/$BACKEND_IMAGE:$SHA &&
docker rmi $USERNAME/$FRONTEND_IMAGE:latest &&
docker rmi $USERNAME/$FRONTEND_IMAGE:$SHA &&
docker rmi $USERNAME/$KAFKA_PRODUCER_IMAGE:latest &&
docker rmi $USERNAME/$KAFKA_PRODUCER_IMAGE:$SHA &&
docker rmi $USERNAME/$KAFKA_CONSUMER_IMAGE:latest &&
docker rmi $USERNAME/$KAFKA_CONSUMER_IMAGE:$SHA &&

#deleting tags from remote repo
docker run --rm -it lumir/remove-dockerhub-tag --user $USERNAME \
--password $PASSWORD ${ORGANIZATION}/${BACKEND_IMAGE}:latest
docker run --rm -it lumir/remove-dockerhub-tag --user $USERNAME \
--password $PASSWORD ${ORGANIZATION}/${BACKEND_IMAGE}:$SHA

docker run --rm -it lumir/remove-dockerhub-tag --user $USERNAME \
--password $PASSWORD ${ORGANIZATION}/${FRONTEND_IMAGE}:latest
docker run --rm -it lumir/remove-dockerhub-tag --user $USERNAME \
--password $PASSWORD ${ORGANIZATION}/${FRONTEND_IMAGE}:$SHA

docker run --rm -it lumir/remove-dockerhub-tag --user $USERNAME \
--password $PASSWORD ${ORGANIZATION}/${KAFKA_PRODUCER_IMAGE}:latest
docker run --rm -it lumir/remove-dockerhub-tag --user $USERNAME \
--password $PASSWORD ${ORGANIZATION}/${KAFKA_PRODUCER_IMAGE}:$SHA

docker run --rm -it lumir/remove-dockerhub-tag --user $USERNAME \
--password $PASSWORD ${ORGANIZATION}/${KAFKA_CONSUMER_IMAGE}:latest
docker run --rm -it lumir/remove-dockerhub-tag --user $USERNAME \
--password $PASSWORD ${ORGANIZATION}/${KAFKA_CONSUMER_IMAGE}:$SHA

#compiling and building backend, pushing to remote
cd ..
docker build --target build-kafka-producer -t $USERNAME/$KAFKA_PRODUCER_IMAGE:latest -t $USERNAME/$KAFKA_PRODUCER_IMAGE:$SHA . &&
docker push $USERNAME/$KAFKA_PRODUCER_IMAGE:latest &&
docker push $USERNAME/$KAFKA_PRODUCER_IMAGE:$SHA &&
docker build --target build-kafka-consumer -t $USERNAME/$KAFKA_CONSUMER_IMAGE:latest -t $USERNAME/$KAFKA_CONSUMER_IMAGE:$SHA . &&
docker push $USERNAME/$KAFKA_CONSUMER_IMAGE:latest &&
docker push $USERNAME/$KAFKA_CONSUMER_IMAGE:$SHA  &&
docker build --target build-server -t $USERNAME/$BACKEND_IMAGE:latest -t $USERNAME/$BACKEND_IMAGE:$SHA . &&
docker push $USERNAME/$BACKEND_IMAGE:latest &&
docker push $USERNAME/$BACKEND_IMAGE:$SHA &&
docker build --target ui-final -t $USERNAME/$FRONTEND_IMAGE:latest -t $USERNAME/$FRONTEND_IMAGE:$SHA . &&
docker push $USERNAME/$FRONTEND_IMAGE:latest &&
docker push $USERNAME/$FRONTEND_IMAGE:$SHA &&
cd k8s || exit

if "$LOCAL"; then
#preparing k8s cluster
  minikube start --driver=hyperkit &&
#minikube ingress-nginx controller
  helm upgrade --install ingress-nginx ingress-nginx \
    --repo https://kubernetes.github.io/ingress-nginx \
    --namespace ingress-nginx --create-namespace &&
#if next command is not working and ingress addons are not enabled - see https://github.com/kubernetes/minikube/issues/8756
  minikube addons enable ingress &&
  kubectl config use-context minikube
else
  #GKE
  #install google cloud sdk
  curl https://sdk.cloud.google.com > install.sh &&
  bash install.sh --disable-prompts &&
  #setup cluster
  gcloud components install beta
  gcloud beta container --project $GCP_PROJECT_NAME clusters create "cluster-1" \
   --zone "us-central1-c" --no-enable-basic-auth --cluster-version "1.21.11-gke.1100" \
   --release-channel "regular" --machine-type "e2-medium" --image-type "COS_CONTAINERD" \
   --disk-type "pd-standard" --disk-size "50" --metadata disable-legacy-endpoints=true \
   --scopes "https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/trace.append" \
   --max-pods-per-node "110" --num-nodes "3" --logging=SYSTEM,WORKLOAD --monitoring=SYSTEM \
   --enable-ip-alias --network "projects/$GCP_PROJECT_NAME/global/networks/default" \
   --subnetwork "projects/$GCP_PROJECT_NAME/regions/us-central1/subnetworks/default" \
   --no-enable-intra-node-visibility --default-max-pods-per-node "110" \
   --no-enable-master-authorized-networks --addons HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver \
   --enable-autoupgrade --enable-autorepair --max-surge-upgrade 1 --max-unavailable-upgrade 0 --enable-shielded-nodes \
   --node-locations "us-central1-c"
  #decrypt service-account.json.enc (if it was decrypted before and you do not have service-account.json in place)
  openssl aes-256-cbc -K $encrypted_9f3b5599b056_key -iv $encrypted_9f3b5599b056_iv -in service-account.json.enc -out service-account.json -d
  #  gcloud components update kubectl -q
  gcloud auth activate-service-account --key-file ../service-account.json -q &&
  #your GC k8s cluster location (zone)
  gcloud config set compute/zone us-central1-c -q &&
  #your GC k8s cluster name
  gcloud container clusters get-credentials my-first-cluster-1 -q &&
  #your GC project name
  gcloud config set project $GCP_PROJECT_NAME -q &&

  #setup ingress-nginx in GKE cluster
  kubectl create clusterrolebinding cluster-admin-binding \
    --clusterrole cluster-admin \
    --user $(gcloud config get-value account)
  kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/cloud/deploy.yaml

  #setup cert manager (for certificate generation via letsencrypt)
  helm repo add jetstack https://charts.jetstack.io
  helm repo update
  helm upgrade --install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.8.0 \
  --set installCRDs=true
fi

helm dependency update $PROJECT_NAME &&
#kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
helm upgrade --install --namespace $PROJECT_NAME $PROJECT_NAME $PROJECT_NAME --create-namespace &&
kubectl set image -n $PROJECT_NAME deployment/angular-deployment angular-deployment=$USERNAME/$FRONTEND_IMAGE:$SHA
kubectl set image -n $PROJECT_NAME deployment/spring-boot-deployment spring-boot-deployment=$USERNAME/$BACKEND_IMAGE:$SHA
kubectl set image -n $PROJECT_NAME deployment/kafka-consumer-deployment kafka-consumer-deployment=$USERNAME/$KAFKA_CONSUMER_IMAGE:$SHA
kubectl set image -n $PROJECT_NAME deployment/kafka-producer-deployment kafka-producer-deployment=$USERNAME/$KAFKA_PRODUCER_IMAGE:$SHA
#kubectl delete pods --all --namespace=$PROJECT_NAME &&

#clean up
#deleting local tags
docker rmi $USERNAME/$BACKEND_IMAGE:latest &&
docker rmi $USERNAME/$BACKEND_IMAGE:$SHA &&
docker rmi $USERNAME/$FRONTEND_IMAGE:latest &&
docker rmi $USERNAME/$FRONTEND_IMAGE:$SHA &&
docker rmi $USERNAME/$KAFKA_PRODUCER_IMAGE:latest &&
docker rmi $USERNAME/$KAFKA_PRODUCER_IMAGE:$SHA &&
docker rmi $USERNAME/$KAFKA_CONSUMER_IMAGE:latest &&
docker rmi $USERNAME/$KAFKA_CONSUMER_IMAGE:$SHA &&

if "$LOCAL"; then
  minikube dashboard
fi
#minikube service books-store-mongo-express -n $PROJECT_NAME
