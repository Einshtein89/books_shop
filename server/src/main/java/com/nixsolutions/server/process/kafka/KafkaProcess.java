package com.nixsolutions.server.process.kafka;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.nixsolutions.model.message.MessageDto;
import com.nixsolutions.model.message.MessagesPatternDto;
import com.nixsolutions.server.entity.Order;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaProcess
{
  @Value("${kafka.producer.url}")
  private String kafkaProducerUrl;
  @Value("${kafka.producer.url.messages}")
  private String producerMessagesSuffix;
  @Value("${kafka.consumer.url}")
  private String kafkaConsumerUrl;
  @Value("${kafka.consumer.url.messages}")
  private String consumerMessagesSuffix;

  private static final String MESSAGES_TOPIC = "count-of-books";
  private static final String MESSAGES_GROUP = "user-orders";
  private static final String DELIMITER = ":";
  private static final String MESSAGES = "messages";

  private final RestTemplateBuilder templateBuilder;

  public void sendMessage(List<Order> orders)
  {
    long userId = orders.stream().findFirst().orElse(new Order()).getUserId();
    long countOfBooks = orders.stream().mapToLong(Order::getAmount).sum();
    RestTemplate restTemplate = templateBuilder.build();
    MessageDto messageDto = new MessageDto();
    messageDto.setUserId(String.valueOf(userId));
    messageDto.setOrdersCount((int)countOfBooks);
    log.error("Sending request to kafka producer {}", kafkaProducerUrl + producerMessagesSuffix);
    restTemplate.exchange(kafkaProducerUrl + producerMessagesSuffix, HttpMethod.POST, buildHttpEntity(messageDto),
        String.class);
  }

  public long getBooksCount(Long userId)
  {
    RestTemplate restTemplate = templateBuilder.build();
    MessagesPatternDto messagesPatternDto = new MessagesPatternDto();
    messagesPatternDto.setKeysPattern(String.join(DELIMITER, MESSAGES_GROUP, MESSAGES_TOPIC, userId + "_*"));
    log.error("Sending request to kafka consumer {}", kafkaConsumerUrl + consumerMessagesSuffix);
    String result = restTemplate
        .postForObject(kafkaConsumerUrl + consumerMessagesSuffix,
            buildHttpEntity(messagesPatternDto),
            String.class);
    return extractResult(result);
  }

  private long extractResult(String result)
  {
    JSONArray jsonArray = Optional.of(new JSONArray(result)).orElse(new JSONArray());

    return  IntStream.range(0, jsonArray.length())
        .mapToObj(jsonArray::optJSONObject)
        .mapToLong(jsonObject -> jsonObject.optLong("ordersCount"))
        .sum();
  }

  private HttpEntity<?> buildHttpEntity(Object body)
  {
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setContentType(MediaType.APPLICATION_JSON);
    httpHeaders.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
    return new HttpEntity<>(body, httpHeaders);
  }
}
