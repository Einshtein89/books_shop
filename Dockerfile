FROM maven:3.8.1-adoptopenjdk-8 as build-java
ENV APP_HOME=/usr/src/app
RUN mkdir -p $APP_HOME
COPY . $APP_HOME
WORKDIR $APP_HOME
RUN mvn clean package -Dmaven.test.skip=true

FROM openjdk:8-jdk-alpine as build-kafka-producer
ENV APP_HOME=/usr/src/app
COPY --from=build-java $APP_HOME/kafka-producer/target/kafka-producer-0.0.1-SNAPSHOT.jar /
EXPOSE 8080
CMD ["java", "-jar", "kafka-producer-0.0.1-SNAPSHOT.jar"]

FROM openjdk:8-jdk-alpine as build-kafka-consumer
ENV APP_HOME=/usr/src/app
COPY --from=build-java $APP_HOME/kafka-redis-consumer/target/kafka-redis-consumer-0.0.1-SNAPSHOT.jar /
EXPOSE 8080
CMD ["java", "-jar", "kafka-redis-consumer-0.0.1-SNAPSHOT.jar"]

FROM openjdk:8-jdk-alpine as build-server
ENV APP_HOME=/usr/src/app
COPY --from=build-java $APP_HOME/server/target/server-0.0.1-SNAPSHOT.jar /
EXPOSE 8080
CMD ["java", "-jar", "server-0.0.1-SNAPSHOT.jar"]

FROM node:10.8.0 as build-ui
ENV APP_HOME=/usr/src/app
RUN mkdir -p $APP_HOME
COPY client $APP_HOME
WORKDIR $APP_HOME
RUN npm install
ARG configuration=production
RUN npm run build -- --output-path=./dist --configuration $configuration

FROM nginx:latest as ui-final
COPY --from=build-ui /usr/src/app/dist /usr/share/nginx/html
COPY client/src/public /usr/share/nginx/html/public
COPY client/nginx-custom.conf /etc/nginx/conf.d/default.conf