package com.nixsolutions.server.configs;

public class Constants {
  public static final String USER_ROLE = "USER";
  public static final String ADMIN_ROLE = "ROLE_ADMIN";
  public static final long ACCESS_TOKEN_VALIDITY_SECONDS = 5*60*60;
  public static final String SIGNING_KEY = "angularTest";
  public static final String TOKEN_PREFIX = "Bearer ";
  public static final String HEADER_STRING_AUTHORIZATION = "Authorization";
  public static final String AUTHORITIES_KEY = "scopes";
  public static final String REGISTRATION = "Registration";
  public static final int PASSWORD_MAX_LENGTH = 20;
}
