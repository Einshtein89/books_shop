package com.nixsolutions.server.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.nixsolutions.server.entity.Book;
import com.nixsolutions.server.entity.Catalog;
import com.nixsolutions.server.entity.Order;
import com.nixsolutions.server.entity.users.User;

@Configuration
public class RepositoryConfig implements RepositoryRestConfigurer
{
  @Override
  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
    config.exposeIdsFor(User.class, Catalog.class, Order.class, Book.class);
  }
}