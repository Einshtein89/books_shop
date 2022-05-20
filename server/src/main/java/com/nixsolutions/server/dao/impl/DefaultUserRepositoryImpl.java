package com.nixsolutions.server.dao.impl;

import static com.nixsolutions.server.configs.Constants.PASSWORD_MAX_LENGTH;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.nixsolutions.server.dao.RoleRepository;
import com.nixsolutions.server.dao.UserRepository;
import com.nixsolutions.server.entity.users.Role;
import com.nixsolutions.server.entity.users.User;

import io.jsonwebtoken.lang.Collections;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Primary
@Slf4j
@RequiredArgsConstructor
public class DefaultUserRepositoryImpl implements UserRepository
{
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final BCryptPasswordEncoder passwordEncoder;

  @Override
  public List<User> findByFirstNameAndLastName(
      String firstName, String lastName)
  {
    return userRepository.findByFirstNameAndLastName(firstName, lastName);
  }

  @Override
  public List<User> findByFirstNameLikeIgnoreCaseOrLastNameLikeIgnoreCase(String firstName, String lastName)
  {
    return userRepository.findByFirstNameLikeIgnoreCaseOrLastNameLikeIgnoreCase(firstName, lastName);
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
      log.info("Finding roles for user");
      HashSet<Role> roles = new HashSet<>();
      Role role = roleRepository.findByRole("USER");
      roles.add(role);
      log.info("Roles found" + role);
      s.setRoles(roles);
    }
    return userRepository.save(s);
  }

  @Override
  public <S extends User> List<S> saveAll(Iterable<S> iterable)
  {
    return userRepository.saveAll(iterable);
  }

  @Override
  public Optional<User> findById(Long aLong)
  {
    return userRepository.findById(aLong);
  }

  @Override
  public boolean existsById(Long aLong)
  {
    return userRepository.existsById(aLong);
  }

  @Override
  public List<User> findAll()
  {
    return userRepository.findAll();
  }

  @Override
  public Iterable<User> findAllById(Iterable<Long> iterable)
  {
    return userRepository.findAllById(iterable);
  }
  
  @Override
  public long count()
  {
    return userRepository.count();
  }
  
  @Override
  public void deleteById(Long aLong)
  {
    userRepository.deleteById(aLong);
  }
  
  @Override
  public void delete(User user)
  {
    userRepository.delete(user);
  }

  @Override
  public void deleteAllById(Iterable<? extends Long> iterable)
  {
    userRepository.deleteAllById(iterable);
  }

  @Override
  public void deleteAll(Iterable<? extends User> iterable)
  {
    userRepository.deleteAll(iterable);
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
  public <S extends User> Optional<S> findOne(Example<S> example)
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
  public <S extends User, R> R findBy(Example<S> example, Function<FetchableFluentQuery<S>, R> queryFunction)
  {
    return userRepository.findBy(example, queryFunction);
  }

  @Override
  public Page<User> findAll(Pageable pageable)
  {
    return userRepository.findAll(pageable);
  }
}
