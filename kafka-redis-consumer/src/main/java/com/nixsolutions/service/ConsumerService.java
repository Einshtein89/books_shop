package com.nixsolutions.service;

import org.apache.kafka.clients.consumer.ConsumerRecord;

public interface ConsumerService<T>
{

  void listen(T message, ConsumerRecord consumerRecord);
}
