package com.nixsolutions.configuration;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import com.nixsolutions.model.Message;

@Configuration
@EnableKafka
public class KafkaConsumerConfiguration
{

  @Value("${kafka.bootstrapAddress}")
  private String bootstrapAddress;

  @Bean
  public ConsumerFactory<String, Message> consumerFactory()
  {
    final Map<String, Object> props = new HashMap<>();
    final StringDeserializer stringDeserializer = new StringDeserializer();
    final JsonDeserializer<Message> jsonDeserializer = new JsonDeserializer<>();
    jsonDeserializer.addTrustedPackages("*");
    props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, true);
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapAddress);
    props.put(ConsumerConfig.GROUP_ID_CONFIG, "user-orders");
//    props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "com.example.model.AvroGenericRecordDeserializer");
//    props.put("SCHEMA", SchemaRepository.instance().getSchemaObject());
    return new DefaultKafkaConsumerFactory<>(props, stringDeserializer, jsonDeserializer);
  }

  @Bean
  public ConcurrentKafkaListenerContainerFactory<String, Message> kafkaListenerContainerFactory()
  {
    final ConcurrentKafkaListenerContainerFactory<String, Message> factory =
        new ConcurrentKafkaListenerContainerFactory<>();
    factory.setConsumerFactory(consumerFactory());
    return factory;
  }
}
