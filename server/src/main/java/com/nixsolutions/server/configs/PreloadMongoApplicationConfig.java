package com.nixsolutions.server.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.data.repository.init.Jackson2RepositoryPopulatorFactoryBean;

import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
class PreloadMongoApplicationConfig
{
  @Value("classpath:catalogs_test_data.json")
  private Resource catalogsTestData;
  @Value("classpath:books_test_data.json")
  private Resource booksTestData;
  @Value("classpath:roles_test_data.json")
  private Resource rolesTestData;
  @Value("classpath:users_test_data.json")
  private Resource usersTestData;

  @Bean
  @Autowired
  public Jackson2RepositoryPopulatorFactoryBean repositoryPopulator(ObjectMapper objectMapper) {
    Jackson2RepositoryPopulatorFactoryBean factory = new Jackson2RepositoryPopulatorFactoryBean();
    // inject your Jackson Object Mapper if you need to customize it:
    factory.setMapper(objectMapper);
    factory.setResources(new Resource[]{catalogsTestData, booksTestData, rolesTestData, usersTestData});
    return factory;
  }
}