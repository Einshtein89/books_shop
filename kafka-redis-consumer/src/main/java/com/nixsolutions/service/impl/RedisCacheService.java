package com.nixsolutions.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.nixsolutions.service.CacheService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisCacheService implements CacheService
{

  private final RedisTemplate<String, String> redisTemplate;

  @Override
  public void cacheObject(final String key, final String value)
  {
    log.info("Saving {} . With key {}.", key, value);
    redisTemplate.opsForValue().set(key, value);
  }

  @Override
  public List<String> getCachedValues(final String keysPattern)
  {
    log.info("Finding cached values with pattern: {}", keysPattern);
    final Set<String> keys = Optional.ofNullable(redisTemplate.keys(keysPattern)).orElse(new HashSet<>());
    return redisTemplate.opsForValue().multiGet(keys);
  }
}
