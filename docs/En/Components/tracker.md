---
title: Tracker
meta:
  - name: description
    content: Easyswoole provides a basic tracking component that allows users to implement basic server status monitoring and call chain logging.
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|Tracker
---

# Tracker

Easyswoole provides a basic tracking component that allows users to implement basic server status monitoring and call chain logging.

## Installation
```
composer require easyswoole/tracker
```

## Call chain
Easyswoole's call chain tracking is implemented by deconstruction of a similar ordered tree list, deconstructed as follows:

```php
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

### Sample code
```php

use EasySwoole\Tracker\Point;
use EasySwoole\Component\WaitGroup;
use EasySwoole\Tracker\PointContext;
/*
 * Suppose our call chain is like this
 * onRequest  ->> actionOne ->> actionOne call remote Api(1,2)  ->>  afterAction
 */

go(function (){
    /*
     * Create an entry
     */
    $onRequest = new Point('onRequest');
    //Record request parameters and simulate access log
    \co::sleep(0.01);
    $onRequest->setStartArg([
        'requestArg' => 'requestArgxxxxxxxx',
        'accessLogId'=>'logIdxxxxxxxxxx'
    ]);
    //onRequest completed
    $onRequest->end();
    //Go to next actionOne
    $actionOne = $onRequest->next('actionOne');
        //action one Enter the sub-link call
        $waitGroup = new WaitGroup();
        //sub pointOne
        $waitGroup->add();
        $subOne = $actionOne->appendChild('subOne');
        go(function ()use($subOne,$waitGroup){
                \co::sleep(0.1);
                $subOne->end();
                $waitGroup->done();
        });
        //sub pointTwo,And assume failure
        $waitGroup->add();
        $subTwo = $actionOne->appendChild('subTwo');
            go(function ()use($subTwo,$waitGroup){
                \co::sleep(1);
                $subTwo->end($subTwo::END_FAIL,['failMsg'=>'timeout']);
                $waitGroup->done();
            });
        $waitGroup->wait();
    $actionOne->end();
    //End of actionOne，Enter afterAction
    $afterAction = $actionOne->next('afterAction');
    //Analog response record
    \co::sleep(0.01);
    $afterAction->end($afterAction::END_SUCCESS,['log'=>'success']);
    /*
     * Print the call chain from the entrance
     */
    echo Point::toString($onRequest);
});
//The above code is equivalent to the following
go(function (){
    PointContext::getInstance()->createStart('onRequest')->next('actionOne')->next('afterAction');
    //Record request parameters and simulate access log
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
    //sub pointTwo,And assume failure
    $waitGroup->add();
    go(function ()use($subTwo,$waitGroup){
        \co::sleep(1);
        $subTwo->end($subTwo::END_FAIL,['failMsg'=>'timeout']);
        $waitGroup->done();
    });
    $waitGroup->wait();
    PointContext::getInstance()->find('actionOne')->end();
    //Analog response record
    \co::sleep(0.01);
    PointContext::getInstance()->find('afterAction')->end(Point::END_SUCCESS,['log'=>'success']);
    /*
    * Print the call chain from the entrance
    */
    echo Point::toString(PointContext::getInstance()->startPoint());
});
```

The above code output results:
```php
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


::: warning 
 If you want to record to the database in your own format, you can specifically look at the method implemented by Point. Each Point has its own Id.
 :::
 
 ### Basic API HTTP API Request Tracking

EasySwooleEvent.php

```php
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
```php
namespace App\HttpController;

use EasySwoole\Component\WaitGroup;
use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\Tracker\PointContext;

class Index extends Controller
{

    protected function onRequest(?string $action): ?bool
    {
        /*
         * Call relationship  HttpRequest->OnRequest
         */
        $point = PointContext::getInstance()->next('ControllerOnRequest');
        //Assume that the permission verification is performed here and the time spent in the simulation database is simulated.
        \co::sleep(0.01);
        $point->setEndArg([
            'userId'=>'xxxxxxxxxxx'
        ]);
        $point->end();
        return true;
    }

    function index()
    {
        //Simulation calls third-party Api, calling relationship  OnRequest->sub(subApi1,subApi2)
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

Each request above will output the following format:
```php
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
### Api call chain record
```
$array = Point::toArray($point);
```
You can turn an entry point into an array. For example, we can store the following key structures in the MYSQL database:
```php
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

::: warning 
 The remaining request parameters can be recorded by themselves.
:::

The core fields are in the four fields of pointId, parentId and isNext, status. For example, I want to get the call chain timeout, then it is directly
```
where status = fail
```
If you want to see which call takes time, you can
```
where spendTime > 3
```

::: warning 
 spendTime is calculated with startTime and endTime
:::


## Basic Server Information
Obtain basic server state information by executing the shell, for example, obtaining hard disk partition information:
```php
$list = \EasySwoole\Tracker\Shell\Shell::diskPartitions();
foreach ($list as $item){
   var_dump($item->toArray());
}
```
The list of supported methods is as follows:

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


::: warning 
 Note that the above method may require root privileges and is not compatible with mac.
:::
