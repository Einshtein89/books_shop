package com.nixsolutions.service;

import org.apache.kafka.clients.consumer.ConsumerRecord;

import com.fasterxml.jackson.core.JsonProcessingException;

public interface ConsumerService<T>
{

  void listen(T parameter, ConsumerRecord consumerRecord) throws JsonProcessingException;
}
