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
