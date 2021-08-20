package com.nixsolutions.server.entity;

import java.io.Serializable;
import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@ToString
@Getter
@Setter
@Document(collection = "orderPositions")
public class OrderPosition implements Serializable
{
  @Transient
  public static final String SEQUENCE_NAME = "orders_sequence";

  @Id
  private long id;

  private long bookId;

  private long userId;
  private long amount;
  private LocalDate date;
  private long uniqueId;

  public OrderPosition(OrderPosition orderPosition)
  {
    this.id = orderPosition.id;
    this.uniqueId = orderPosition.uniqueId;
    this.bookId = orderPosition.bookId;
    this.userId = orderPosition.userId;
    this.amount = orderPosition.amount;
    this.date = orderPosition.date;
  }
}
