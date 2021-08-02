package com.nixsolutions.server.dao;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.nixsolutions.server.entity.users.Role;

@RepositoryRestResource(collectionResourceRel = "roles", path = "roles")
public interface RoleRepository extends PagingAndSortingRepository<Role, Integer>
{
	Role findByRole(String role);
}
