---
title: Atomic
meta:
  - name: description
    content: EasySwoole Atomic
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|Atomic|Atomic counter
---

# Atomic

[swoole_atomic](https://wiki.swoole.com/wiki/page/p-atomic.html) is an atomic count operation class provided by the swoole extension, which can facilitate the increase and decrease of integer-free lock-free atoms.

- `swoole_atomic` uses shared memory to manipulate counts between different processes
- `swoole_atomic` is based on the CPU atomic instructions provided by gcc, no need to lock
- `swoole_atomic` must be created before the `swoole_server->start` in the server program to be used in the Worker process.
- `swoole_atomic` uses 32-bit unsigned types by default. If you need 64-signed integers, you can use `Swoole\Atomic\Long`.

***Note: Do not create atomic numbers in callback functions such as onReceive, otherwise the underlying GlobalMemory memory will continue to grow, causing memory leaks.***

### Use

Initialization count:

- Int `init_value` initial value

```php
public function __construct($init_value)
```

Increase the count:

- Int `add_value` increased value

```php
public function add($add_value)
```

Reduce the count:

- Int `sub_value` reduced value

```php
public function sub($sub_value)
```

Get the current count value:

```php
public function get()
```

Set the current value to the specified number:

- int `value` count value

```php
public function set($value)
```

If the current value is equal to parameter 1, the current value is set to parameter 2:

- int `cmp_value` is the value to be compared
- int `set_value` is set to the specified count value after the current value is equal to the value being compared

```php
public function cmpset($cmp_value, $set_value)
```

### Examples

Register the atomic object in the ```EasySwooleEvent`` initialization function.

```php
// Register an atomic object
AtomicManager::getInstance()->add('second');
```

Get the atomic object from AtomicManager and use it.

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

