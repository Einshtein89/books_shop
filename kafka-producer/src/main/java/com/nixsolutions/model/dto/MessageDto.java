package com.nixsolutions.model.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.nixsolutions.model.Message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public final class MessageDto
{

  private String userId;
  private int ordersCount;

  public Message convertToMessage()
  {
    return new Message(UUID.randomUUID().toString(), userId, ordersCount, LocalDateTime.now());
  }
}
