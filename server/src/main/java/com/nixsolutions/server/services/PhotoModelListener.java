package com.nixsolutions.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.data.mongodb.core.mapping.event.BeforeSaveEvent;
import org.springframework.stereotype.Component;

import com.nixsolutions.server.entity.users.Photo;

@Component
public class PhotoModelListener extends AbstractMongoEventListener<Photo>
{
  @Autowired
  private SequenceGeneratorService sequenceGeneratorService;

  @Override
  public void onBeforeConvert(BeforeConvertEvent<Photo> event)
  {
    if (event.getSource().getId() < 1)
    {
      event.getSource().setId(sequenceGeneratorService.generateSequence(Photo.SEQUENCE_NAME));
    }

  }

  @Override
  public void onBeforeSave(BeforeSaveEvent<Photo> event) {
    //any kind of operations with entity berofew saving to DB
  }
}