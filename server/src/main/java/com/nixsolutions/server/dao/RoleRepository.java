package com.nixsolutions.server.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.nixsolutions.server.entity.users.Role;

@RepositoryRestResource(collectionResourceRel = "roles", path = "roles")
public interface RoleRepository extends MongoRepository<Role, Long>
{
	Role findByRole(String role);

  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  void deleteById(Long id);

  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  void delete(Role role);
}
