---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现
  - name: keywords
    content:  EasySwoole redis| Swoole redis协程客户端


---

## 集合操作方法

方法列表

| 方法名称    | 参数                                      | 说明                                              | 备注 |
|:------------|:------------------------------------------|:-------------------------------------------------|:----|
| sAdd        | $key, ...$data                            | 向集合添加一个或多个成员                            |     |
| sCard       | $key                                      | 获取集合的成员数                                   |     |
| sDiff       | $key1, ...$keys                           | 返回给定所有集合的差集                              |     |
| sMembers    | $destination, ...$keys                    | 返回集合中的所有成员                               |     |
| sDiffStore  | $key1, ...$keys                           | 返回给定所有集合的差集并存储在 destination 中        |     |
| sInter      | $destination, ...$keys                    | 返回给定所有集合的交集                              |     |
| sInterStore | $key, $member                             | 返回给定所有集合的交集并存储在 destination 中        |     |
| sIsMember   | $key                                      | 判断 member 元素是否是集合 key 的成员               |     |
| sMove       | $source, $destination, $member            | 将 member 元素从 source 集合移动到 destination 集合 |     |
| sPop        | $key                                      | 移除并返回集合中的一个随机元素                      |     |
| sRandMemBer | $key, $count = null                       | 返回集合中一个或多个随机数                          |     |
| sRem        | $key, $member1, ...$members               | 移除集合中一个或多个成员                            |     |
| sUnion      | $key1, ...$keys                           | 返回所有给定集合的并集                              |     |
| sUnIonStore | $destination, $key1, ...$keys             | 所有给定集合的并集存储在 destination 集合中         |     |
| sScan       | $key,&$cursor, $pattern=null, $count=null | 迭代集合中的元素                                   |     |

::: warning
 在集群模式中,sDiff,sDiffStore,sInter,sMove,sUnion,sUnIonStore等方法不能使用
:::


## 实例
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
