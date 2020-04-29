---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---

## Ordered collection operation method

Method list

| Method name         | Parameter                                                               | Description                                                          | Notes |
|:-----------------|:-------------------------------------------------------------------|:-------------------------------------------------------------|:----|
| zAdd             | $key, $score1, $member1, ...$data                                  | Add one or more members to an ordered collection, or update the scores of existing members    |     |
| zCard            | $key                                                               | Get the number of members of an ordered collection                  |     |
| zCount           | $key, $min, $max                                                   | Calculate the number of members specifying the interval score in an ordered collection           |     |
| zInCrBy          | $key, $increment, $member                                          | The fraction of the specified member in the ordered collection plus the increment increment            |     |
| zInTerStore      | $destination, array $keys, array $weights = [], $aggregate = 'SUM' | Computes the intersection of a given set of one or more ordered sets and stores the result set in a new ordered set key |     |
| zLexCount        | $key, $min, $max                                                   | Calculate the number of members in a specified dictionary interval in an ordered collection           |     |
| zRange           | $key, $start, $stop, $withScores = false                           | Returns the members of the specified range in the ordered collection through the index interval          |     |
| zRangeByLex      | $key, $min, $max, ...$data                                         | Returning members of an ordered collection through a dictionary interval              |     |
| zRangeByScore    | $key, $min, $max, array $options                                   | Returning the members of the specified range by the ordered set by the score           |     |
| zRank            | $key, $member                                                      | Returns the index of the specified member in the ordered collection               |     |
| zRem             | $key, $member, ...$members                                         | Remove one or more members from an ordered collection              |     |
| zRemRangeByLex   | $key, $min, $max                                                   | Remove all members of a given dictionary interval in an ordered collection           |     |
| zRemRangeByRank  | $key, $start, $stop                                                | Remove all members of a given ranking interval from an ordered collection           |     |
| zRemRangeByScore | $key, $min, $max                                                   | Remove all members of a given score interval in an ordered collection           |     |
| zRevRange        | $key, $start, $stop, $withScores = false                           | Returns the members in the specified interval in the ordered set, through the index, the score is from high to low     |     |
| zRevRangeByScore | $key, $max, $min, array $options                                   | Returns the members in the specified fractional interval in the ordered set, sorting the scores from high to low      |     |
| zRevRank         | $key, $member                                                      | Returns the rank of the specified member in the ordered collection, the ordered members are sorted by the fractional value (large to small) |     |
| zScore           | $key, $member                                                      | Returns the ordered set, the member's score               |     |
| zUnionStore      | $destination, array $keys, array $weights = [], $aggregate = 'SUM' | Computes the union of a given set of one or more ordered sets and stores them in a new key       |     |
| zScan            | $key,&$cursor, $pattern=null, $count=null                          | Iterate over the elements in an ordered collection (including element members and element scores)        |     |


::: warning
 In cluster mode, methods such as zInTerStore, zUnionStore cannot be used.
:::


## Instance
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
