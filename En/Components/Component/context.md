## Context
ContextManager Context Manager
  
In swoole, because multiple coroutines are executed concurrently, the coroutine context cannot be saved using class static variables/global variables. It is safe to use local variables because the values of local variables are automatically stored in the coroutine stack, and other coroutines cannot access the local variables of coroutine.

### Operational data
Set data in `EasySwooleEvent.php`'s `onRequest`:
````php
<?php
public static function onRequest(Request $request, Response $response): bool
{
    ContextManager::getInstance()->set('requestData',$request->getRequestParam());
    // TODO: Implement onRequest() method.
    return true;
}
````
`App\Controller\Index.php`Can be invoked directly:
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
> Similarly, set data everywhere belongs to the shared data of current coroutine, which is similar to the properties of superglobal variables in php-fpm. Through this component, $_GET, $_SESSION, $_POST and other superglobal variables can be obtained and modified at any location.
  
### Method list
    
````php
<?php
public function set($key,$value,$cid = null){};//Set a variable,cid to null for the current coroutine
public function get($key,$cid = null){};//Get a variable,cid to null for the current coroutine
public function unset($key,$cid = null){};//Delete a variable,cid to null for the current coroutine
public function destroy($cid = null){};//Destroy coroutine's data,cid to null for the current coroutine
public function getCid($cid = null):int{};//The default is to get the ID of the current coroutine and to automatically destroy the coroutine data when the coroutine is closed.
public function destroyAll($force = false){};//Destroy all coroutine data
public function getContextArray($cid = null){};//Get the current coroutine data list, cid null for the current coroutine
public function registerItemHandler($key, ContextItemHandlerInterface $handler):ContextManager();//Register custom storage, destroy logic
````
#### registerItemHandler
`ContextManager` provides another way to set it up,The `registerItemHandler` method registers data that requires additional processing.First inherit the `EasySwoole\Component\Context\ContextItemHandlerInterface` interface

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
     * This method is called when ContextManager get
     * This method can be used to initialize get
     * For example, when set mysql, you can get the connection pool here
     * For example, when you set an object, you can initialize the object properties here, and so on.
     * onContextCreate
     * @author Tioncico
     * Time: 14:09
     */
    function onContextCreate()
    {
        $class = new $this->className;
        $class->context = 'test content';
        return $class;
        // TODO: Implement onContextCreate() method.
    }

    /**
     * This method is called when ContextManager unset or destroy
     * This method can be used for post-destruction operations.
     * For example, when set MySQL needs to be destroyed, the connection pool can be reclaimed here.
     * For example, when you set an object, you can clear the object attributes here, and so on.
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
Register stdClass 
````php
<?php
    public static function onRequest(Request $request, Response $response): bool
    {
        ContextManager::getInstance()->registerItemHandler('stdclass',new RegisterClassHandel(\stdClass::class));
        // TODO: Implement onRequest() method.
        return true;
    }
````
After registration, there is no new stdClass, only new when get. Called by the controller:
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

Console output:
````
object(stdClass)#52 (1) {
  ["context"]=>
  string(12) "test content"
}
````

### Realization principle
Context Context Manager is implemented by using coroutine ID as key and process singleton mode. It ensures that every coroutine operation is the current coroutine data. Through defer, it realizes the automatic destruction of coroutine after the end of the operation. Users need not do any recovery processing, just use it.
