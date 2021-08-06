# Books shop pet project, that is aimed to learn basics of Spring boot, Angular, Kafka and so on

#### What does it consists of:
##### Java and servers
- Spring Boot (1.5+ and 2.0+)
- Kafka
- Redis
- MongoDB
- Docker
- K8s

##### UI
- Angular (5+)

###### Features
- Spring Boot + Spring Data Rest (working with DB and building responses with defined structure)
- JWT authentication and authorization 
- MongoDB as a main storage
- Kafka is used as a message broker in order to receive and store messages into Redis
- Redis (key-value in-memory storage) hold messages from Kafka
- Docker is used as an images builder, that will be deployed to k8s
- K8s is used for automating deployment, scaling, and management of containerized applications.