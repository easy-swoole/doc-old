# Channel

```Swoole-1.9.0```新增了一个新的内存数据结构Channel，用于实现高性能的进程间通信，底层基于共享内存+Mutex互斥锁实现，可实现用户态的高性能内存队列。

- ```Channel```可用于多进程环境下，底层在读取写入时会自动加锁，应用层不需要担心数据同步问题
- 必须在父进程内创建才可以在子进程内使用

> ```Channel```不受```PHP```的```memory_limit```控制

### 使用

创建通道：

- int `capacity`  通道占用的内存的尺寸，单位为字节。最小值为64K，最大值没有限制

```php
public function __construct(int $capacity = 0)
```

向通道写入数据：

- mixed `data` 数据  必须为非空变量，如空字符串、空数组、0、null、false

```php
public function push($data): bool
```

弹出数据：

```php
function pop()
```

获取通道的状态：

```php
public function stats()
```

关闭通道;并唤醒所有等待读写的协程：

```php
public function close()
```

