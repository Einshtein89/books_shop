package com.nixsolutions.server.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public final class MessageDto
{
  private long userId;
  private long ordersCount;
}
