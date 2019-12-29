# 什么是连接池

> 连接池是创建和管理一个连接的缓冲池的技术，这些连接准备好被任何需要它们的线程使用。

简单来说，就是创建一个容器，并且把资源提前准备好放在里面，比如我们常用的redis连接、mysql连接。

# 连接池的优点

计算机是由许多零件组装而成，比如CPU、内存、硬盘等等。

当我们进行网络连接、请求的时候，就需要在不同组件中传递和返回各种信号、数据

比如在CPU、内存、网卡中，数据的传递，请求，获取。

如果在短时间内进行一万次mysql的连接，就需要在这个往返过程循环，在路上浪费了很多时间、性能消耗。

如果我们先把连接连接好，并且放在连接池中，程序中需要使用就从池中获取，执行操作。

就省去了反复创建连接、断开连接的操作。

可以减少I/O操作，提高资源利用率。

# 连接池数量如何设置

那么一个池需要设置多少数量比较合适呢？是不是越多越好？  
连接数量需要根据并发数,以及数据库的处理情况来决定的,  
比如你的数据库最大只能处理500个连接,那你设置700个,数据库照样处理不过来,设置过多并没有什么用处,反而可能会让数据库宕机  
所以,一般情况下,连接池总数设置为100-200左右就够了(相当于200的并发)

::: warning
  这里的连接池数量,说的是总数量,在easyswoole中,需要根据进程来看,每个进程*连接池配置数量=总数量,比如easyswoole中worker进程为8,那你设置20个,那就是20*8=160的总数
::: 

# easyswoole中为什么会pool empty

这个问题有好几个可能性。

- 连接信息错误，导致一个资源都没有
- 程序有问题，把资源拿出去，没有归还到池内，后续就拿到空了
- 并发高，池的数量少，需要检查资源占用率，如果占用率没问题，则提高池内的数量

## 连接信息错误

如果我们的mysql配置信息错误，在easyswoole框架启动之后，就会去初始化连接池。

此时一直连接失败，也就没有产生资源，也没有将资源放在池内

当你在后续程序获取池内资源的时候。自然就报了空池的错误提示。

## 程序问题

先来一个连接池的伪代码  
```php
<?php
	
class Pool{
	public static function getIn(){
		// 单例模式
	}
	/**
	 * 初始化
	 */
	public function init()
	{
		// pool准备好就填充指定的资源 比如10个连接
		$this->pool = $array;
	}
	
	public function get(){
		return array_pop($this->pool);
	}	
	public function push($obj)
	{
		$this->pool[] = $obj;
	}
}
```

如果我们的程序有这样子的使用场景
```php
<?php
	
	$db = Pool::getIn()->get();
	$res = $db->query('sql语句');
```

然后没有进行push 归还操作，那么池内资源一旦拿完，就没有资源可用了。

在easyswoole框架中，有提供以下方法获取资源（以mysql-pool为例）
```php
$db = MysqlPool::defer();
$db->rawQuery('select version()');
```
```php
$data = MysqlPool::invoker(function (MysqlConnection $db){
    return $db->rawQuery('select version()');
});
```
```php
$db = PoolManager::getInstance()->getPool(MysqlPool::class)->getObj();
$data = $db->get('test');
//使用完毕需要回收
PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
```

defer方法将会在本次请求协程退出的时候自动回收

invoker是闭包函数方式  一次运行完马上自动回收

get方式 就是我们伪代码的方式 需要自己回收  使用这种方式就需要特别注意啦~！！！

> 两种自动回收方式怎么选择  请接着往下看！

## 并发高  资源占用率

上面说到两种自动回收资源的方式，defer和invoker

首先我们来看一个点，defer是在协程退出时自动回收，正常来说，在一个请求到达的时候，swoole会自动创建一个协程给他，比如我们一个http api的请求，就需要整个api跑完，这个协程才会退出

（相当于我们传统fpm php中  一个脚本全部执行完）

这个时候问题来了，如果我们的业务是这样子的
```php
<?php
	
	$db = MysqlPool::defer();
	$db->rawQuery('select version()');

	// 执行好mysql了  做其他任务
	
	// 耗时1.5s 完成其他


```

实际上使用到mysql资源的可能只有0.1s不到，但是其他运算占用了脚本大量执行时间，要等全部执行完，协程退出了，资源才会回收，这个时候就比较浪费资源的利用率了。占用率比较低。
！
如果可以的话 ，我们推荐使用invoker   执行一条 马上回收资源

此时要注意一个点，如果程序有比较多执行语句，要么在一个invoker里执行，要么合理使用invoker

不然就会把性能消耗转移到不断get  recycle上了


如果以上排查都没问题，并且确认你的用户量比较多，并发高，就可以适当提高pool的number 
