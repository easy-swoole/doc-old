<head>
     <title>EasySwoole 调用链跟踪|swoole 连接调用链跟踪|swoole 监控|swoole 跟踪|PHP调用链跟踪</title>
     <meta name="keywords" content="EasySwoole 调用链跟踪|swoole 连接调用链跟踪|swoole 监控|swoole 跟踪|PHP调用链跟踪"/>
     <meta name="description" content="EasySwoole 调用链跟踪|swoole 连接调用链跟踪|swoole 监控|swoole 跟踪|PHP调用链跟踪"/>
</head>
---<head>---

# Tracker

Easyswoole提供了一个基础的追踪组件，方便用户实现基础的服务器状态监控，与调用链记录。

## 安装
```
composer require easyswoole/tracker
```

## 调用链
Easyswoole的调用链跟踪是一个以类似有序的树状链表的解构实现的，解构如下：

```
struct Point{
    struct Point* nextPoint;
    struct Point[] subPoints;
    const END_SUCCESS = 'success';
    const END_FAIL = 'fail';
    const END_UNKNOWN = 'unknown';
    int startTime;
    mixed startArg;
    int endTime;
    string pointName;
    string endStatus = self::END_UNKNOWN;
    mixed endArg;
    string pointId;
    string parentId;
    int depth = 0;
    bool isNext
}
```

### 示例代码
```

use EasySwoole\Tracker\Point;
use EasySwoole\Component\WaitGroup;
use EasySwoole\Tracker\PointContext;
/*
 * 假设我们的调用链是这样的
 * onRequest  ->> actionOne ->> actionOne call remote Api(1,2)  ->>  afterAction
 */

go(function (){
    /*
     * 创建入口
     */
    $onRequest = new Point('onRequest');
    //记录请求参数，并模拟access log
    \co::sleep(0.01);
    $onRequest->setStartArg([
        'requestArg' => 'requestArgxxxxxxxx',
        'accessLogId'=>'logIdxxxxxxxxxx'
    ]);
    //onRequest完成
    $onRequest->end();
    //进入 next actionOne
    $actionOne = $onRequest->next('actionOne');
        //action one 进入子环节调用
        $waitGroup = new WaitGroup();
        //sub pointOne
        $waitGroup->add();
        $subOne = $actionOne->appendChild('subOne');
        go(function ()use($subOne,$waitGroup){
                \co::sleep(0.1);
                $subOne->end();
                $waitGroup->done();
        });
        //sub pointTwo,并假设失败
        $waitGroup->add();
        $subTwo = $actionOne->appendChild('subTwo');
            go(function ()use($subTwo,$waitGroup){
                \co::sleep(1);
                $subTwo->end($subTwo::END_FAIL,['failMsg'=>'timeout']);
                $waitGroup->done();
            });
        $waitGroup->wait();
    $actionOne->end();
    //actionOne结束，进入afterAction
    $afterAction = $actionOne->next('afterAction');
    //模拟响应记录
    \co::sleep(0.01);
    $afterAction->end($afterAction::END_SUCCESS,['log'=>'success']);
    /*
     * 从入口开始打印调用链
     */
    echo Point::toString($onRequest);
});
//以上代码等价于如下
go(function (){
    PointContext::getInstance()->createStart('onRequest')->next('actionOne')->next('afterAction');
    //记录请求参数，并模拟access log
    \co::sleep(0.01);
    PointContext::getInstance()->find('onRequest')->setStartArg([
        'requestArg' => 'requestArgxxxxxxxx',
        'accessLogId'=>'logIdxxxxxxxxxx'
    ])->end();
    $subOne = PointContext::getInstance()->find('actionOne')->appendChild('subOne');
    $subTwo = PointContext::getInstance()->find('actionOne')->appendChild('subTwo');
    $waitGroup = new WaitGroup();
    $waitGroup->add();
    go(function ()use($subOne,$waitGroup){
        \co::sleep(0.1);
        $subOne->end();
        $waitGroup->done();
    });
    //sub pointTwo,并假设失败
    $waitGroup->add();
    go(function ()use($subTwo,$waitGroup){
        \co::sleep(1);
        $subTwo->end($subTwo::END_FAIL,['failMsg'=>'timeout']);
        $waitGroup->done();
    });
    $waitGroup->wait();
    PointContext::getInstance()->find('actionOne')->end();
    //模拟响应记录
    \co::sleep(0.01);
    PointContext::getInstance()->find('afterAction')->end(Point::END_SUCCESS,['log'=>'success']);
    /*
    * 从入口开始打印调用链
    */
    echo Point::toString(PointContext::getInstance()->startPoint());
});
```

以上代码输出结果：
```
#
PointName:onRequest
Status:success
PointId:AoRVFMgrsbNwukBZc7
Depth:0
IsNext:false
Start:1561736477.2808
StartArg:{"requestArg":"requestArgxxxxxxxx","accessLogId":"logIdxxxxxxxxxx"}
End:1561736477.2939
EndArg:null
ChildCount:0
Children:None
NextPoint:
#
PointName:actionOne
Status:success
PointId:2zOWG1SvMbyBcnRmje
Depth:0
IsNext:true
Start:1561736477.2809
StartArg:null
End:1561736478.2993
EndArg:null
ChildCount:2
Children:
        #
        PointName:subOne
        Status:success
        PointId:0wU31l8brpfCnXdTxH
        Depth:1
        IsNext:false
        Start:1561736477.2939
        StartArg:null
        End:1561736477.4006
        EndArg:null
        ChildCount:0
        Children:None
        NextPoint:None
        #
        PointName:subTwo
        Status:fail
        PointId:Jphr6RD8KSHmYbt70A
        Depth:1
        IsNext:false
        Start:1561736477.2939
        StartArg:null
        End:1561736478.2993
        EndArg:{"failMsg":"timeout"}
        ChildCount:0
        Children:None
        NextPoint:None
NextPoint:
#
PointName:afterAction
Status:success
PointId:oPnGNrkj6qwb381BQl
Depth:0
IsNext:true
Start:1561736477.2809
StartArg:null
End:1561736478.3119
EndArg:{"log":"success"}
ChildCount:0
Children:None
NextPoint:None
```

> 如果想以自己的格式记录到数据库，可以具体查看Point实现的方法，每个Point都有自己的Id

### 基础实例之HTTP API请求追踪

EasySwooleEvent.php

```
namespace EasySwoole\EasySwoole;


use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;
use EasySwoole\Tracker\Point;
use EasySwoole\Tracker\PointContext;

class EasySwooleEvent implements Event
{

    public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
    }

    public static function mainServerCreate(EventRegister $register)
    {

    }

    public static function onRequest(Request $request, Response $response): bool
    {
        $point = PointContext::getInstance()->createStart('onRequest');
        $point->setStartArg([
            'uri'=>$request->getUri()->__toString(),
            'get'=>$request->getQueryParams()
        ]);
        return true;
    }

    public static function afterRequest(Request $request, Response $response): void
    {
        $point = PointContext::getInstance()->startPoint();
        $point->end();
        echo Point::toString($point);
        $array = Point::toArray($point);
    }
}
```

Index.php
```
namespace App\HttpController;

use EasySwoole\Component\WaitGroup;
use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\Tracker\PointContext;

class Index extends Controller
{

    protected function onRequest(?string $action): ?bool
    {
        /*
         * 调用关系  HttpRequest->OnRequest
         */
        $point = PointContext::getInstance()->next('ControllerOnRequest');
        //假设这里进行了权限验证，并模拟数据库耗时
        \co::sleep(0.01);
        $point->setEndArg([
            'userId'=>'xxxxxxxxxxx'
        ]);
        $point->end();
        return true;
    }

    function index()
    {
        //模拟调用第三方Api,调用关系  OnRequest->sub(subApi1,subApi2)
        $actionPoint = PointContext::getInstance()->next('indexAction');
        $wait = new WaitGroup();
        $subApi = $actionPoint->appendChild('subOne');
        $wait->add();
        go(function ()use($wait,$subApi){
            \co::sleep(1);
            $subApi->end();
            $wait->done();
        });

        $subApi = $actionPoint->appendChild('subTwo');
        $wait->add();
        go(function ()use($wait,$subApi){
            \co::sleep(0.3);
            $subApi->end($subApi::END_FAIL);
            $wait->done();
        });

        $wait->wait();

        $actionPoint->end();
        $this->response()->write('hello world');
    }
}
```

以上每次请求会输出如下格式：
```
#
PointName:onRequest
Status:success
PointId:1561743038GyV4lnus
ParentId:
Depth:0
IsNext:false
Start:1561743038.7011
StartArg:{"uri":"http://127.0.0.1:9501/","get":[]}
End:1561743039.7152
EndArg:null
ChildCount:0
Children:None
NextPoint:
#
PointName:ControllerOnRequest
Status:success
PointId:15617430386f0OQDsS
ParentId:1561743038GyV4lnus
Depth:0
IsNext:true
Start:1561743038.7025
StartArg:null
End:1561743038.713
EndArg:null
ChildCount:0
Children:None
NextPoint:
#
PointName:indexAction
Status:success
PointId:1561743038XEmF0M49
ParentId:15617430386f0OQDsS
Depth:0
IsNext:true
Start:1561743038.7131
StartArg:null
End:1561743039.7151
EndArg:null
ChildCount:2
Children:
        #
        PointName:subOne
        Status:success
        PointId:1561743038uIkzYgcS
        ParentId:1561743038XEmF0M49
        Depth:1
        IsNext:false
        Start:1561743038.7135
        StartArg:null
        End:1561743039.7151
        EndArg:null
        ChildCount:0
        Children:None
        NextPoint:None
        #
        PointName:subTwo
        Status:fail
        PointId:1561743038PslVSY4n
        ParentId:1561743038XEmF0M49
        Depth:1
        IsNext:false
        Start:1561743038.7136
        StartArg:null
        End:1561743039.0149
        EndArg:null
        ChildCount:0
        Children:None
        NextPoint:None
NextPoint:None
```
### Api调用链记录
```
$array = Point::toArray($point);
```
可以把一个入口点转为一个数组。例如我们可以在MYSQL数据库中存储以下关键结构：
```
CREATE TABLE `api_tracker_point_list` (
  `pointd` varchar(18) NOT NULL,
  `pointName` varchar(45) DEFAULT NULL,
  `parentId` varchar(18) DEFAULT NULL,
  `depth` int(11) NOT NULL DEFAULT '0',
  `isNext` int(11) NOT NULL DEFAULT '0',
  `startTime` varchar(14) NOT NULL,
  `endTime` varchar(14) DEFAULT NULL,
  `status` varchar(10) NOT NULL,
  PRIMARY KEY (`pointd`),
  UNIQUE KEY `trackerId_UNIQUE` (`pointd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

```
> 其余请求参数可以自己记录。

核心字段在pointId，parentId与isNext，status 这四个个字段,例如，我想得到哪次调用链超时，那么就是直接
```
where status = fail
```
如果想看哪次调用耗时多少，那么可以
```
where spendTime > 3
```
> spendTime 是用startTime和endTime计算


## 基础服务器信息
通过执行shell获取基础的服务器状态信息，例如获取硬盘分区信息：
```
$list = \EasySwoole\Tracker\Shell\Shell::diskPartitions();
foreach ($list as $item){
   var_dump($item->toArray());
}
```
支持的方法列表如下：

- arpCache() 
- bandWidth() 
- cpuIntensiveProcesses() 
- diskPartitions() 
- currentRam() 
- cpuInfo() 
- generalInfo() 
- ioStats() 
- ipAddresses() 
- loadAvg() 
- memoryInfo() 
- ramIntensiveProcesses() 
- swap() 
- userAccounts()

> 注意，以上方法可能需要root权限，另外对mac不兼容 
