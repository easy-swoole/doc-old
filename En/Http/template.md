<head>
     <title>EasySwoole 模板引擎|swoole 模板引擎|swoole 模板渲染</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole Template Engine|swoole Template Engine|swoole Template Rendering"/>
     <meta name="description" content="EasySwoole Template Engine|swoole Template Engine|swoole Template Rendering"/>
</head>
---<head>---

# Template Engine
## Renderer driven mode
`EasySwoole` introduces a  called `renderer driven` mode, which uses `Swoole` **Coroutine client** to deliver the specific data to 
the correspond sync thread for rendering the result and return. The reason `EasySwoole` must implement this mode is because
some popular PHP template engines have secure issues while they work with `Swoole` Coroutine, for example:
   
   - The `client A` comes in and get the result as **A-data**
   - The template is compiled with **A-data**
   - Update compiled template (yield by current coroutine)
   - The `client B` comes in and get the result as **B-data**
   - The template is compiled with **B-data**, then it's returned to `client A` as result as well
   
You may find the conflict among above steps, and that's why `renderer driven` mode was born.

## Installation
```bash
composer require easyswoole/template
```    

## User guide
### How `renderer driven` mode is implemented
```php
<?php

use EasySwoole\Template\Config;
use EasySwoole\Template\Render;
use EasySwoole\Template\RenderInterface;

class R implements RenderInterface
{

    public function render(string $template, array $data = [], array $options = []):?string
    {
        return 'foo';
    }

    public function afterRender(?string $result, string $template, array $data = [], array $options = [])
    {
        // TODO: Implement afterRender() method.
    }

    public function onException(Throwable $throwable):string
    {
        return $throwable->getMessage();
    }
}

```  

#### How to use in HTTP server mode
```php
<?php
    // In Swoole global request event，init the Render instance then inject the Renderer driver object
    $render = Render::getInstance();
    $render->getConfig()>setRender(
        new R()
    );
    
    $http = new swoole_http_server("0.0.0.0", 9501);
    $http->on("request", function ($request, $response) use($render) {
        // Use the Renderer object to render the template: a.html
        $response->end(
            $render->render('a.html')
        );
    });
    $render->attachServer($http);
    
    $http->start();
```

## Why and how to restart the template engine in your codes

Because some template engines will cache the template files and cause unpredictable result, for example:
* `Client A` requests `1.tpl`, which will return string "foo" back to the client
* You updated the file `1.tpl` later for some reasons, now it returns "bar".
* Other clients request `1.tpl` file since your updating, but they find the result might be "foo" or "bar"
* Why it happens?

Because in `Client A`'s worker precess, the template engine cached `1.tpl`. 
Later on, if any clients go into the same worker process as `Client A`, only cached value, which is "foo", will be returned.

Solution:
- 1：Restart your `EasySwoole` application
- 2：Simply call the `restartWorker()` function in your codes

```php
Render::getInstance()->restartWorker();
```

For example, you may create your own `reload()` method in your controller:
````php
<?php
namespace App\HttpController;

use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\Template\Render;

class Index extends Controller
{

    function index()
    {
        $this->response()->write(Render::getInstance()->render('index.tpl',[
            'user'=>'easyswoole',
            'time'=>time()
        ]));
    }

    function reload(){
        Render::getInstance()->restartWorker();
        $this->response()->write(1);
    }
}
````

## How to integrate Smarty 
### Install `Smarty` repo
```bash
composer require smarty/smarty
```

### Implement your own render
```php
<?php
    // ...
    use EasySwoole\Template\RenderInterface;
    
    class MyOwnSmartyRenderer implements RenderInterface
    {
    
        private $smarty;
        function __construct()
        {
            $temp = sys_get_temp_dir();
            $this->smarty = new \Smarty();
            $this->smarty->setTemplateDir(__DIR__.'/');
            $this->smarty->setCacheDir("{$temp}/smarty/cache/");
            $this->smarty->setCompileDir("{$temp}/smarty/compile/");
        }
    
        public function render(string $template, array $data = [], array $options = []): ?string
        {
            foreach ($data as $key => $item){
                $this->smarty->assign($key,$item);
            }
            return $this->smarty->fetch($template,$cache_id = null, $compile_id = null, $parent = null, $display = false,
                $merge_tpl_vars = true, $no_output_filter = false);
        }
    
        public function afterRender(?string $result, string $template, array $data = [], array $options = [])
        {
            // Implement by your own
        }
    
        public function onException(\Throwable $throwable): string
        {
            $msg = "{$throwable->getMessage()} at file:{$throwable->getFile()} line:{$throwable->getLine()}";
            trigger_error($msg);
            return $msg;
        }
    }
```


#### Use your own renderer in HTTP server mode
```php
<?php
    // In Swoole global request event，init the Render instance then inject the Renderer driver object
    Render::getInstance()->getConfig()>setRender(new MyOwnSmartyRenderer());
    Render::getInstance()->getConfig()->setTempDir(EASYSWOOLE_TEMP_DIR);
    Render::getInstance()->attachServer(ServerManager::getInstance()->getSwooleServer());
    
    // Rendering the template 'a.html' in your controller::action()
    Render::getInstance()->render('a.html');

```
 
## `EasySwoole` supports following template engines
  
### [smarty/smarty](https://github.com/smarty-php/smarty)
> composer require smarty/smarty=~3.1

### [league/plates](https://github.com/thephpleague/plates) 
> composer require league/plates=3.*

### [duncan3dc/blade](https://github.com/duncan3dc/blade) (Blade template engine used by Laravel)
> composer require duncan3dc/blade=^4.5
