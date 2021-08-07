package com.nixsolutions.server.entity.users;


import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@RequiredArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Document(collection = "roles")
public class Role {

  @Transient
  public static final String SEQUENCE_NAME = "roles_sequence";
 @Id
  private long id;
  @NonNull
  private String role;

}
