package com.nixsolutions;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KafkaRedisConsumerApplication
{
  public static void main(String[] args)
  {
    SpringApplication.run(KafkaRedisConsumerApplication.class, args);
  }
}
