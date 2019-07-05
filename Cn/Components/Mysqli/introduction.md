<head>
     <title>EasySwoole mysqli|swoole mysqli|swoole mysql|swoole 数据库连接池|php连接池</title>
     <meta name="keywords" content="EasySwoole mysqli|swoole mysqli|swoole mysql|swoole 数据库连接池|php连接池"/>
     <meta name="description" content="php用swoole拓展封装的myql orm，并实现断线重连，与连接池的使用"/>
</head>
---<head>---

## EasySwoole-Mysqli

> 仓库地址: [EasySwoole-Mysqli](https://github.com/easy-swoole/mysqli)

EasySwoole提供了mysqli的组件
该组件是由mysqli-db更改为swoole的异步mysql扩展封装的数据库操作类

### 说明
由于es3.x版本是全协程版本,无法直接使用think-orm,laravel-orm等单例数据库orm,所以EasySwoole提供了mysqli组件用于数据库操作
