package com.nixsolutions.service.impl;

import java.util.List;

import org.apache.avro.generic.GenericRecord;
import org.apache.avro.util.Utf8;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import com.nixsolutions.model.message.MessageDto;
import com.nixsolutions.service.CacheService;
import com.nixsolutions.service.ConsumerService;

import avro.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageConsumerService implements ConsumerService<Message>
{
  @Value("${kafka.consumer.avro.shouldProcessConsumerRecords}")
  private boolean shouldProcessRecords;
  private static final String MESSAGES_TOPIC = "count-of-books";
  private static final String MESSAGES_GROUP = "user-orders";
  private static final String DELIMITER = ":";

  private final CacheService cacheService;

  @Override
  @KafkaListener(topics = MESSAGES_TOPIC, groupId = MESSAGES_GROUP)
  public void listen(@Payload final Message message, ConsumerRecord consumerRecord)
  {
    if (shouldProcessRecords)
    {
      List<GenericRecord> records = (List<GenericRecord>) consumerRecord.value();
      records.forEach(this::cacheMessage);
    }
    else
    {
      cacheMessage(message);
    }
  }

  private void cacheMessage(Message message)
  {
    cacheService.cacheObject(String.join(DELIMITER,
            MESSAGES_GROUP,
            MESSAGES_TOPIC,
            String.join("_", message.getUserId(), message.getUuid())),
        message.toString());
  }

  private void cacheMessage(GenericRecord record)
  {
    cacheService.cacheObject(String.join(DELIMITER,
            MESSAGES_GROUP,
            MESSAGES_TOPIC,
            String.join("_",((Utf8) record.get("userId")).toString(), ((Utf8) record.get("uuid")).toString())),
        MessageDto.convertToMessage(record).toString());
  }
}
