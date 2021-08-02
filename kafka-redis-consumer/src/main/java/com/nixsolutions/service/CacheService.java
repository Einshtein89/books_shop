package com.nixsolutions.service;

import java.util.List;

public interface CacheService
{

  void cacheObject(String key, String value);

  List<String> getCachedValues(String keysPattern);
}
