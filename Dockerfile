FROM maven:3.8.1-adoptopenjdk-8 as build-java
ENV APP_HOME=/usr/src/app
RUN mkdir -p $APP_HOME
COPY . $APP_HOME
WORKDIR $APP_HOME
RUN mvn clean package -Dmaven.test.skip=true

FROM openjdk:8-jdk-alpine as build-kafka-producer
VOLUME /tmp
ENV APP_HOME=/usr/src/app
COPY --from=build-java $APP_HOME/kafka-producer/target/*.jar app.jar
CMD ["java", "-jar", "app.jar"]

FROM openjdk:8-jdk-alpine as build-kafka-consumer
VOLUME /tmp
ENV APP_HOME=/usr/src/app
COPY --from=build-java $APP_HOME/kafka-redis-consumer/target/*.jar app.jar
CMD ["java", "-jar", "app.jar"]

FROM openjdk:8-jdk-alpine as build-server
VOLUME /tmp
ENV APP_HOME=/usr/src/app
COPY --from=build-java $APP_HOME/server/target/*.jar app.jar
CMD ["java", "-jar", "app.jar"]

FROM node:10.8.0 as build-ui
ENV APP_HOME=/usr/src/app
RUN mkdir -p $APP_HOME
COPY client $APP_HOME
WORKDIR $APP_HOME
RUN npm install
ARG configuration=production
RUN npm run build -- --output-path=./dist --configuration $configuration

FROM nginx:latest as ui-final
VOLUME /tmp
COPY --from=build-ui /usr/src/app/dist /usr/share/nginx/html
COPY client/src/public /usr/share/nginx/html/public
COPY client/nginx-custom.conf /etc/nginx/conf.d/default.conf