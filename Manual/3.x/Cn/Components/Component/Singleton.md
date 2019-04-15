# 单例
单例模式确保类在全局只能有一个实例，因为它的实例是由自己保存，在类的外部也无法对该类进行实例化。  

## 作用
PHP的单例模式是为了避免重复创建对象带来的资源消耗。

## 用途
实际项目中像数据库查询，日志输出，全局回调，统一校验等模块。这些模块功能单一，但需要多次访问，如果能够全局唯一，多次复用会大大提升性能。

## 例子

```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/5/24
 * Time: 下午4:17
 */

namespace EasySwoole\Component;


class Di
{
    use Singleton;
    private $container = array();

    public function set($key, $obj,...$arg):void
    {
        /*
         * 注入的时候不做任何的类型检测与转换
         * 由于编程人员为问题，该注入资源并不一定会被用到
         */
        $this->container[$key] = array(
            "obj"=>$obj,
            "params"=>$arg,
        );
    }

    function delete($key):void
    {
        unset( $this->container[$key]);
    }

    function clear():void
    {
        $this->container = array();
    }

    /**
     * @param $key
     * @return null
     * @throws \Throwable
     */
    function get($key)
    {
        if(isset($this->container[$key])){
            $obj = $this->container[$key]['obj'];
            $params = $this->container[$key]['params'];
            if(is_object($obj) || is_callable($obj)){
                return $obj;
            }else if(is_string($obj) && class_exists($obj)){
                try{
                    $this->container[$key]['obj'] = new $obj(...$params);
                    return $this->container[$key]['obj'];
                }catch (\Throwable $throwable){
                    throw $throwable;
                }
            }else{
                return $obj;
            }
        }else{
            return null;
        }
    }
}
``` 

Di容器设置全局回调。

## 核心对象方法

核心类：EasySwoole\Component\Singleton。

获取对象

* mixed     $args     参数

static function getInstance(...$args)
    