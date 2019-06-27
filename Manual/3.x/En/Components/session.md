# Session 

Easyswoole no longer provides the default session service since 3.2.x. If users need to use it, please introduce session components independently.

## Install

```
composer require easyswoole/session
```

## Use

Define a basic session controller and inherit the AbstractSessionController parent class. The rest of the controllers can implement session calls simply by inheriting the basic session controller.

```
use EasySwoole\Session\FileSessionHandler;
use EasySwoole\Session\Test\RedisHandler;
use EasySwoole\Session\AbstractSessionController;

class RedisHandler extends AbstractSessionController
{

    protected function sessionHandler(): \SessionHandlerInterface
    {
        /*
         * Links should be taken here by the connection pool, otherwise actual production will lead to continuous creation of links.
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

> The built-in file session implementation is unlocked

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
