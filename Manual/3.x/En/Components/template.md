# Template engine
## Rendering driver

EasySwoole introduces a template rendering driver to render the data that needs to be rendered, and sends it to a custom synchronization process through a coroutine client to render and return the results. The reason for this is that some template engines on the market have variable security problems under the Swoole Collaboration. For example, the following processes: 
  
   - request A reached, static A assign requestA-data
   - compiled template 
   - write compiled template (yiled current coroutine)
   - request B reached，static A assign requestB-data
   - render static A data into complied template file
   
As we can see from the above process, the data requested by A is polluted by B. To solve this problem, EasySwoole introduced template rendering driver mode.

## Install

```php
composer require easyswoole/template
```    

## Basic explanation
### Implementing rendering engine

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

#### Calls in HTTP services

```
//Create events in the global master service, instantiate the Render and inject your driver configuration
Render::getInstance()->getConfig()>setRender(new R());

$http = new swoole_http_server("0.0.0.0", 9501);
$http->on("request", function ($request, $response)use($render) {
    //Calling the renderer, the data will be sent to the customized synchronization process through the coroutine client, and the rendering results will be obtained.
    $response->end(Render::getInstance()->render('a.html'));
});
$render->attachServer($http);

$http->start();
```

## Restart the rendering engine
 
Because some template engines cache template files
This may lead to the following situations:
 × User A requests 1.tpl to return'a'
 × The developer changed the data of 1.tpl to'b'
 × Users B, C, D may have two different values of'a'and'b' in subsequent requests
 
That's because the template engine has cached the files of the process in which A resides, resulting in subsequent requests that, if allocated to the process in which A resides, will get the cached value.

The solutions are as follows:
1: Restart easyswoole to resolve
2: Template Rendering Engine implements restart method `restart Worker', which can be called directly.

````
Render::getInstance()->restartWorker();
````
Users can call `restartWorker'method to restart according to their own logic.
For example, a reload method is added to the controller:

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






## Smart rendering
### Introducing smarty
```
composer require smarty/smarty   - request A reached, static A assign requestA-data
   - compiled template 
   - write compiled template (yiled current coroutine)
   - request B reached，static A assign requestB-data
   - render static A data into complied template file

```

### Implementing rendering engine

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


#### Calls in HTTP services
```
//Create events in the global master service, instantiate the Render and inject your driver configuration
Render::getInstance()->getConfig()>setRender(new Smarty());

//Implementing Response in Action
Render::getInstance()->render('a.html');

```
 
## Support common template engines
 
Here are some common template engine packages for easy use:
 
### [smarty/smarty](https://github.com/smarty-php/smarty)
 
Smart is a template engine written in PHP. It is one of the most famous PHP template engines in the industry.
 
> composer require smarty/smarty=~3.1
 
 
### [league/plates](https://github.com/thephpleague/plates)
 
Non-compiled template engine using native PHP grammar, lower learning cost and higher degree of freedom
 
> composer require league/plates=3.*
 
### [duncan3dc/blade](https://github.com/duncan3dc/blade)
 
Template Engine for Laravel Framework
 
> composer require duncan3dc/blade=^4.5
 
### [topthink/think-template](https://github.com/top-think/think-template)
 
Template Engine for ThinkPHP Framework
 
> composer require topthink/think-template
