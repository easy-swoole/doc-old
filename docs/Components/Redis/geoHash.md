---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现,覆盖了redis 99%的方法
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole redis| Swoole redis协程客户端|swoole Redis|redis协程
---
## geoHash方法


| 方法名称          | 参数                                                                                                                                                                             | 说明                                                                                                                             | 备注                                                                                                                   |
|:------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------|
| geoAdd            | $key, $locationData                                                                                                                                                              | 新增geohash数据                                                                                                                   | $locationData为一个数组,写法为:\[\[longitude=>'',latitude=>'',name=>'']] 或者 $locationData\[\[longitude,latitude,name]] |
| geoDist           | $key, $location1, $location2, $unit = 'm'                                                                                                                                        | 返回排序集合表示的地理空间索引中两个成员之间的距离。                                                                                   |                                                                                                                       |
| geoHash           | $key, $location, ...$locations                                                                                                                                                   | 返回表示地理空间索引的hash值                                                                                                        |                                                                                                                       |
| geoPos            | $key, $location1, ...$locations                                                                                                                                                  | 返回按键处有序集合表示的地理空间索引的所有指定成员的位置（经度，纬度）。                                                                 |                                                                                                                       |
| geoRadius         | $key, $longitude, $latitude, $radius, $unit = 'm', $withCoord = false, $withDist = false, $withHash = false, $count = null, $sort = null, $storeKey = null, $storeDistKey = null | 返回填充了地理空间信息的已排序集合的成员                                                                                             |                                                                                                                       |
| geoRadiusByMember | $key, $location, $radius, $unit = 'm', $withCoord = false, $withDist = false, $withHash = false, $count = null, $sort = null, $storeKey = null, $storeDistKey = null             | 该命令与 GEORADIUS 完全相同，唯一的区别在于，它不是以查询区域的中心为经度和纬度值，而是采用已存在于有序集合所代表的地理空间索引内的成员的名称。 |                                                                                                                       |


## 实例
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
