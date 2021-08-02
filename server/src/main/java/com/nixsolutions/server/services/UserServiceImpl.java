package com.nixsolutions.server.services;

import java.util.HashSet;
import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.nixsolutions.server.dao.UserRepository;
import com.nixsolutions.server.entity.users.User;


@Service(value = "userService")
@Transactional
public class UserServiceImpl implements UserDetailsService {

  @Autowired
  private UserRepository userRepository;

  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(email);
    if(user == null){
      throw new UsernameNotFoundException("Invalid username or password.");
    }
    return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), getAuthority(user));
  }

  private Set getAuthority(User user) {
    Set authorities = new HashSet<>();
    user.getRoles().forEach(role -> {
      authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRole()));
    });
    return authorities;
  }
}
