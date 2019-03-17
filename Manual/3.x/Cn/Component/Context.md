## Context
ContextManager上下文管理器  
在swoole中,由于多个协程是并发执行的，因此不能使用类静态变量/全局变量保存协程上下文内容。使用局部变量是安全的，因为局部变量的值会自动保存在协程栈中，其他协程访问不到协程的局部变量。  

### 操作数据
在 `EasySwooleEvent.php` 的`onRequest` 中 set数据:
````php
<?php
public static function onRequest(Request $request, Response $response): bool
{
    ContextManager::getInstance()->set('requestData',$request->getRequestParam());
    // TODO: Implement onRequest() method.
    return true;
}
````
`App\Controller\Index.php`可直接调用:
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/8 0008
 * Time: 15:16
 */

namespace App\HttpController;


use App\Utility\Excel;
use EasySwoole\Component\Context\ContextManager;
use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\Utility\Random;
use EasySwoole\VerifyCode\Conf;
use EasySwoole\VerifyCode\VerifyCode;

class Index extends Controller
{
    function index()
    {
        $data = ContextManager::getInstance()->get('requestData');
        $this->response()->write(json_encode($data));
    }
}
````
> 同理,在任意地方set的数据,都是处于当前协程的共享数据,和php-fpm中的超全局变量性质类似,可通过该组件进行实现$_GET,$_SESSION,$_POST等超全局变量的任意位置获取,修改等功能


### 方法列表
````php
<?php
public function set($key,$value,$cid = null){};//设置一个变量,cid为null时为当前协程
public function get($key,$cid = null){};//获取一个变量,cid为null时为当前协程
public function unset($key,$cid = null){};//删除一个变量,cid为null时为当前协程
public function destroy($cid = null){};//销毁协程数据,cid为null时为当前协程
public function getCid($cid = null):int{};//默认为获取当前协程id,并实现了协程关闭后,自动销毁该协程数据
public function destroyAll($force = false){};//销毁所有协程数据
public function getContextArray($cid = null){};//获取当前协程数据列表,cid为null时为当前协程
public function registerItemHandler($key, ContextItemHandlerInterface $handler):ContextManager();//注册自定义存储,销毁逻辑
````
#### registerItemHandler
`ContextManager`提供了另一种设置方式,registerItemHandler方法去注册需要额外处理的数据.  
首先先继承`EasySwoole\Component\Context\ContextItemHandlerInterface`接口:
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/13 0013
 * Time: 14:04
 */

namespace App\Utility\Context;


use EasySwoole\Component\Context\ContextItemHandlerInterface;

class RegisterClassHandel implements ContextItemHandlerInterface
{
    protected $className;
    public function __construct($className)
    {
        $this->className = $className;
    }

    /**
     * 当ContextManager get 时,会调用该方法
     * 可以使用该方法进行 get 的初始化操作
     * 例如set mysql时,可以在这里获取连接池
     * 例如set 某个对象时,可以在这里初始化对象属性,等
     * onContextCreate
     * @author Tioncico
     * Time: 14:09
     */
    function onContextCreate()
    {
        $class = new $this->className;
        $class->context = '测试内容';
        return $class;
        // TODO: Implement onContextCreate() method.
    }

    /**
     * 当ContextManager unset或销毁时,会调用该方法
     * 可以使用该方法进行销毁后的操作
     * 例如set mysql 需要销毁时,可以在这里回收连接池
     * 例如set 某个对象时,可以在这里清除对象属性,等
     * onDestroy
     * @param $context
     * @author Tioncico
     * Time: 14:11
     */
    function onDestroy($context)
    {
        unset($context);
        return true;
        // TODO: Implement onDestroy() method.
    }


}
````
注册 stdClass 
````php
<?php
    public static function onRequest(Request $request, Response $response): bool
    {
        ContextManager::getInstance()->registerItemHandler('stdclass',new RegisterClassHandel(\stdClass::class));
        // TODO: Implement onRequest() method.
        return true;
    }
````
注册之后,其实并没有new stdClass,只有get的时候才有new.在控制器调用:
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/8 0008
 * Time: 15:16
 */

namespace App\HttpController;


use App\Utility\Excel;
use EasySwoole\Component\Context\ContextManager;
use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\Utility\Random;
use EasySwoole\VerifyCode\Conf;
use EasySwoole\VerifyCode\VerifyCode;

class Index extends Controller
{
    function index()
    {
        $data = ContextManager::getInstance()->get('stdclass');
        var_dump($data);
        $this->response()->write(json_encode($data));
    }
}
````

控制台输出:
````
object(stdClass)#52 (1) {
  ["context"]=>
  string(12) "测试内容"
}
````

### 实现原理
context上下文管理器,是通过协程id作为key,进程单例模式,实现的,确保每个协程操作的都是当前协程数据,并通过defer,实现了协程结束后自动销毁,用户无需进行任何的回收处理,只管用就行
