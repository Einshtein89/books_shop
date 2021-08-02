package com.nixsolutions.server.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

import com.nixsolutions.server.entity.Book;
import com.nixsolutions.server.entity.Catalog;
import com.nixsolutions.server.entity.Order;
import com.nixsolutions.server.entity.users.User;

@Configuration
public class RepositoryConfig extends RepositoryRestConfigurerAdapter {
  @Override
  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
    config.exposeIdsFor(User.class, Catalog.class, Order.class, Book.class);
  }
}