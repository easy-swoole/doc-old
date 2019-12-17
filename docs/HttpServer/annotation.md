---
title: Easyswoole 注解控制器
meta:
  - name: description
    content: Easyswoole 提供轻量级的注解控制器支持
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole|注解控制器|注解参数验证|swoole 注解
---
# 注解控制器

Easyswoole 提供轻量级的注解控制器支持。注解控制器在未添加注解项的时候，逻辑与普通控制器逻辑一致。


::: warning 
 本功能处于灰度测试中，想体验的同学可以在composer 中添require 配置项 ```"easyswoole/http": "master-dev as 1.3.0"```并执行composer up进行安装。
:::


## 例子如下

```php
use EasySwoole\Http\Annotation\Method;

class Test extends \EasySwoole\Http\AbstractInterface\AnnotationController
{
    /**
     * @\EasySwoole\Http\Annotation\Context(key="MYSQL")
     */
    public $mysql;

    /**
     * @var 
     * @\EasySwoole\Http\Annotation\DI(key="IOC")
     */
    public $IOC;

    function index()
    {
        // TODO: Implement index() method.
    }

    /**
     * @Method(allow={GET,POST})
     * @\EasySwoole\Http\Annotation\Param(name="test",from={POST})
     * @\EasySwoole\Http\Annotation\Param(name="msg",alias="消息字段",lengthMax="20|消息过长",required="消息不能为空")
     * @\EasySwoole\Http\Annotation\Param(name="type",inArray="{1,2,3,4}")
     */
    function fuck($test,$msg)
    {
        var_dump($test,$msg);
    }

    protected function onException(\Throwable $throwable): void
    {
        if($throwable instanceof \EasySwoole\Http\Exception\ParamAnnotationValidateError){
            var_dump($throwable->getValidate()->getError()->getErrorRuleMsg());
        }else{
            var_dump($throwable->getMessage());
        }
    }

}
```


::: warning 
Param注解支持的校验方法与Easyswoole自带的参数校验器一致，注解格式请见 [annotation](./../Components/annotation.md)
:::
