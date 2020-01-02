---
title: Session
meta:
  - name: description
    content: EasySwoole Session processing component
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole Session processing component|swoole session|php session
---
# Session 
Easyswoole Since 3.2.x, the default session service is no longer available. If you need to use the user, please introduce the session component independently.

## Installation
```shell
composer require easyswoole/session
```

## Use
   
Define a basic session controller, and inherit the AbstractSessionController parent class. The rest of the controllers only need to inherit the base session controller to implement the session call.
```php
use EasySwoole\Session\FileSessionHandler;
use EasySwoole\Session\Test\RedisHandler;
use EasySwoole\Session\AbstractSessionController;

class RedisHandler extends AbstractSessionController
{

    protected function sessionHandler(): \SessionHandlerInterface
    {
        /*
         * The link should be taken here by the connection pool, otherwise the actual production will lead to the continuous creation of the link.
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


::: warning 
 The built-in file session implementation is lock-free.
:::

## List of supported methods

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
