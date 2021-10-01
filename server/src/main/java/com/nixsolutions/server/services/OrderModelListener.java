package com.nixsolutions.server.services;

import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.data.mongodb.core.mapping.event.BeforeSaveEvent;
import org.springframework.stereotype.Component;

import com.nixsolutions.server.entity.OrderPosition;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderModelListener extends AbstractMongoEventListener<OrderPosition>
{
  private final SequenceGeneratorService sequenceGeneratorService;

  @Override
  public void onBeforeConvert(BeforeConvertEvent<OrderPosition> event)
  {
    if (event.getSource().getId() < 1)
    {
      event.getSource().setId(sequenceGeneratorService.generateSequence(OrderPosition.SEQUENCE_NAME));
    }
  }

  @Override
  public void onBeforeSave(BeforeSaveEvent<OrderPosition> event) {
    //any kind of operations with entity berofew saving to DB
  }
}
