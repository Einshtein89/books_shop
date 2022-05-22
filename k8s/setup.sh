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
BACKEND_IMAGE=books_backend_mongo
BACKEND_TAG=$3
KAFKA_PRODUCER_IMAGE=books_kafka_producer
KAFKA_PRODUCER_TAG=$4
KAFKA_CONSUMER_IMAGE=books_kafka_consumer
KAFKA_CONSUMER_TAG=$5
FRONTEND_IMAGE=books_frontend_mongo
FRONTEND_TAG=$6
PROJECT_NAME=books-store

#deleting local tags
docker rmi $USERNAME/$BACKEND_IMAGE:$BACKEND_TAG &&
docker rmi $USERNAME/$FRONTEND_IMAGE:$FRONTEND_TAG &&
docker rmi $USERNAME/$KAFKA_PRODUCER_IMAGE:$KAFKA_PRODUCER_TAG &&
docker rmi $USERNAME/$KAFKA_CONSUMER_IMAGE:$KAFKA_CONSUMER_TAG &&

#deleting tags from remote repo
docker run --rm -it lumir/remove-dockerhub-tag --user $USERNAME \
--password $PASSWORD ${ORGANIZATION}/${BACKEND_IMAGE}:${BACKEND_TAG}

docker run --rm -it lumir/remove-dockerhub-tag --user $USERNAME \
--password $PASSWORD ${ORGANIZATION}/${FRONTEND_IMAGE}:${FRONTEND_TAG}

docker run --rm -it lumir/remove-dockerhub-tag --user $USERNAME \
--password $PASSWORD ${ORGANIZATION}/${KAFKA_PRODUCER_IMAGE}:${KAFKA_PRODUCER_TAG}

docker run --rm -it lumir/remove-dockerhub-tag --user $USERNAME \
--password $PASSWORD ${ORGANIZATION}/${KAFKA_CONSUMER_IMAGE}:${KAFKA_CONSUMER_TAG}

#compiling and building backend, pushing to remote
cd ..
docker build --target build-kafka-producer -t $USERNAME/$KAFKA_PRODUCER_IMAGE:$KAFKA_PRODUCER_TAG . &&
docker push $USERNAME/$KAFKA_PRODUCER_IMAGE:$KAFKA_PRODUCER_TAG &&
docker build --target build-kafka-consumer -t $USERNAME/$KAFKA_CONSUMER_IMAGE:$KAFKA_CONSUMER_TAG . &&
docker push $USERNAME/$KAFKA_CONSUMER_IMAGE:$KAFKA_CONSUMER_TAG &&
docker build --target build-server -t $USERNAME/$BACKEND_IMAGE:$BACKEND_TAG . &&
docker push $USERNAME/$BACKEND_IMAGE:$BACKEND_TAG &&
docker build --target ui-final -t $USERNAME/$FRONTEND_IMAGE:$FRONTEND_TAG . &&
docker push $USERNAME/$FRONTEND_IMAGE:$FRONTEND_TAG &&

#preparing k8s cluster
minikube start --driver=hyperkit &&
#minikube ingress-nginx controller
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace &&
#if next command is not working and ingress addons are not enabled - see https://github.com/kubernetes/minikube/issues/8756
minikube addons enable ingress &&

#GKE
#kubectl create clusterrolebinding cluster-admin-binding \
#  --clusterrole cluster-admin \
#  --user $(gcloud config get-value account)
#kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/cloud/deploy.yaml


cd k8s || exit

#create namespace if needed
if [[ ! $(kubectl get namespace | grep $PROJECT_NAME) ]]; then
  kubectl create namespace $PROJECT_NAME
fi

helm dependency update $PROJECT_NAME &&
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
helm upgrade --install --namespace $PROJECT_NAME $PROJECT_NAME $PROJECT_NAME &&
#kubectl delete pods --all --namespace=$PROJECT_NAME && \

#clean up
#deleting local tags
docker rmi $USERNAME/$BACKEND_IMAGE:$BACKEND_TAG &&
docker rmi $USERNAME/$FRONTEND_IMAGE:$FRONTEND_TAG &&
docker rmi $USERNAME/$KAFKA_CONSUMER_IMAGE:$KAFKA_CONSUMER_TAG &&
docker rmi $USERNAME/$KAFKA_PRODUCER_IMAGE:$KAFKA_PRODUCER_TAG &&

#deleting certificates
if [[ -f tls.cert ]]; then
  rm tls.cert
fi
if [[ -f tls.key ]]; then
  rm tls.key
fi

minikube dashboard
#minikube service books-store-mongo-express -n $PROJECT_NAME
