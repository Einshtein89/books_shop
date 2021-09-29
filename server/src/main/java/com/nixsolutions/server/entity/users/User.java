package com.nixsolutions.server.entity.users;

import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@ToString
@Getter
@Setter
@Document(collection = "users")
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {

  @Transient
  public static final String SEQUENCE_NAME = "users_sequence";

  @Id
  private long id;
  @NonNull
  @Indexed(unique = true)
  private String email;
  @NonNull
  private String password;
  @NonNull
  private String firstName;
  @NonNull
  private String lastName;
  @NonNull
  private String phone;
  @NonNull
  private String sex;

  private int active;
  @DBRef
  private Set<Role> roles;
  @DBRef
  private Photo photo;

  public User(
      @NonNull String email,
      @NonNull String password,
      @NonNull String firstName,
      @NonNull String lastName,
      @NonNull String phone,
      @NonNull String sex,
      Set<Role> roles)
  {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.sex = sex;
    this.roles = roles;
  }
}
