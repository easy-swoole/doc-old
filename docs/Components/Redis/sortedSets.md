---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现,覆盖了redis 99%的方法
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole redis| Swoole redis协程客户端|swoole Redis|redis协程
---

## 有序集合操作方法

方法列表

| 方法名称         | 参数                                                               | 说明                                                          | 备注 |
|:-----------------|:-------------------------------------------------------------------|:-------------------------------------------------------------|:----|
| zAdd             | $key, $score1, $member1, ...$data                                  | 向有序集合添加一个或多个成员，或者更新已存在成员的分数             |     |
| zCard            | $key                                                               | 获取有序集合的成员数                                            |     |
| zCount           | $key, $min, $max                                                   | 计算在有序集合中指定区间分数的成员数                             |     |
| zInCrBy          | $key, $increment, $member                                          | 有序集合中对指定成员的分数加上增量 increment                     |     |
| zInTerStore      | $destination, array $keys, array $weights = [], $aggregate = 'SUM' | 计算给定的一个或多个有序集的交集并将结果集存储在新的有序集合 key 中 |     |
| zLexCount        | $key, $min, $max                                                   | 在有序集合中计算指定字典区间内成员数量                            |     |
| zRange           | $key, $start, $stop, $withScores = false                           | 通过索引区间返回有序集合指定区间内的成员                          |     |
| zRangeByLex      | $key, $min, $max, ...$data                                         | 通过字典区间返回有序集合的成员                                   |     |
| zRangeByScore    | $key, $min, $max, array $options                                   | 通过分数返回有序集合指定区间内的成员                             |     |
| zRank            | $key, $member                                                      | 返回有序集合中指定成员的索引                                     |     |
| zRem             | $key, $member, ...$members                                         | 移除有序集合中的一个或多个成员                                   |     |
| zRemRangeByLex   | $key, $min, $max                                                   | 移除有序集合中给定的字典区间的所有成员                            |     |
| zRemRangeByRank  | $key, $start, $stop                                                | 移除有序集合中给定的排名区间的所有成员                            |     |
| zRemRangeByScore | $key, $min, $max                                                   | 移除有序集合中给定的分数区间的所有成员                            |     |
| zRevRange        | $key, $start, $stop, $withScores = false                           | 返回有序集中指定区间内的成员，通过索引，分数从高到低               |     |
| zRevRangeByScore | $key, $max, $min, array $options                                   | 返回有序集中指定分数区间内的成员，分数从高到低排序                 |     |
| zRevRank         | $key, $member                                                      | 返回有序集合中指定成员的排名，有序集成员按分数值递减(从大到小)排序   |     |
| zScore           | $key, $member                                                      | 返回有序集中，成员的分数值                                      |     |
| zUnionStore      | $destination, array $keys, array $weights = [], $aggregate = 'SUM' | 计算给定的一个或多个有序集的并集，并存储在新的 key 中              |     |
| zScan            | $key,&$cursor, $pattern=null, $count=null                          | 迭代有序集合中的元素（包括元素成员和元素分值）                     |     |


::: warning
 在集群模式中,zInTerStore,zUnionStore 等方法不能使用
:::


## 实例
```php
go(function (){
	$redis =  new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]));
    $key = [
            'sortMuster1',
            'sortMuster2',
            'sortMuster3',
            'sortMuster4',
            'sortMuster5',
        ];
    $member = [
        'member1',
        'member2',
        'member3',
        'member4',
        'member5',
    ];
    $score = [
        1,
        2,
        3,
        4,
    ];
    $redis->del($key[0]);
    $data = $redis->zAdd($key[0], $score[0], $member[0], $score[1], $member[1]);
    var_dump($data);
    
    $data = $redis->zCard($key[0]);
    var_dump($data);
    
    $data = $redis->zCount($key[0], 0, 3);
    var_dump($data);
    
    $data = $redis->zInCrBy($key[0], 1, $member[1]);
    var_dump($data);
    
    $redis->del($key[0]);
    $redis->del($key[1]);
    $redis->zAdd($key[0], $score[0], $member[0], $score[1], $member[1]);
    $redis->zAdd($key[1], $score[0], $member[0], $score[3], $member[3]);
    $data = $redis->zInTerStore($key[2], [$key[0], $key[1]], [1, 2]);
    var_dump($data);
    
    $data = $redis->zLexCount($key[0], '-', '+');
    var_dump($data);
    
    $redis->del($key[0]);
    $redis->zAdd($key[0], $score[0], $member[0], $score[1], $member[1], $score[2], $member[2]);
    $data = $redis->zRange($key[0], 0, -1, true);
    var_dump($data);
    
    $data = $redis->zRangeByLex($key[0], '-', '+');
    var_dump($data);
    
    $data = $redis->zRangeByScore($key[0], 2, 3, ['withScores' => true, 'limit' => array(0, 2)]);
    var_dump($data);
    
    $data = $redis->zRank($key[0], $member[1]);
    var_dump($data);
    
    $data = $redis->zRem($key[0], $member[1], $member[2]);
    var_dump($data);
    
    $redis->del($key[0]);
    $redis->zAdd($key[0], $score[0], $member[0], $score[1], $member[1], $score[2], $member[2]);
    $data = $redis->zRemRangeByLex($key[0], '-', '+');
    var_dump($data);
    
    $redis->del($key[0]);
    $redis->zAdd($key[0], $score[0], $member[0], $score[1], $member[1], $score[2], $member[2]);
    $data = $redis->zRemRangeByRank($key[0], 0, 2);
    var_dump($data);
    
    $redis->del($key[0]);
    $redis->zAdd($key[0], $score[0], $member[0], $score[1], $member[1], $score[2], $member[2]);
    $data = $redis->zRemRangeByScore($key[0], 0, 3);
    var_dump($data);
    
    $redis->del($key[0]);
    $redis->zAdd($key[0], $score[0], $member[0], $score[1], $member[1], $score[2], $member[2]);
    $data = $redis->zRevRange($key[0], 0, 3, true);
    var_dump($data);
    
    $redis->del($key[0]);
    $redis->zAdd($key[0], $score[0], $member[0], $score[1], $member[1], $score[2], $member[2]);
    $data = $redis->zRevRangeByScore($key[0], 3, 0, ['withScores' => true, 'limit' => array(0, 3)]);
    var_dump($data);
    
    $data = $redis->zRevRank($key[0], $member[0]);
    var_dump($data);
    
    $data = $redis->zScore($key[0], $member[0]);
    var_dump($data);
    
    $redis->del($key[0]);
    $redis->del($key[1]);
    $redis->del($key[2]);
    $redis->zAdd($key[0], $score[0], $member[0], $score[1], $member[1]);
    $redis->zAdd($key[1], $score[0], $member[0], $score[3], $member[3]);
    $data = $redis->zUnionStore($key[2], [$key[1], $key[0]]);
    var_dump($data);
    
    $cursor = 0;
    $redis->del('a');
    $redis->zAdd('a',1,'a1',2,'a2',3,'a3',4,'a4',5,'a5');
    $data = [];
    do {
        $keys = $redis->zScan('a',$cursor,'*',1);
        $data = array_merge($data,$keys);
    } while ($cursor);
    var_dump($data);
    
})
```
