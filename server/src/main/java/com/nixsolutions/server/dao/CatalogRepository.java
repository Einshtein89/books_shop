package com.nixsolutions.server.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.nixsolutions.server.entity.Catalog;

//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RepositoryRestResource(collectionResourceRel = "catalogs", path = "catalogs")
public interface CatalogRepository extends MongoRepository<Catalog, Long>
{
  Catalog findCatalogByName(@Param("catalogName") String catalogName);
}
