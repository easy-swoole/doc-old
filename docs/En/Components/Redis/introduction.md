---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---
## Redis coroutine client
Although swoole has its own coroutine client, we found some problems in the production environment:
Swoole's redis client does not fully support Redis's full commands, such as geo search, and transactions, especially in cluster mode redis, which is not supported by the swoole client. To this end, we decided to implement a full version of the redis client using the swoole tcp client.


## Support method
Currently, the redis client component already supports all methods except scripting (currently supports 178 methods):

- connection
- cluster
- geohash
- hash
- keys
- lists
- pub/sub
- server
- string
- sorted sets
- sets
- transaction
- pipe

> Due to more redis commands, 1 or 2 commands may be missed


