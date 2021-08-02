package com.nixsolutions.server.controllers;

import static com.nixsolutions.server.configs.Constants.REGISTRATION;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nixsolutions.server.dao.UserRepository;
import com.nixsolutions.server.entity.users.User;
import com.nixsolutions.server.validators.BeforeCreateUserValidator;

@RestController
@RequestMapping("/api/signup")
public class RegistrationController
{
  @Autowired
  private UserRepository userService;

  @Autowired
  private BeforeCreateUserValidator validator;

  @PostMapping
  public ResponseEntity<?> register(@RequestBody String newUserJson) throws IOException
  {
    ObjectMapper mapper = new ObjectMapper();
    User user = mapper.readValue(newUserJson, User.class);
    BeanPropertyBindingResult beanPropertyBindingResult =
        new BeanPropertyBindingResult(user, REGISTRATION);
    validator.validate(user, beanPropertyBindingResult);
    if (!beanPropertyBindingResult.hasErrors())
    {
      userService.save(user);
      return ResponseEntity.ok(user);
    }
    List<String> errors = beanPropertyBindingResult.getAllErrors().stream()
        .map(ObjectError::getCode)
        .collect(Collectors.toList());
    return new ResponseEntity<Object>(errors, new HttpHeaders(), HttpStatus.BAD_REQUEST);
  }
}
