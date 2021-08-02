package com.nixsolutions.server.validators;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import com.nixsolutions.server.dao.UserRepository;
import com.nixsolutions.server.entity.users.User;

@Component("beforeCreateUserValidator")
public class BeforeCreateUserValidator implements Validator
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
    List<User> oldUsersByNames =
        repository.findByFirstNameAndLastName(newUser.getFirstName(), newUser.getLastName());
    User oldUserByEmail =
        repository.findByEmail(newUser.getEmail());
    if (!CollectionUtils.isEmpty(oldUsersByNames))
    {
      errors.rejectValue("firstName", "user.byNames.exists.error");
    }
    if (Objects.nonNull(oldUserByEmail))
    {
      errors.rejectValue("email", "user.byEmail.exists.error");
    }
  }
}

