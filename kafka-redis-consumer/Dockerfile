FROM maven:3.8.1-adoptopenjdk-8 as build-stage
ENV APP_HOME=/usr/src/app
RUN mkdir -p $APP_HOME
COPY . $APP_HOME
WORKDIR $APP_HOME
RUN mvn clean package -Dmaven.test.skip=true

FROM openjdk:8-jdk-alpine
ENV APP_HOME=/usr/src/app
COPY --from=build-stage $APP_HOME/target/kafka-redis-consumer-0.0.1-SNAPSHOT.jar /
CMD ["java", "-jar", "kafka-redis-consumer-0.0.1-SNAPSHOT.jar"]