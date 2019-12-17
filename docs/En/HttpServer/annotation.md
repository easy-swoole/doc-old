---
title: Annotation controller
meta:
  - name: description
    content: Easyswoole provides lightweight annotation controller support
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole|Annotation controller|Annotation parameter verification
---
# Annotation controller

Easyswoole provides lightweight annotation controller support. The annotation controller is logically consistent with the normal controller logic when no annotations are added.


::: warning 
 This function is in the grayscale test. Students who want to experience can add the require configuration item ```"easyswoole/http": "master-dev as 1.3.0"``` to composer and execute composer up to install.
:::


## Examples are as follows

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
     * @\EasySwoole\Http\Annotation\Param(name="msg",alias="Message field",lengthMax="20|The message is too long",required="Message cannot be empty")
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
The verification method supported by Param annotation is consistent with the parameter checker provided by Easyswoole. Please refer to [annotation](/En/Components/annotation.md) for the annotation format.
:::
