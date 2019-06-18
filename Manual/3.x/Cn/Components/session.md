# Session 
Easyswoole 自3.2.x开始，不再提供默认的session服务，若需要使用的用户，请独立引入session组件。

## 安装
```
composer require easyswoole/session
```

## 使用

定义一个基础session控制器，并继承AbstractSessionController父类即可，其余的控制器，只需要继承基础session控制器，即可实现session调用
```
use EasySwoole\Session\FileSessionHandler;
use EasySwoole\Session\Test\RedisHandler;
use EasySwoole\Session\AbstractSessionController;

class RedisHandler extends AbstractSessionController
{

    protected function sessionHandler(): \SessionHandlerInterface
    {
        /*
         * 此处应该由连接池拿链接，否则实际生产会导致不断创建链接
         */
        $redis = new \Redis();
        $redis->connect('127.0.0.1');
        return new RedisHandler($redis);
    }

    function index()
    {
        $this->session()->start();
        $time = $this->session()->get('test');
        if($time){
            $this->response()->write('session time is '.$time);
        }else{
            $this->session()->set('test',time());
            $this->response()->write('session time is new set');
        }
    }
}

class FileHandler extends AbstractSessionController
{

    protected function sessionHandler(): \SessionHandlerInterface
    {
        return new FileSessionHandler();
    }

    function index()
    {
        $this->session()->start();
        $time = $this->session()->get('test');
        if($time){
            $this->response()->write('session time is '.$time);
        }else{
            $this->session()->set('test',time());
            $this->response()->write('session time is new set');
        }
    }
}

```

> 自带的文件session实现是无锁的

## 支持的方法列表

- gcMaxLifetime()
- gcProbability()
- savePath()
- sessionId()
- start()
- sessionName()
- set()
- get()
- unset()
- destroy()
- close()
- gc()
