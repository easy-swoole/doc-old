# CoChannel

[Coroutine\Channel](https://wiki.swoole.com/wiki/page/p-coroutine_channel.html),通道，类似于go语言的chan，支持多生产者协程和多消费者协程。底层自动实现了协程的切换和调度。

- ```Channel->push``` ：当队列中有其他协程正在等待```pop```数据时，自动按顺序唤醒一个消费者协程。当队列已满时自动```yield```让出控制器，等待其他协程消费数据
- ```Channel->pop```：当队列为空时自动```yield```，等待其他协程生产数据。消费数据后，队列可写入新的数据，自动按顺序唤醒一个生产者协程。

> ```Coroutine\Channel```使用本地内存，不同的进程之间内存是隔离的。只能在同一进程的不同协程内进行```push```和```pop```操作
> ```Coroutine\Channel```在```2.0.13```或更高版本可用

### 使用

创建通道：

- int `capacity`  通道占用的内存的尺寸，单位为字节，只允许传入正整数

```php
public function __construct(int $capacity = 0)
```

向通道写入数据：

- mixed `data` 任意类型的PHP变量，包括匿名函数和资源

> 为避免产生歧义，请勿向通道中写入空数据，如0、false、空字符串、null

```php
public function push($data): bool
```

弹出数据：

```php
function pop()
```

获取通道的状态：

```php
public function stats(): array
```

该方法返回如下的数组

```
{
    consumer_num : 消费者数量，表示当前通道为空，有N个协程正在等待其他协程调用push方法生产数据
    producer_num : 生产者数量，表示当前通道已满，有N个协程正在等待其他协程调用pop方法消费数据
    queue_num : 通道中的元素数量
    queue_bytes : 可能存在, 通道当前占用的内存字节数
}
```


关闭通道;并唤醒所有等待读写的协程：

```php
public function close(): void
```

获取通道中的元素数量

```php
public function length(): int
```

判断当前通道是否为空

```php
public function isEmpty(): bool
```

判断当前通道是否已满

```php
public function isFull(): bool
```

通道读写检测

- array `read`    读操作检测
- array `write`   写操作检测
- float `timeout` 超时设置

```php
public static function select(array &$read, array &$write, $timeout = 0)
```
