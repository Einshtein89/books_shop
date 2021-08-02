package com.nixsolutions.server.dao.impl;

import static com.nixsolutions.server.configs.Constants.PASSWORD_MAX_LENGTH;

import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.nixsolutions.server.dao.RoleRepository;
import com.nixsolutions.server.dao.UserRepository;
import com.nixsolutions.server.entity.users.Role;
import com.nixsolutions.server.entity.users.User;

import io.jsonwebtoken.lang.Collections;

@Component
@Primary
public class DefaultUserRepositoryImpl implements UserRepository
{
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private RoleRepository roleRepository;
  @Autowired
  private BCryptPasswordEncoder passwordEncoder;
  
  @Override
  public List<User> findByFirstNameAndLastName(
      String firstName, String lastName)
  {
    return userRepository.findByFirstNameAndLastName(firstName, lastName);
  }
  
  @Override
  public List<User> findByFirstNameContainsOrLastNameContains(String firstName, String lastName)
  {
    return userRepository.findByFirstNameContainsOrLastNameContains(firstName, lastName);
  }
  
  @Override
  public User findByEmail(String email)
  {
    return userRepository.findByEmail(email);
  }
  
  @Override
  public <S extends User> S save(S s)
  {
    if (s.getPassword().length() <= PASSWORD_MAX_LENGTH)
    {
      String encodedPassword = passwordEncoder.encode(s.getPassword());
      s.setPassword(encodedPassword);
    }
    if (Collections.isEmpty(s.getRoles()))
    {
      HashSet<Role> roles = new HashSet<>();
      roles.add(roleRepository.findByRole("USER"));
      s.setRoles(roles);
    }
    return userRepository.save(s);
  }
  
  @Override
  public <S extends User> List<S> save(Iterable<S> iterable)
  {
    return userRepository.save(iterable);
  }
  
  @Override
  public User findOne(Long aLong)
  {
    return userRepository.findOne(aLong);
  }
  
  @Override
  public boolean exists(Long aLong)
  {
    return userRepository.exists(aLong);
  }
  
  @Override
  public List<User> findAll()
  {
    return userRepository.findAll();
  }
  
  @Override
  public Iterable<User> findAll(Iterable<Long> iterable)
  {
    return userRepository.findAll(iterable);
  }
  
  @Override
  public long count()
  {
    return userRepository.count();
  }
  
  @Override
  public void delete(Long aLong)
  {
    userRepository.delete(aLong);
  }
  
  @Override
  public void delete(User user)
  {
    userRepository.delete(user);
  }
  
  @Override
  public void delete(Iterable<? extends User> iterable)
  {
    userRepository.delete(iterable);
  }
  
  @Override
  public void deleteAll()
  {
    userRepository.deleteAll();
  }
  
  @Override
  public List<User> findAll(Sort sort)
  {
    return userRepository.findAll(sort);
  }

  @Override
  public <S extends User> S insert(S s)
  {
    return userRepository.insert(s);
  }

  @Override
  public <S extends User> List<S> insert(Iterable<S> iterable)
  {
    return userRepository.insert(iterable);
  }

  @Override
  public <S extends User> S findOne(Example<S> example)
  {
    return userRepository.findOne(example);
  }

  @Override
  public <S extends User> List<S> findAll(Example<S> example)
  {
    return userRepository.findAll(example);
  }

  @Override
  public <S extends User> List<S> findAll(Example<S> example, Sort sort)
  {
    return userRepository.findAll(example, sort);
  }

  @Override
  public <S extends User> Page<S> findAll(Example<S> example, Pageable pageable)
  {
    return userRepository.findAll(example, pageable);
  }

  @Override
  public <S extends User> long count(Example<S> example)
  {
    return userRepository.count(example);
  }

  @Override
  public <S extends User> boolean exists(Example<S> example)
  {
    return userRepository.exists(example);
  }

  @Override
  public Page<User> findAll(Pageable pageable)
  {
    return userRepository.findAll(pageable);
  }
}
