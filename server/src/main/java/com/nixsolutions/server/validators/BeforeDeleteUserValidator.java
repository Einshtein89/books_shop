package com.nixsolutions.server.validators;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import com.nixsolutions.server.dao.UserRepository;
import com.nixsolutions.server.entity.users.User;

@Component("beforeDeleteUserValidator")
public class BeforeDeleteUserValidator implements Validator
{
  @Autowired
  private UserRepository repository;

  @Override
  public boolean supports(Class<?> clazz) {
    return User.class.equals(clazz);
  }

  @Override
  public void validate(Object obj, Errors errors) {
    User deletedUser = (User) obj;
    if (deletedUser.getId() <= 0)
    {
      errors.rejectValue("id", "No such user in DB!");
    }
  }
}

