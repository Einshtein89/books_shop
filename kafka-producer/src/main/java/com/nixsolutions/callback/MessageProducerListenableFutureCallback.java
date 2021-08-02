package com.nixsolutions.callback;

import java.util.Optional;

import org.apache.kafka.clients.producer.RecordMetadata;
import org.springframework.kafka.support.SendResult;
import org.springframework.util.concurrent.ListenableFutureCallback;

import com.nixsolutions.model.Message;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@AllArgsConstructor
public final class MessageProducerListenableFutureCallback
    implements ListenableFutureCallback<SendResult<String, Message>>
{

  private final Message message;

  @Override
  public void onFailure(final Throwable exception)
  {
    log.error("Cannot send message. {}", message, exception);
  }

  @Override
  public void onSuccess(final SendResult<String, Message> result)
  {
    log.info("Message: {} was sent successfully. With offset: {}.", message, Optional.ofNullable(result)
        .map(SendResult::getRecordMetadata)
        .map(RecordMetadata::offset)
        .orElse(null));
  }
}
