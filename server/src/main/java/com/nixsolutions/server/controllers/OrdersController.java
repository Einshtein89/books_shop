package com.nixsolutions.server.controllers;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.ResponseEntity.badRequest;
import static org.springframework.http.ResponseEntity.ok;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;

import com.nixsolutions.server.entity.Book;
import com.nixsolutions.server.process.order.OrderProcess;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrdersController
{
  private final OrderProcess orderProcess;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> getOrders(@RequestParam("userId") Long userId)
  {
    if (userId <= 0)
    {
      return badRequest().build();
    }
    return ok(orderProcess.getOrders(userId));
  }
  
  @PostMapping
  public ResponseEntity<?> placeOrder(@RequestBody Map<String, Book> orderMap) throws Exception
  {
    return orderProcess.placeOrders(orderMap);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> handleGeneralException(final Exception exception) {
    log.error("Something went wrong", exception);
    return new ResponseEntity<>(new JSONObject()
        .put("errorMessage", "Something went wrong").toString(), INTERNAL_SERVER_ERROR);
  }
  @ExceptionHandler(RestClientException.class)
  public ResponseEntity<String> handleRestClientException(final Exception exception) {
    log.error("request wasn't successful", exception);
    return new ResponseEntity<>(new JSONObject()
        .put("errorMessage", "request wasn't successful").toString(), INTERNAL_SERVER_ERROR);
  }

}
