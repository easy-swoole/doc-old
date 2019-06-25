# Singleton mode
The singleton pattern ensures that a class can only have one instance globally, because its instance is saved by itself and cannot be instantiated outside the class.
## objective
The PHP singleton mode is designed to avoid resource consumption caused by repeated object creation.

## Usefulness
In actual projects, such as database query, log output, global callback, unified verification and other modules. These modules have a single function, but need multiple access. If they are globally unique, multiple reuse will greatly improve performance.
## Example

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
         * Do not do any type detection and conversion during injection
         * Due to programmer problems，This injection of resources may not necessarily be used
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

The Di container sets the global callback.

## Core classes and methods
   
Core classes：EasySwoole\Component\Singleton。

Get objects

* mixed     $args     parameter
                      
static function getInstance(...$args)
    