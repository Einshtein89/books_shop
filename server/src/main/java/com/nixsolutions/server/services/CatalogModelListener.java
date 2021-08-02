package com.nixsolutions.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;

import com.nixsolutions.server.entity.Catalog;

@Component
public class CatalogModelListener extends AbstractMongoEventListener<Catalog>
{
  @Autowired
  private SequenceGeneratorService sequenceGeneratorService;

  @Override
  public void onBeforeConvert(BeforeConvertEvent<Catalog> event)
  {
    if (event.getSource().getId() < 1)
    {
      event.getSource().setId(sequenceGeneratorService.generateSequence(Catalog.SEQUENCE_NAME));
    }
  }
}
