package com.nixsolutions.server.validators;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import com.nixsolutions.server.dao.UserRepository;
import com.nixsolutions.server.entity.users.User;

@Component("beforeSaveUserValidator")
public class BeforeUpdateUserValidator implements Validator
{
  @Autowired
  private UserRepository repository;

  @Override
  public boolean supports(Class<?> clazz) {
    return User.class.equals(clazz);
  }

  @Override
  public void validate(Object obj, Errors errors) {
    User newUser = (User) obj;
    if (newUser.getId() <= 0)
    {
      errors.rejectValue("id", "user.doesn't.exists.error");
    }
    Example<User> example = Example.of(newUser);
    if (!repository.exists(example))
    {
      errors.rejectValue("id", "user.doesn't.exists.error");
    }
  }
}

