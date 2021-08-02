package com.nixsolutions.server.entity;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@RequiredArgsConstructor
@ToString
@Getter
@Setter
@Document(collection = "catalogs")
public class Catalog implements Serializable
{
  @Transient
  public static final String SEQUENCE_NAME = "catalogs_sequence";

  @Id
  private long id;
  @NonNull
  private String name;
}
