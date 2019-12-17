---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现,覆盖了redis 99%的方法
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole redis| Swoole redis协程客户端|swoole Redis|redis协程
---
## redis协程客户端
虽然swoole有着自带的协程客户端,但是在生产环境中我们发现了一些问题:  
swoole的redis客户端并没有完全支持redis的全部命令，比如geo搜索，还有事务，特别是集群模式的redis，swoole客户端并不支持。为此，我们决定用swoole的tcp客户端实现一个完整版的redis客户端。


## 支持方法
目前,该redis客户端组件,已经支持除去脚本外的所有方法(目前支持了178个方法):  

- 连接方法(connection)
- 集群方法(cluster)
- geohash
- 哈希(hash)
- 键(keys)
- 列表(lists)
- 订阅/发布(pub/sub)
- 服务器(server)
- 字符串(string)
- 有序集合(sorted sets)
- 集合 (sets)
- 事务 (transaction)
- 管道实现 (pipe)  

> 由于redis的命令较多,可能漏掉1,2个命令


