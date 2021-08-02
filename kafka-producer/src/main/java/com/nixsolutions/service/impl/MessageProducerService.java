package com.nixsolutions.service.impl;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFuture;

import com.nixsolutions.callback.MessageProducerListenableFutureCallback;
import com.nixsolutions.model.Message;
import com.nixsolutions.service.ProducerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageProducerService implements ProducerService<Message>
{

  private static final String MESSAGE = "message";
  private static final String MESSAGES_TOPIC = "count-of-books";

  private final KafkaTemplate<String, Message> kafkaTemplate;

  @Override
  public ResponseEntity<String> sendMessage(final Message message)
  {
    final ListenableFuture<SendResult<String, Message>> future = kafkaTemplate.send(MESSAGES_TOPIC, message);
    future.addCallback(new MessageProducerListenableFutureCallback(message));
    return ResponseEntity.ok(new JSONObject().put(MESSAGE, "Message was sent successfully.").toString());
  }
}
