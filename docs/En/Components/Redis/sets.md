---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---

## Collection operation method

Method list

| Method name    | Parameter                                      | Description                                              | Notes |
|:------------|:------------------------------------------|:-------------------------------------------------|:----|
| sAdd        | $key, ...$data                            | Add one or more members to the collection|     |
| sCard       | $key                                      | Get the number of members of the collection   |     |
| sDiff       | $key1, ...$keys                           | Returns the difference set for all sets |     |
| sMembers    | $destination, ...$keys                    | Return all members in the collection |     |
| sDiffStore  | $key1, ...$keys                           | Returns the difference set for all collections and stores them in destination |   |
| sInter      | $destination, ...$keys                    | Returns the intersection of all the given sets |     |
| sInterStore | $key, $member                             | Returns the intersection of all the collections given and stored in destination |   |
| sIsMember   | $key                                      | Determine if the member element is a member of the collection key|     |
| sMove       | $source, $destination, $member            | Move the member element from the source collection to the destination collection |     |
| sPop        | $key                                      | Remove and return a random element in the collection |   |
| sRandMemBer | $key, $count = null                       | Return one or more random numbers in the collection |     |
| sRem        | $key, $member1, ...$members               | Remove one or more members from the collection|     |
| sUnion      | $key1, ...$keys                           | Returns the union of all given collections |     |
| sUnIonStore | $destination, $key1, ...$keys             | The union of all given collections is stored in the destination collection |   |
| sScan       | $key,&$cursor, $pattern=null, $count=null | Iterating over the elements in the collection   |     |

::: warning
 In cluster mode, sDiff, sDiffStore, sInter, sMove, sUnion, sUnIonStore, etc. cannot be used.
:::


## Instance
```php
go(function () {
	 $redis =  new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]));
    $key = [
            'muster1',
            'muster2',
            'muster3',
            'muster4',
            'muster5',
        ];
        $value = [
            '1',
            '2',
            '3',
            '4',
        ];
    $redis->del($key[0]);
    $redis->del($key[1]);
    $data = $redis->sAdd($key[0], $value[0], $value[1]);
    var_dump($data);
    
    $data = $redis->sCard($key[0]);
    var_dump($data);
    
    $redis->sAdd($key[1], $value[0], $value[2]);
    $data = $redis->sDiff($key[0], $key[1]);
    var_dump($data);
    
    $data = $redis->sDiff($key[1], $key[0]);
    var_dump($data);
    
    $data = $redis->sMembers($key[0]);
    var_dump($data);
    
    $data = $redis->sMembers($key[1]);
 	var_dump($data);
    
    $data = $redis->sDiffStore($key[2], $key[0], $key[1]);
    var_dump($data);
    
    $data = $redis->sInter($key[0], $key[1]);
    var_dump($data);
    
    $data = $redis->sInterStore($key[3], $key[0], $key[1]);
    var_dump($data);
    
    $data = $redis->sIsMember($key[0], $value[0]);
    var_dump($data);
    
    $data = $redis->sMove($key[0], $key[1], $value[1]);
    var_dump($data);
    
    $data = $redis->sPop($key[0]);
    var_dump($data);
    
    $redis->del($key[3]);
    $redis->sAdd($key[3], $value[0], $value[1], $value[2], $value[3]);
    $data = $redis->sRandMemBer($key[3], 4);
    var_dump($data);
    
    $data = $redis->sRem($key[3], $value[0], $value[1], $value[2], $value[3]);
    var_dump($data);
    
    $data = $redis->sUnion($key[0], $key[1]);
    var_dump($data);
    
    $redis->del($key[1]);
    $redis->del($key[2]);
    $redis->del($key[3]);
    $redis->del($key[4]);
    $redis->sAdd($key[1], 1, 2, 3, 4);
    $redis->sAdd($key[2], 5);
    $redis->sAdd($key[3], 6, 7);
    $data = $redis->sUnIonStore($key[4], $key[1], $key[2], $key[3]);
    var_dump($data);
    
    $cursor = 0;
    $redis->del('a');
    $redis->sAdd('a','a1','a2','a3','a4','a5');
    $data= [];
    do {
        $keys = $redis->sScan('a',$cursor,'*',1);
        $data = array_merge($data,$keys);
    } while ($cursor);
    var_dump($data);
});
```
