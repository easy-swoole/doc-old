---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---
## geoHash方法


| Method name     | Parameter                | Description          | Notes                 |
|:----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------|
| geoAdd          | $key, $locationData    | ## Instance...      | $locationData为一个数组,写法为:\[\[longitude=>'',latitude=>'',name=>'']] 或者 $locationData\[\[longitude,latitude,name]] |
| geoDist         | $key, $location1, $location2, $unit = 'm'       | Returns the distance between two members in the geospatial index represented by the sorted collection.  |  |
| geoHash           | $key, $location, ...$locations                | Returns a hash value representing the geospatial index    |    |
| geoPos            | $key, $location1, ...$locations               | Returns the position (longitude, latitude) of all specified members of the geospatial index represented by the ordered collection at the button.  |  |
| geoRadius         | $key, $longitude, $latitude, $radius, $unit = 'm', $withCoord = false, $withDist = false, $withHash = false, $count = null, $sort = null, $storeKey = null, $storeDistKey = null | Returns members of a sorted collection populated with geospatial information  |    |
| geoRadiusByMember | $key, $location, $radius, $unit = 'm', $withCoord = false, $withDist = false, $withHash = false, $count = null, $sort = null, $storeKey = null, $storeDistKey = null             | This command is identical to GEORADIUS, except that it does not use the center of the query area as the longitude and latitude values, but the name of the member that already exists in the geospatial index represented by the ordered set. |  |


## Instance
```php

go(function () {
    $redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]));;

    $key = 'testGeohash';

    $redis->del($key);
    $data = $redis->geoAdd($key, [
        ['118.6197800000', '24.88849', 'user1',],
        ['118.6197800000', '24.88859', 'user2',],
        ['114.8197800000', '25.88849', 'user3'],
        ['118.8197800000', '22.88849', 'user4'],
    ]);
    var_dump($data);

    $data = $redis->geoDist($key, 'user1', 'user2');
    var_dump($data);

    $data = $redis->geoHash($key, 'user1', 'user2');
    var_dump($data);

    $data = $redis->geoPos($key, 'user1', 'user2');
    var_dump($data);

    $data = $redis->geoRadius($key, '118.6197800000', '24.88849', 100, 'm', false, false, false, 'desc');
    var_dump($data);

    $data = $redis->geoRadiusByMember($key, 'user1', 100, 'm', false, false, false, 'desc');
    var_dump($data);
});
```
