package com.nixsolutions.server.services;

import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.data.mongodb.core.mapping.event.BeforeSaveEvent;
import org.springframework.stereotype.Component;

import com.nixsolutions.server.entity.Book;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookModelListener extends AbstractMongoEventListener<Book>
{
  private final SequenceGeneratorService sequenceGeneratorService;

  @Override
  public void onBeforeConvert(BeforeConvertEvent<Book> event)
  {
    if (event.getSource().getId() < 1)
    {
      event.getSource().setId(sequenceGeneratorService.generateSequence(Book.SEQUENCE_NAME));
    }

  }

  @Override
  public void onBeforeSave(BeforeSaveEvent<Book> event) {
    //any kind of operations with entity berofew saving to DB
  }
}
