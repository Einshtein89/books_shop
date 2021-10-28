package com.nixsolutions.server.dao;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.nixsolutions.server.entity.users.User;

//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public interface UserRepository extends MongoRepository<User, Long>
{
  List<User> findByFirstNameAndLastName(@Param("firstName") String firstName, @Param("lastName") String lastName);
  List<User> findByFirstNameLikeIgnoreCaseOrLastNameLikeIgnoreCase(@Param("firstName") String firstName,
      @Param("lastName") String lastName);
  User findByEmail(@Param("email") String email);
  
  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  void deleteById(Long aLong);
  
  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  void delete(User user);

  @Override
  @PostAuthorize("returnObject.orElse(new com.nixsolutions.server.entity.users.User()).email == authentication.principal.username or hasRole('ROLE_ADMIN')")
  Optional<User> findById(Long aLong);
}
