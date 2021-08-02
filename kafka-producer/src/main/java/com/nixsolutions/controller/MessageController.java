package com.nixsolutions.controller;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nixsolutions.model.Message;
import com.nixsolutions.model.dto.MessageDto;
import com.nixsolutions.service.ProducerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/message")
@Slf4j
public class MessageController
{

  private final ProducerService<Message> messageProducerService;

  @PostMapping(produces = APPLICATION_JSON_VALUE)
  public ResponseEntity<String> sendMessage(@RequestBody final MessageDto messageDto)
  {
    final Message message = messageDto.convertToMessage();
    log.info("Message was received: {}", message);
    return messageProducerService.sendMessage(message);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> handleError(final Exception exception)
  {
    log.error("Message wasn't sent correctly.", exception);
    return new ResponseEntity<>(new JSONObject()
        .put("errorMessage", "Message wasn't sent correctly.").toString(), BAD_REQUEST);
  }
}
