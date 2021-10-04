package com.nixsolutions.server.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.nixsolutions.server.entity.Book;

//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RepositoryRestResource(collectionResourceRel = "books", path = "books")
public interface BookRepository extends MongoRepository<Book, Long>
{
  //  In case of using DBRef anootation for embedded objects, we can only search by object Id field with next query:
  @Query("{'catalog.$id': ?0}")
  Page<Book> findByCatalogId(@Param("catalogId") long catalogId, Pageable p);
  Page<Book> findByCatalogName(@Param("catalogName") String catalogName, Pageable p);

  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  void deleteById(Long id);

  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  void delete(Book book);
}
