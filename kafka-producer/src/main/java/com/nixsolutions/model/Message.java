package com.nixsolutions.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public final class Message
{
  private String uuid;
  private String userId;
  private int ordersCount;
  private LocalDateTime time;
}
