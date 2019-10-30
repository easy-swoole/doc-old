# Queue介绍

Easyswoole封装实现了一个轻量级的队列，默认以Redis作为队列驱动器。

可以自己实现一个队列驱动来实现用kafka或者启动方式的队列存储。

从上可知，Queue并不是一个单独使用的组件，它更像一个对不同驱动的队列进行统一封装的门面组件。

# 开始安装

```
composer require easyswoole/queue
```

# 使用流程

- 注册队列驱动器
- 设置消费进程
- 生产者投递任务

# 定义单例

```php
namespace App\Utility;

use EasySwoole\Component\Singleton;

class Queue extends \EasySwoole\Queue\Queue
{
    use Singleton;
}
```

::: tip 提示
这样做是为了方便快速调用，而默认库不单例，是为了方便用户实现多个队列
:::