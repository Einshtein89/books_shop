package com.nixsolutions.server.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderMessage
{
  private String orderId;
  private int ordersCount;
}
