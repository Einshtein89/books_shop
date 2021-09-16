#!/bin/bash

#pre installation of all required programs (Mac OS only)
#if [[ ! $(docker version --format "{{.Server.KernelVersion}}") == *-moby ]]
#then
#    brew cask install docker
#fi

if [[ ! $(kubectl version --client) ]]
then
  brew install kubectl
fi
if [[ ! $(helm version) ]]
then
  brew install helm
fi
if [[ ! $(minikube version) ]]
then
#  brew install minikube
# as of writing this script, latest version of minikube wasn't working well with nginx-ingress addon,
# so installing v 1.19.0
  brew install hyperkit &&\
  curl -LO https://github.com/kubernetes/minikube/releases/download/v1.19.0/minikube-darwin-amd64 &&\
  sudo install minikube-darwin-amd64 /usr/local/bin/minikube &&\
  brew link hyperkit
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
docker rmi $USERNAME/$BACKEND_IMAGE:$BACKEND_TAG && \
docker rmi $USERNAME/$FRONTEND_IMAGE:$FRONTEND_TAG && \
docker rmi $USERNAME/$KAFKA_PRODUCER_IMAGE:$KAFKA_PRODUCER_TAG && \
docker rmi $USERNAME/$KAFKA_CONSUMER_IMAGE:$KAFKA_CONSUMER_TAG && \

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
docker build --target build-kafka-producer -t $USERNAME/$KAFKA_PRODUCER_IMAGE:$KAFKA_PRODUCER_TAG . && \
docker push $USERNAME/$KAFKA_PRODUCER_IMAGE:$KAFKA_PRODUCER_TAG && \
docker build --target build-kafka-consumer -t $USERNAME/$KAFKA_CONSUMER_IMAGE:$KAFKA_CONSUMER_TAG . && \
docker push $USERNAME/$KAFKA_CONSUMER_IMAGE:$KAFKA_CONSUMER_TAG && \
docker build --target build-server -t $USERNAME/$BACKEND_IMAGE:$BACKEND_TAG . && \
docker push $USERNAME/$BACKEND_IMAGE:$BACKEND_TAG && \
docker build --target ui-final -t $USERNAME/$FRONTEND_IMAGE:$FRONTEND_TAG . && \
docker push $USERNAME/$FRONTEND_IMAGE:$FRONTEND_TAG && \

#preparing k8s cluster
minikube start --driver=hyperkit && \
#if next command is not working and ingress addons are not enabled - see https://github.com/kubernetes/minikube/issues/8756
minikube addons enable ingress && \

cd k8s || exit
if [[ -f tls.cert ]]
then
    rm tls.cert
fi
if [[ -f tls.key ]]
then
    rm tls.key
fi

#create namespace if needed
if [[ ! $(kubectl get namespace | grep $PROJECT_NAME) ]]
then
    kubectl create namespace $PROJECT_NAME
fi

#create secret in k8s with cert and key (CN should correspond to host URL)
if [[ ! $(kubectl get secret -n $PROJECT_NAME | grep tls-secret) ]]
then
    openssl genrsa -out tls.key 2048 && \
    openssl req -new -x509 -key tls.key -out tls.cert -days 360 -subj /CN=books.com && \
    kubectl create secret -n $PROJECT_NAME tls tls-secret --cert=tls.cert --key=tls.key
fi

helm dependency update $PROJECT_NAME && \
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
helm upgrade --install --namespace $PROJECT_NAME $PROJECT_NAME $PROJECT_NAME && \
#kubectl delete pods --all --namespace=$PROJECT_NAME && \

#clean up
#deleting local tags
docker rmi $USERNAME/$BACKEND_IMAGE:$BACKEND_TAG && \
docker rmi $USERNAME/$FRONTEND_IMAGE:$FRONTEND_TAG && \
docker rmi $USERNAME/$KAFKA_CONSUMER_IMAGE:$KAFKA_CONSUMER_TAG && \
docker rmi $USERNAME/$KAFKA_PRODUCER_IMAGE:$KAFKA_PRODUCER_TAG && \

#deleting certificates
if [[ -f tls.cert ]]
then
    rm tls.cert
fi
if [[ -f tls.key ]]
then
    rm tls.key
fi

minikube dashboard