package com.nixsolutions.controller;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nixsolutions.model.message.MessagesPatternDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nixsolutions.service.CacheService;

import avro.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/messages")
@Slf4j
public class MessageController
{
  private final CacheService cacheService;
  private final ObjectMapper objectMapper;

  @PostMapping(produces = APPLICATION_JSON_VALUE)
  public ResponseEntity<String> getMessages(@RequestBody final MessagesPatternDto messagesPatternDto)
      throws IOException
  {
    log.info("MessagesPatternDto was received with pattern: {}.", messagesPatternDto.getKeysPattern());
    final List<Message> messages = getMessagesList(messagesPatternDto.getKeysPattern());
    return ResponseEntity.ok(messages.toString());
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> handleError(final Exception exception)
  {
    log.error("Messages can't be retrieved correctly.", exception);
    return new ResponseEntity<>(new JSONObject()
        .put("errorMessage", "Messages can't be retrieved correctly.").toString(), INTERNAL_SERVER_ERROR);
  }

  private List<Message> getMessagesList(final String keysPattern) throws JsonProcessingException
  {
    final List<Message> messages = new ArrayList<>();
    for (String value : cacheService.getCachedValues(keysPattern))
    {
      final Message message = objectMapper.readValue(value, Message.class);
      messages.add(message);
    }
    return messages;
  }
}
