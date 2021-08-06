package com.nixsolutions.model.message;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.apache.avro.generic.GenericRecord;
import org.apache.avro.util.Utf8;

import avro.Message;
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
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd LLLL yyyy");
    return new Message(UUID.randomUUID().toString(), userId, ordersCount, LocalDate.now().format(formatter));
  }

  public static Message convertToMessage(GenericRecord record)
  {
    return new Message(convertFromUtf8((Utf8) record.get("uuid")), convertFromUtf8((Utf8) record.get("userId")),
        (int)record.get("ordersCount"),  convertFromUtf8((Utf8) record.get("time")));
  }

  private static String convertFromUtf8(Utf8 value)
  {
    return value.toString();
  }
}
