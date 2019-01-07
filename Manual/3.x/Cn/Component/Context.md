## Context
ContextManager上下文管理器  
在swoole中,由于多个协程是并发执行的，因此不能使用类静态变量/全局变量保存协程上下文内容。使用局部变量是安全的，因为局部变量的值会自动保存在协程栈中，其他协程访问不到协程的局部变量。  
在控制器中,我们可以使用ContextManager保存协程上下文内容:
```php
//在 onRequest全局事件中注册MysqlObject
ContextManager::getInstance()->set('mysqlObject',PoolManager::getInstance()->getPool(MysqlPool::class)->getObj());
//注册一个mysql连接,这次请求都将是单例Mysql的
//在控制器中获取本次请求唯一的一个数据库连接

function index()
{
    $mysqlObject = \EasySwoole\Component\Context\ContextManager::getInstance()->get('mysqlObject');
    $data = ($mysqlObject->get('test'));
    $this->response()->write(json_encode($data));
}

```
>如上,我们可以使用Context实现在某个协程中的"全局"变量,这个变量在当前协程中是可全局访问修改的   
>EasySwoole3.1.5版本已经实现了自动销毁Context,无需手动

实现代码:
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2019-01-06
 * Time: 22:58
 */

namespace EasySwoole\Component\Context;


use EasySwoole\Component\Context\Exception\ModifyError;
use EasySwoole\Component\Singleton;
use Swoole\Coroutine;

class ContextManager
{
    use Singleton;

    private $handler = [];

    private $context = [];

    /**
     * 注册一个context处理,在调用get,unset时会调用HandlerInterface的onContextCreate,onDestroy方法
     * handler
     * @param                  $key
     * @param HandlerInterface $handler
     * @return ContextManager
     * @author tioncico
     * Time: 15:42
     */
    public function handler($key,HandlerInterface $handler):ContextManager
    {
        $this->handler[$key] = $handler;
        return $this;
    }

    /**
     * 设置一个值
     * set
     * @param      $key
     * @param      $value
     * @param null $cid
     * @return ContextManager
     * @throws ModifyError
     * @author tioncico
     * Time: 15:43
     */
    public function set($key,$value,$cid = null):ContextManager
    {
        if(isset($this->handler[$key])){
            throw new ModifyError('key is already been register for handler');
        }
        $cid = $this->getCid($cid);
        $this->context[$cid][$key] = $value;
        return $this;
    }

    /**
     * 获取一个值,如果使用handler注册,还会调用handler的onContextCreate方法
     * get
     * @param      $key
     * @param null $cid
     * @return null
     * @author tioncico
     * Time: 15:44
     */
    public function get($key,$cid = null)
    {
        $cid = $this->getCid($cid);
        if(isset($this->context[$cid][$key])){
            return $this->context[$cid][$key];
        }
        if(isset($this->handler[$key])){
            /** @var HandlerInterface $handler */
            $handler = $this->handler[$key];
            $this->context[$cid][$key] = $handler->onContextCreate();
            return $this->context[$cid][$key];
        }
        return null;
    }

    /**
     * 删除一个值,如果是使用handler注册,还会调用handler的onDestroy方法
     * unset
     * @param      $key
     * @param null $cid
     * @return bool
     * @author tioncico
     * Time: 15:44\
     */
    public function unset($key,$cid = null)
    {
        $cid = $this->getCid($cid);
        if(isset($this->context[$cid][$key])){
            if(isset($this->handler[$key])){
                /** @var HandlerInterface $handler */
                $handler = $this->handler[$key];
                $item = $this->context[$cid][$key];
                return $handler->onDestroy($item);
            }
            unset($this->context[$cid][$key]);
            return true;
        }else{
            return false;
        }
    }

    /**
     * 销毁当前协程所有值
     * destroy
     * @param null $cid
     * @author tioncico
     * Time: 15:44
     */
    public function destroy($cid = null)
    {
        $cid = $this->getCid($cid);
        if(isset($this->context[$cid])){
            $data = $this->context[$cid];
            foreach ($data as $key => $val){
                $this->unset($key,$cid);
            }
        }
        unset($this->context[$cid]);
    }

    /**
     * 获取当前协程id
     * getCid
     * @param null $cid
     * @return int
     * @author tioncico
     * Time: 15:45
     */
    public function getCid($cid = null):int
    {
        if($cid === null){
            return Coroutine::getUid();
        }
        return $cid;
    }

    /**
     * 清空所有值
     * destroyAll
     * @param bool $force
     * @author tioncico
     * Time: 15:45
     */
    public function destroyAll($force = false)
    {
        if($force){
            $this->context = [];
        }else{
            foreach ($this->context as $cid => $data){
                $this->destroy($cid);
            }
        }
    }

    /**
     * 获取当前协程所有变量
     * getContextArray
     * @param null $cid
     * @return array|null
     * @author tioncico
     * Time: 15:45
     */
    public function getContextArray($cid = null):?array
    {
        $cid = $this->getCid($cid);
        if(isset($this->context[$cid])){
            return $this->context[$cid];
        }else{
            return null;
        }
    }
}
```