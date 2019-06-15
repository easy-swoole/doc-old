# Redis-Pool
本redis Pool是对predis拓展的的池封装实现，为实现协程，请开启Runtime Hook从而实现predis协程化。

## 安装
```
composer require easyswoole/redis-pool
```

### 添加数据库配置
在`dev.php`或者是`produce.php`中添加配置信息：
```php
/*################ REDIS CONFIG ##################*/
'REDIS' => [
    'host'          => '127.0.0.1',
    'port'          => '6379',
    'auth'          => '',
],
```