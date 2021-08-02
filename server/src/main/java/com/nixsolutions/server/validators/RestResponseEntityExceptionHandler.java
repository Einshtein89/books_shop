package com.nixsolutions.server.validators;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.rest.core.RepositoryConstraintViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler
{
  @ExceptionHandler({ RepositoryConstraintViolationException.class })
  public ResponseEntity<Object> prettifyValidationException(Exception ex, WebRequest request) {
    RepositoryConstraintViolationException nevEx =
        (RepositoryConstraintViolationException) ex;

    List<String> errors = nevEx.getErrors().getAllErrors().stream()
        .map(ObjectError::getCode)
        .collect(Collectors.toList());

    return new ResponseEntity<Object>(errors, new HttpHeaders(), HttpStatus.BAD_REQUEST);
  }
}

