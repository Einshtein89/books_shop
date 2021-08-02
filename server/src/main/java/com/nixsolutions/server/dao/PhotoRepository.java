package com.nixsolutions.server.dao;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nixsolutions.server.entity.users.Photo;

public interface PhotoRepository extends MongoRepository<Photo, Integer>
{
}
