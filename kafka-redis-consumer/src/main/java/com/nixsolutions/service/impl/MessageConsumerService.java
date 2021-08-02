package com.nixsolutions.service.impl;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nixsolutions.model.Message;
import com.nixsolutions.service.CacheService;
import com.nixsolutions.service.ConsumerService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class MessageConsumerService implements ConsumerService<Message>
{
  private static final String MESSAGES_TOPIC = "count-of-books";
  private static final String MESSAGES_GROUP = "user-orders";
  private static final String DELIMITER = ":";

  private final CacheService cacheService;
  private final ObjectMapper objectMapper;

  @Override
  @KafkaListener(topics = MESSAGES_TOPIC, groupId = MESSAGES_GROUP)
  public void listen(@Payload final Message message, ConsumerRecord consumerRecord) throws JsonProcessingException
  {
    log.debug("Message was received: {}.", message);
    cacheService.cacheObject(String.join(DELIMITER,
        MESSAGES_GROUP,
        MESSAGES_TOPIC,
        String.join("_", message.getUserId(), message.getUuid())),
        objectMapper.writeValueAsString(message));
  }
}
