package com.nixsolutions.server.configs;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.data.repository.init.Jackson2RepositoryPopulatorFactoryBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
class PreloadMongoApplicationConfig
{
  @Value("${spring.mongo.host}")
  private String host;
  @Value("${spring.data.mongodb.database}")
  private String databasename;
  @Value("classpath:catalogs_test_data.json")
  private Resource catalogsTestData;
  @Value("classpath:books_test_data.json")
  private Resource booksTestData;
  @Value("classpath:roles_test_data.json")
  private Resource rolesTestData;
  @Value("classpath:users_test_data.json")
  private Resource usersTestData;

  private static final List<String> COLLECTIONS = ImmutableList.of("users", "books", "catalogs", "roles");
  private Map<String, Resource> COLLECTIONS_BY_NAME;

  @Bean
  @Autowired
  public Jackson2RepositoryPopulatorFactoryBean repositoryPopulator(ObjectMapper objectMapper)
  {
    Jackson2RepositoryPopulatorFactoryBean factory = new Jackson2RepositoryPopulatorFactoryBean();
    // inject your Jackson Object Mapper if you need to customize it:
    factory.setMapper(objectMapper);
    List<Resource> resourceList = new ArrayList<>();
    COLLECTIONS_BY_NAME = ImmutableMap
        .of("users", usersTestData,
            "books", booksTestData,
            "catalogs", catalogsTestData,
            "roles", rolesTestData);

    try (MongoClient mongoClient = MongoClients.create("mongodb://" + host))
    {
      MongoDatabase database = mongoClient.getDatabase(databasename);
      COLLECTIONS.forEach(collection -> {
            if (database.getCollection(collection).countDocuments() == 0)
            {
              resourceList.add(COLLECTIONS_BY_NAME.get(collection));
            }
          }
      );
    }
    catch (Exception e)
    {
      log.error("Exception while dropping collections from DB", e);
    }
    if (resourceList.size() > 0)
    {
      factory.setResources(resourceList.toArray(new Resource[0]));
    }
    return factory;
  }
}