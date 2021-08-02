package com.nixsolutions.server.dao;

import org.springframework.data.rest.core.config.Projection;

import com.nixsolutions.server.entity.users.User;

@Projection(name = "userFields", types = { User.class })
interface UserProjection
{
  long getId();
  String getFirstName();
  String getLastName();
  String getPhone();
  String getSex();
  String getEmail();
//  Set<Role> getRoles();
}
