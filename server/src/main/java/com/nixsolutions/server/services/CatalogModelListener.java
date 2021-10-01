package com.nixsolutions.server.services;

import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;

import com.nixsolutions.server.entity.Catalog;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CatalogModelListener extends AbstractMongoEventListener<Catalog>
{
  private final SequenceGeneratorService sequenceGeneratorService;

  @Override
  public void onBeforeConvert(BeforeConvertEvent<Catalog> event)
  {
    if (event.getSource().getId() < 1)
    {
      event.getSource().setId(sequenceGeneratorService.generateSequence(Catalog.SEQUENCE_NAME));
    }
  }
}
