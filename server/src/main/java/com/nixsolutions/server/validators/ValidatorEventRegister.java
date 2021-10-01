package com.nixsolutions.server.validators;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.event.ValidatingRepositoryEventListener;
import org.springframework.validation.Validator;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class ValidatorEventRegister implements InitializingBean
{
  private final ValidatingRepositoryEventListener validatingRepositoryEventListener;
  private final Map<String, Validator> validators;

  @Override
  public void afterPropertiesSet() throws Exception {
    List<String> events = Arrays.asList("beforeCreate", "beforeSave", "beforeDelete");
    for (Map.Entry<String, Validator> entry : validators.entrySet()) {
      events.stream()
          .filter(p -> entry.getKey().startsWith(p))
          .findFirst()
          .ifPresent(
              p -> validatingRepositoryEventListener
                  .addValidator(p, entry.getValue()));
    }
  }
}
