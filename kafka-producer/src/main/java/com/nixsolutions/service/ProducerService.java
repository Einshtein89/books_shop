package com.nixsolutions.service;

import org.springframework.http.ResponseEntity;

public interface ProducerService<T>
{

  ResponseEntity<String> sendMessage(T parameter);
}
