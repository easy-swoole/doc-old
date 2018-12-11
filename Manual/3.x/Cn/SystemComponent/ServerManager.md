# ServerManager

ServerManager 它是一个单例类(use EasySwoole\Component\Singleton),完整的命名空间如下：

```
EasySwoole\EasySwoole\ServerManager
```

### 方法列表如下：

实例化了一个***EasySwoole\EasySwoole\Swoole\EventRegister***，事件注册器其实就是一个事件容器：

```php
function __construct()
```

获取swoole server对象或者子服务：

- string    `serverName`   服务名称

```php
function getSwooleServer(string $serverName = null)   
```

创建swoole server：

- mixed   `port`     端口
- string  `type`     类型
- string  `address`  主机
- array   `$setting` 配置

```php
function createSwooleServer($port,$type = self::TYPE_SERVER,$address = '0.0.0.0',array $setting = [],...$args):bool  
```

注册一个子服务：

- string  `serverName`     服务名称
- int     `port`           端口
- int     `type`           类型
- string  `listenAddress`  监听的主机
- array   `setting`        配置

```php
public function addServer(string $serverName,int $port,int $type = SWOOLE_TCP,string $listenAddress = '0.0.0.0',array $setting = ["open_eof_check"=>false,]):EventRegister 
```

获取事件注册器对象：

```php
function getMainEventRegister():EventRegister
```

注册服务回调以及注册子服务,并启动：

```php
function start()
```

添加注册好的子服务到swoole server：

```php
private function attachListener():void
```

获取已经注册好的子服务：

```php
function getSubServerRegister():array
```