package com.nixsolutions.server.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.nixsolutions.server.entity.OrderPosition;

//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RepositoryRestResource(collectionResourceRel = "orderPositions", path = "orderPositions")
public interface OrderRepository extends MongoRepository<OrderPosition, Long>
{
//  @Query("SELECT order FROM Order order WHERE order.userId = :userId order by order.uniqueId")
  List<OrderPosition> getAllByUserIdOrderById(@Param("userId") long userId);
}
