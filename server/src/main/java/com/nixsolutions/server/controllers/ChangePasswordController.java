package com.nixsolutions.server.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nixsolutions.server.configs.jwttoken.TokenProvider;
import com.nixsolutions.server.dao.UserRepository;
import com.nixsolutions.server.entity.users.PasswordChange;
import com.nixsolutions.server.entity.users.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/changePassword")
@RequiredArgsConstructor
public class ChangePasswordController
{
  private final TokenProvider tokenProvider;
  private final UserRepository userRepository;
  private final BCryptPasswordEncoder bCryptPasswordEncoder;
  
  @PostMapping
  public ResponseEntity<?> saveUserPhoto(@RequestBody PasswordChange passwordChange)
  {
    long userId = passwordChange.getUserId();
    if (userId <= 0)
    {
      return new ResponseEntity<>("user.doesn't.exists.error", new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }
    User currentUser = userRepository.findById(userId).orElseThrow(
        () -> new RuntimeException("cannot find user with id: " + userId));
    if (!bCryptPasswordEncoder.matches(passwordChange.getOldPassword(), currentUser.getPassword()))
    {
      return new ResponseEntity<>("old.password.doesn't.match.error", new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }
    currentUser.setPassword(bCryptPasswordEncoder.encode(passwordChange.getNewPassword()));
    userRepository.save(currentUser);
    return ResponseEntity.ok(passwordChange);
  }
}
