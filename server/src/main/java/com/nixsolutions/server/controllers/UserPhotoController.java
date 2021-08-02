package com.nixsolutions.server.controllers;

import static com.nixsolutions.server.configs.Constants.HEADER_STRING_AUTHORIZATION;
import static org.apache.commons.lang3.StringUtils.SPACE;

import java.io.IOException;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nixsolutions.server.configs.jwttoken.TokenProvider;
import com.nixsolutions.server.dao.UserRepository;
import com.nixsolutions.server.entity.users.Photo;
import com.nixsolutions.server.entity.users.User;
import com.nixsolutions.server.services.SequenceGeneratorService;

@RestController
@RequestMapping("/api/userPhotoUpload")
public class UserPhotoController
{
  @Autowired
  private TokenProvider tokenProvider;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private SequenceGeneratorService sequenceGeneratorService;
  
  @PostMapping
  public ResponseEntity<?> saveUserPhoto(
      HttpServletRequest req,
      HttpServletResponse res,
      @RequestParam("image") MultipartFile photo)
  {
    String authorizationHeader = req.getHeader(HEADER_STRING_AUTHORIZATION);
    String token = authorizationHeader.substring(authorizationHeader.indexOf(SPACE));
    String usernameFromToken = tokenProvider.getUsernameFromToken(token);
    User currentUser = userRepository.findByEmail(usernameFromToken);
    if (Objects.isNull(currentUser))
    {
      return new ResponseEntity<>("user.doesn't.exists.error", new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }
    
    try
    {
      long photoId = sequenceGeneratorService.generateSequence(Photo.SEQUENCE_NAME);
      currentUser.setPhoto(new Photo(photoId, photo.getName(), photo.getBytes()));
    }
    catch (IOException e)
    {
      return new ResponseEntity<Object>(e, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }
    userRepository.save(currentUser);
    
    return ResponseEntity.ok(currentUser);
    
  }
}
