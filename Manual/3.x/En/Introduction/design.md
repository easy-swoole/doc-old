# Interpretation of design
Component-based and Coroutine-only

## Code reading

```
/bin/easyswoole.php
```
entry script is easyswoole.php. 

### Core class
EasySwoole 3 core class namespace is：
```
EasySwoole\EasySwoole\Core
```
It's a singleton(use EasySwoole\Component\Singleton)，if you want to start server，run:
```
php easyswoole start
```
entry script do these:
- check environment
- set mode (produce or dev, use produce.env or dev.env)
- instantiate(singleton)***Core***, and call ***Core::initialize***
- instantiate(singleton)***Config***, and load config
- call ***Core::createServer*** to start server.

***Core*** class method list:
- __construct  
  ```php
    <?php
    function __construct()
    {
        defined('SWOOLE_VERSION') or define('SWOOLE_VERSION',intval(phpversion('swoole')));
        defined('EASYSWOOLE_ROOT') or define('EASYSWOOLE_ROOT',realpath(getcwd()));
    }
  ```
  define swoole version and framework directory in this method.
  

- setIsDev  
  ```php
  <?php
    function setIsDev(bool $isDev)
    {
        $this->isDev = $isDev;
        return $this;
    }
  ```
   use dev config
   
- initialize  
  ```php
  <?php
    function initialize()
    {
        //check file exist or not
        $file = EASYSWOOLE_ROOT . '/EasySwooleEvent.php';
        if(file_exists($file)){
            require_once $file;
            try{
                $ref = new \ReflectionClass('EasySwoole\EasySwoole\EasySwooleEvent');
                if(!$ref->implementsInterface(Event::class)){
                    die('global file for EasySwooleEvent is not compatible for EasySwoole\EasySwoole\EasySwooleEvent');
                }
                unset($ref);
            }catch (\Throwable $throwable){
                die($throwable->getMessage());
            }
        }else{
            die('global event file missing');
        }
        //initialize
        EasySwooleEvent::initialize();
        //load config
        $this->loadEnv();
        //init temp and log directory
        $this->sysDirectoryInit();
        //register error handler
        $this->registerErrorHandler();
        return $this;
    }
  ```
    该方法用于框架的初始化(单元测试的时候可以配合使用)，该方法中，做了以下事情：
    * 检查并执行全局事件 ***EasySwooleEvent.php*** 中的***initialize*** 方法
    * 调用***Core***中的***loadEnv***方法加载配置文件
    * 调用***Core***中的***sysDirectoryInit***方法对框架目录进行初始化
    * 调用***Core***中的***registerErrorHandler***方法注册框架的错误处理器

- createServer  
   实现代码如下:
   ```php
   <?php
    function createServer()
    {
        $conf = Config::getInstance()->getConf('MAIN_SERVER');
        ServerManager::getInstance()->createSwooleServer(
            $conf['PORT'],$conf['SERVER_TYPE'],$conf['HOST'],$conf['SETTING'],$conf['RUN_MODEL'],$conf['SOCK_TYPE']
        );
        $this->registerDefaultCallBack(ServerManager::getInstance()->getSwooleServer(),$conf['SERVER_TYPE']);
        EasySwooleEvent::mainServerCreate(ServerManager::getInstance()->getMainEventRegister());
        return $this;
    }
   ```
   该方法中，做了以下事情：  
    * 获取配置
    * 创建swooleServer服务
    * 注册服务回调事件
    * 执行***EasySwooleEvent***中的***mainServerCreate***事件

- start  
   实现代码如下:  
   ```php
   <?php
   function start()
       {
           //给主进程也命名
           if(PHP_OS != 'Darwin'){
               $name = Config::getInstance()->getConf('SERVER_NAME');
               cli_set_process_title($name);
           }
           (new TcpService(Config::getInstance()->getConf('CONSOLE')));
           ServerManager::getInstance()->start();
       }
   ```
    该方法中,做了以下事情: 
     * 主进程命名
     * 实例化一个tcp服务用于做控制台服务
     * swoole主服务启动

- sysDirectoryInit  
    实现代码如下:
    ```php
    <?php
    private function sysDirectoryInit():void
        {
            //创建临时目录    请以绝对路径，不然守护模式运行会有问题
            $tempDir = Config::getInstance()->getConf('TEMP_DIR');
            if(empty($tempDir)){
                $tempDir = EASYSWOOLE_ROOT.'/Temp';
                Config::getInstance()->setConf('TEMP_DIR',$tempDir);
            }
            if(!is_dir($tempDir)){
                mkdir($tempDir);
            }
    
            $logDir = Config::getInstance()->getConf('LOG_DIR');
            if(empty($logDir)){
                $logDir = EASYSWOOLE_ROOT.'/Log';
                Config::getInstance()->setConf('LOG_DIR',$logDir);
            }
            if(!is_dir($logDir)){
                mkdir($logDir);
            }
            //设置默认文件目录值
            Config::getInstance()->setConf('MAIN_SERVER.SETTING.pid_file',$tempDir.'/pid.pid');
            Config::getInstance()->setConf('MAIN_SERVER.SETTING.log_file',$logDir.'/swoole.log');
            //设置目录
            Logger::getInstance($logDir);
        }
    ```
    该方法中,做了以下事情: 
     * 创建临时目录
     * 创建日志目录
     * 设置pid文件,swoole.log文件目录

- registerErrorHandler  
   实现代码如下: 
   ```php
   <?php
  private function registerErrorHandler()
    {
        ini_set("display_errors", "On");
        error_reporting(E_ALL | E_STRICT);
        $userHandler = Di::getInstance()->get(SysConst::ERROR_HANDLER);
        if(!is_callable($userHandler)){
            $userHandler = function($errorCode, $description, $file = null, $line = null){
                $l = new Location();
                $l->setFile($file);
                $l->setLine($line);
                Trigger::getInstance()->error($description,$l);
            };
        }
        set_error_handler($userHandler);

        $func = Di::getInstance()->get(SysConst::SHUTDOWN_FUNCTION);
        if(!is_callable($func)){
            $func = function (){
                $error = error_get_last();
                if(!empty($error)){
                    $l = new Location();
                    $l->setFile($error['file']);
                    $l->setLine($error['line']);
                    Trigger::getInstance()->error($error['message'],$l);
                }
            };
        }
        register_shutdown_function($func);
    }
   ```
    该方法中,做了以下事情: 
     * 开启显示错误,配置错误显示级别
     * 获取/设置置  错误处理回调函数
     * 获取/设置    脚本终止回调函数
        
- registerDefaultCallBack  
   实现代码如下:
   ```php
   <?php
    private function registerDefaultCallBack(\swoole_server $server,string $serverType)
    {
        //如果主服务仅仅是swoole server，那么设置默认onReceive为全局的onReceive
        if($serverType === ServerManager::TYPE_SERVER){
            $server->on(EventRegister::onReceive,function (\swoole_server $server, int $fd, int $reactor_id, string $data){
                EasySwooleEvent::onReceive($server,$fd,$reactor_id,$data);
            });
        }else{
            //命名空间
            $namespace = Di::getInstance()->get(SysConst::HTTP_CONTROLLER_NAMESPACE);
            if(empty($namespace)){
                $namespace = 'App\\HttpController\\';
            }
            //url解析最大层级,默认5
            $depth = intval(Di::getInstance()->get(SysConst::HTTP_CONTROLLER_MAX_DEPTH));
            $depth = $depth > 5 ? $depth : 5;
            //对象池控制器实例最大数,默认100
            $max = intval(Di::getInstance()->get(SysConst::HTTP_CONTROLLER_POOL_MAX_NUM));
            if($max == 0){
                $max = 100;
            }
            //实例化webService处理http服务
            $webService = new WebService($namespace,$depth,$max);
            $httpExceptionHandler = Di::getInstance()->get(SysConst::HTTP_EXCEPTION_HANDLER);
            //获取并注册全局的onRequest异常回调
            if($httpExceptionHandler){
                $webService->setExceptionHandler($httpExceptionHandler);
            }
            EventHelper::on($server,EventRegister::onRequest,function (\swoole_http_request $request,\swoole_http_response $response)use($webService){
                $request_psr = new Request($request);
                $response_psr = new Response($response);
                try{
                    //先调用全局事件,如果返回true才进行http调度
                    if(EasySwooleEvent::onRequest($request_psr,$response_psr)){
                        $webService->onRequest($request_psr,$response_psr);
                    }
                }catch (\Throwable $throwable){
                    Trigger::getInstance()->throwable($throwable);
                }finally{
                    try{
                        EasySwooleEvent::afterRequest($request_psr,$response_psr);
                    }catch (\Throwable $throwable){
                        Trigger::getInstance()->throwable($throwable);
                    }
                }
            });
        }
        //注册默认的on task,finish  不经过 event register。因为on task需要返回值。不建议重写onTask,否则es自带的异步任务事件失效
        EventHelper::on($server,EventRegister::onTask,function (\swoole_server $server, $taskId, $fromWorkerId,$taskObj){
            if(is_string($taskObj) && class_exists($taskObj)){
                $taskObj = new $taskObj;
            }
            if($taskObj instanceof AbstractAsyncTask){
                try{
                    $ret =  $taskObj->run($taskObj->getData(),$taskId,$fromWorkerId);
                    //在有return或者设置了结果的时候  说明需要执行结束回调
                    $ret = is_null($ret) ? $taskObj->getResult() : $ret;
                    if(!is_null($ret)){
                        $taskObj->setResult($ret);
                        return $taskObj;
                    }
                }catch (\Throwable $throwable){
                    $taskObj->onException($throwable);
                }
            }else if($taskObj instanceof SuperClosure){
                try{
                    return $taskObj( $server, $taskId, $fromWorkerId);
                }catch (\Throwable $throwable){
                    Trigger::getInstance()->throwable($throwable);
                }
            }
            return null;
        });
        EventHelper::on($server,EventRegister::onFinish,function (\swoole_server $server, $taskId, $taskObj){
            //finish 在仅仅对AbstractAsyncTask做处理，其余处理无意义。
            if($taskObj instanceof AbstractAsyncTask){
                try{
                    $taskObj->finish($taskObj->getResult(),$taskId);
                }catch (\Throwable $throwable){
                    $taskObj->onException($throwable);
                }
            }
        });

        //注册默认的pipe通讯
        OnCommand::getInstance()->set('TASK',function ($fromId,$taskObj){
            if(is_string($taskObj) && class_exists($taskObj)){
                $taskObj = new $taskObj;
            }
            if($taskObj instanceof AbstractAsyncTask){
                try{
                    $taskObj->run($taskObj->getData(),ServerManager::getInstance()->getSwooleServer()->worker_id,$fromId);
                }catch (\Throwable $throwable){
                    $taskObj->onException($throwable);
                }
            }else if($taskObj instanceof SuperClosure){
                try{
                    $taskObj();
                }catch (\Throwable $throwable){
                    Trigger::getInstance()->throwable($throwable);
                }
            }
        });

        EventHelper::on($server,EventRegister::onPipeMessage,function (\swoole_server $server,$fromWorkerId,$data){
            $message = \swoole_serialize::unpack($data);
            if($message instanceof Message){
                OnCommand::getInstance()->hook($message->getCommand(),$fromWorkerId,$message->getData());
            }else{
                Trigger::getInstance()->error("data :{$data} not packet by swoole_serialize or not a Message Instance");
            }
        });

        //注册默认的worker start
        EventHelper::registerWithAdd(ServerManager::getInstance()->getMainEventRegister(),EventRegister::onWorkerStart,function (\swoole_server $server,$workerId){
            if(PHP_OS != 'Darwin'){
                $name = Config::getInstance()->getConf('SERVER_NAME');
                if( ($workerId < Config::getInstance()->getConf('MAIN_SERVER.SETTING.worker_num')) && $workerId >= 0){
                    $type = 'Worker';
                }else{
                    $type = 'TaskWorker';
                }
                cli_set_process_title("{$name}.{$type}.{$workerId}");
            }
        });
    }
   ```
    该方法中,做了以下事情: 
     * 如果主服务为swoole server,则只注册onReceive全局事件为回调函数
     * 如果主服务不是swoole server则:注册http服务的 onRequest回调,以及拦截异常
     * 注册onTask,onFinish回调
     * 注册默认的pipe通讯
     * 注册默认的worker start
     
- loadEnv  
    实现代码如下:
    ```php
    <?php
    private function loadEnv()
    {
        //加载之前，先清空原来的
        if($this->isDev){
            $file  = EASYSWOOLE_ROOT.'/dev.php';
        }else{
            $file  = EASYSWOOLE_ROOT.'/produce.php';
        }
        Config::getInstance()->loadEnv($file);
    }
    ```
    该方法判断了是否为开发环境,如果是,则加载dev.env配置文件,否则加载produce.env配置文件

    
###  ServerManager Class

ServerManager is a singleton class (use EasySwoole\Component\Singleton), full namespace is：
```
EasySwoole\EasySwoole\ServerManager
```
Method list：

- __construct  

    In construct method, new a ***EasySwoole\EasySwoole\Swoole\EventRegister***，it's an event container.
- getSwooleServer  
    get swoole server object or sub server
- createSwooleServer  
    create swoole server
- addServer  
    register a sub server
- getMainEventRegister  
    get event register object
- start  
    register some callback, sub server, and start server
- attachListener  
    add sub servers which are registed to swoole server
- getSubServerRegister  
    get sub servers which are registed     
