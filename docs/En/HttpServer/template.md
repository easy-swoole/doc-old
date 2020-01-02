---
title: EasySwoole Template engine
meta:
  - name: description
    content: EasySwoole Template engine|swoole Template engine|swoole Template rendering
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole Template engine|swoole Template engine|swoole Template rendering
---

# Template engine
## Rendering driver
EasySwoole introduces the form of the template rendering driver, and the data that needs to be rendered is delivered to the custom synchronization process through the coroutine client for rendering and returning the result. The reason for this is that some of the templating engines on the market have variable security issues under the Swoole coroutine. For example, the following process:
   
   - request A reached, static A assign requestA-data
   - compiled template 
   - write compiled template (yiled current coroutine)
   - request B reached，static A assign requestB-data
   - render static A data into complied template file
   
   The above process we can find that the data requested by A is polluted by B. To solve this problem, EasySwoole introduced a template rendering driver mode.

## Installation
```php
composer require easyswoole/template
```    

## Basic implementation
### Implementing the rendering engine
```php
use EasySwoole\Template\Config;
use EasySwoole\Template\Render;
use EasySwoole\Template\RenderInterface;

class R implements RenderInterface
{

    public function render(string $template, array $data = [], array $options = []):?string
    {
        return 'asas';
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

#### Called in HTTP service
```php
//In the event created in the global main service, instantiate the Render and inject your driver configuration
Render::getInstance()->getConfig()->setRender(new R());

$http = new swoole_http_server("0.0.0.0", 9501);
$http->on("request", function ($request, $response)use($render) {
    //Call the renderer, and then send the data to the custom synchronization process through the Ctrip client, and get the rendering result.
    $response->end(Render::getInstance()->render('a.html'));
});
$render->attachServer($http);

$http->start();
```

## Restart the rendering engine
Because some template engines cache template files
This may lead to the following situations:
* User A requests 1.tpl to return ‘a’
* The developer modified the 1.tpl data and changed it to ‘b’
* User B, C, D may have two different values of ‘a’ and ‘b’ in subsequent requests.
 
That's because the template engine has already cached the file of the process in which A is located, causing subsequent requests to be cached if they are also assigned to A's process.

The solution is as follows:
1: Restart easyswoole, you can solve
2: The template rendering engine implements the restart method `restartWorker`, which can be called directly.

````
Render::getInstance()->restartWorker();
````
Users can call the `restartWorker` method to restart according to their own logic.
For example, add a reload method to the controller:
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






## Smarty Rendering
### Introducing Smarty
```
composer require smarty/smarty   - request A reached, static A assign requestA-data
   - compiled template 
   - write compiled template (yiled current coroutine)
   - request B reached，static A assign requestB-data
   - render static A data into complied template file

```

### Implement the rendering engine
```php
use EasySwoole\Template\RenderInterface;
use EasySwoole\Template\RenderInterface;

class Smarty implements RenderInterface
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

    }

    public function onException(\Throwable $throwable): string
    {
        $msg = "{$throwable->getMessage()} at file:{$throwable->getFile()} line:{$throwable->getLine()}";
        trigger_error($msg);
        return $msg;
    }
}
```


#### Calling in HTTP service
```
// Create an event in the global main service, instantiate the Render, and inject your driver configuration
Render::getInstance()->getConfig()->setRender(new Smarty());
Render::getInstance()->getConfig()->setTempDir(EASYSWOOLE_TEMP_DIR);
Render::getInstance()->attachServer(ServerManager::getInstance()->getSwooleServer());
// Implement the response in the action
Render::getInstance()->render('a.html');

```
 
## Support for common template engines
 
Here are some common template engine packages for easy introduction:
 
### [smarty/smarty](https://github.com/smarty-php/smarty)
 
Smarty is a template engine written in PHP and is one of the most famous PHP template engines in the industry.
 

::: warning 
composer require smarty/smarty=~3.1
:::

 
 
### [league/plates](https://github.com/thephpleague/plates)
 
Lower cost of learning and higher freedom with a non-compiled template engine using native PHP syntax
 

::: warning
Composer require league/plates=3.*
:::

 
### [duncan3dc/blade](https://github.com/duncan3dc/blade)
 
Template engine used by the Laravel framework
 

::: warning
Composer require duncan3dc/blade=^4.5
:::

 
### [topthink/think-template](https://github.com/top-think/think-template)
 
Template engine used by the ThinkPHP framework
 

::: warning 
 composer require topthink/think-template
:::
