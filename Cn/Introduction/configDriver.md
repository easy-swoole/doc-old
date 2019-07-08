# Config驱动
EasySwoole在3.2.5版本后,默认配置驱动存储 从SplArray改为了swoole_table,修改配置之后,所有进程同时生效

## \EasySwoole\Config\AbstractConfig
AbstractConfig 抽象类提供了以下几个方法,用于给其他config驱动继承
- __construct(bool $isDev = true)
  传入是否为开发环境的参数,根据该参数去加载dev.php或者produce.php
- isDev() 
 可通过该方法获得当前运行环境是否为开发环境
- abstract function getConf($key = null);
  获取一个配置
- abstract function setConf($key,$val):bool ;
  设置一个参数
- abstract function load(array $array):bool ;
  重新加载配置项
- abstract function merge(array $array):bool ;
  合并配置项
- abstract function clear():bool ;
  清除所有配置项
  
## 自定义配置
在EasySwoole中,自带了SplArray和swoole_table驱动实现,可自行查看源码了解.   
默认驱动为swoole_table  

如需要修改存储驱动,步骤如下:
* 继承 AbstractConfig 实现各个方法
* 在
````php 
<?php
public static function initialize()
{
//获得原先的config配置项,加载到新的配置项中
   $config = Config::getInstance()->getConf();
   Config::getInstance()->storageHandler(new SplArrayConfig())->load($config);
   // TODO: Implement initialize() method.
   date_default_timezone_set('Asia/Shanghai');
}
````

## 动态配置问题
由于swoole是多进程的,如果使用SplArray方式存储,在单个进程修改配置后,其他进程将不会生效,使用swoole_table方式的则会全部生效,需要注意