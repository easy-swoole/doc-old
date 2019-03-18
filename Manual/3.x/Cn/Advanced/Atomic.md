# Atomic

[swoole_atomic](https://wiki.swoole.com/wiki/page/p-atomic.html)是swoole扩展提供的原子计数操作类，可以方便整数的无锁原子增减。

- ```swoole_atomic```使用共享内存，可以在不同的进程之间操作计数
- ```swoole_atomic```基于gcc提供的CPU原子指令，无需加锁
- ```swoole_atomic```在服务器程序中必须在```swoole_server->start```前创建才能在Worker进程中使用
- ```swoole_atomic```默认使用32位无符号类型，如需要64有符号整型，可使用```Swoole\Atomic\Long```

***注意：请勿在onReceive等回调函数中创建原子数，否则底层的GlobalMemory内存会持续增长，造成内存泄漏。***

### 使用

初始化计数：

- int `init_value` 初始值

```php
public function __construct($init_value)
```

增加计数：

- int `add_value` 增加的值

```php
public function add($add_value)
```

减少计数：

- int `sub_value` 减少的值

```php
public function sub($sub_value)
```

获取当前计数的值：

```php
public function get()
```

将当前值设置为指定的数字：

- int `value` 计数值

```php
public function set($value)
```

如果当前数值等于参数1，则将当前数值设置为参数2：

- int `cmp_value`  被做比较的值
- int `set_value`  当前数值等于被做比较的值后被设置为指定的计数值

```php
public function cmpset($cmp_value, $set_value)
```

### 例子

在```EasySwooleEvent```初始化函数注册atomic对象。

```php
// 注册一个atomic对象
AtomicManager::getInstance()->add('second');
```

从AtomicManager获取atomic对象并使用。

```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/18 0018
 * Time: 15:39
 */

namespace App\HttpController;


use EasySwoole\Component\AtomicManager;
use EasySwoole\Http\AbstractInterface\Controller;

class Index extends Controller
{
    function index()
    {

        AtomicManager::getInstance()->add('second',0);
        $atomic = AtomicManager::getInstance()->get('second');
        $atomic->add(1);
        $this->response()->write($atomic->get());
        // TODO: Implement index() method.
    }
}
```

