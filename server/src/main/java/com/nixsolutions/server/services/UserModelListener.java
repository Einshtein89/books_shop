package com.nixsolutions.server.services;

import static java.util.Objects.nonNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.data.mongodb.core.mapping.event.BeforeSaveEvent;
import org.springframework.stereotype.Component;

import com.nixsolutions.server.dao.PhotoRepository;
import com.nixsolutions.server.entity.users.Photo;
import com.nixsolutions.server.entity.users.User;

@Component
public class UserModelListener extends AbstractMongoEventListener<User>
{
  @Autowired
  private SequenceGeneratorService sequenceGeneratorService;
  @Autowired
  private PhotoRepository photoRepository;

  @Override
  public void onBeforeConvert(BeforeConvertEvent<User> event)
  {
    if (event.getSource().getId() < 1)
    {
      event.getSource().setId(sequenceGeneratorService.generateSequence(User.SEQUENCE_NAME));
    }

  }

  @Override
  public void onBeforeSave(BeforeSaveEvent<User> event) {
    User source = event.getSource();
    Photo photo = source.getPhoto();
    if (nonNull(photo)) {
      photoRepository.save(photo);
    }
  }
}
