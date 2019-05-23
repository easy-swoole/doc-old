# 模板引擎
## 渲染驱动
EasySwoole引入模板渲染驱动的形式，把需要渲染的数据，通过协程客户端投递到自定义的同步进程中进行渲染并返回结果。为何要如此处理，原因在于，市面上的一些模板引擎在Swoole协程下存在变量安全问题。例如以下流程：
   
   - request A reached, static A assign requestA-data
   - compiled template 
   - write compiled template (yiled current coroutine)
   - request B reached，static A assign requestB-data
   - render static A data into complied template file
   
   以上流程我们可以发现，A请求的数据，被B给污染了。为了解决该问题，EasySwoole引入模板渲染驱动模式。

## 安装
```php
composer require easyswoole/templdate
```    

## 基础实现讲解
### 实现渲染引擎
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

#### HTTP服务中调用
```
//创建渲染器配置
$config = new Config();
$config->setRender(new R());
//实例化渲染器
$render = new Render($config);

$http = new swoole_http_server("0.0.0.0", 9501);
$http->on("request", function ($request, $response)use($render) {
    //调用渲染器，此时会通过携程客户端，把数据发往自定义的同步进程中处理，并得到渲染结果
    $response->end($render->render('a.html'));
});
$render->attachServer($http);

$http->start();
```

## Smarty 渲染
### 引入Smarty
```
composer require smarty/smarty
```

### 实现渲染引擎
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


#### HTTP服务中调用
```
use EasySwoole\Template\Config;
use EasySwoole\Template\Render;
use EasySwoole\Template\Test\Smarty;

$config = new Config();
$config->setRender(new Smarty());
$render = new Render($config);

$http = new swoole_http_server("0.0.0.0", 9501);
$http->on("request", function ($request, $response)use($render) {
    $response->end($render->render('smarty.tpl',[
        'time'=>time()
    ]));
});
$render->attachServer($http);

$http->start();
```

## EasySwoole中使用

为方便在Easyswoole中使用，你可以做以下流程：
 - 声明一个Render ，继承EasySwoole\Template\Render，并定义为单例
 - 在全局的主服务中创建事件中，实例化该Render,并注入你的驱动配置
 
 做完以上步骤，你就可以$html = Render::getInstance()->render();
 
 
## 支持常用的模板引擎
 
下面列举一些常用的模板引擎包方便引入使用:
 
### [smarty/smarty](https://github.com/smarty-php/smarty)
 
Smarty是一个使用PHP写出来的模板引擎,是目前业界最著名的PHP模板引擎之一
 
> composer require smarty/smarty=~3.1
 
 
### [league/plates](https://github.com/thephpleague/plates)
 
使用原生PHP语法的非编译型模板引擎，更低的学习成本和更高的自由度
 
> composer require league/plates=3.*
 
### [duncan3dc/blade](https://github.com/duncan3dc/blade)
 
Laravel框架使用的模板引擎
 
> composer require duncan3dc/blade=^4.5
 
### [topthink/think-template](https://github.com/top-think/think-template)
 
ThinkPHP框架使用的模板引擎
 
> composer require topthink/think-template
