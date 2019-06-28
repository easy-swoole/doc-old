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
    string file;
    int line;
    string endStatus = self::END_UNKNOWN;
    mixed endArg;
    string pointId;
    int depth = 0;
}
```

### 示例代码
```
use EasySwoole\Tracker\Point;
use EasySwoole\Component\WaitGroup;
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
```

以上代码输出结果：
```
#
PointName:onRequest
Status:success
PointId:uZpqM67Fhmzk5sSLOP
Depth:0
Start:1561733145.3125
StartArg:{"requestArg":"requestArgxxxxxxxx","accessLogId":"logIdxxxxxxxxxx"}
End:1561733145.3264
EndArg:null
ChildCount:0
Children:None
NextPoint:
#
PointName:actionOne
Status:success
PointId:Str3hx9721cavZGzX5
Depth:0
Start:1561733145.3264
StartArg:null
End:1561733146.3303
EndArg:null
ChildCount:2
Children:
        #
        PointName:subOne
        Status:success
        PointId:Lpk4ClNVtAYwoce51n
        Depth:1
        Start:1561733145.3267
        StartArg:null
        End:1561733145.4304
        EndArg:null
        ChildCount:0
        Children:None
        NextPoint:None
        #
        PointName:subTwo
        Status:fail
        PointId:MYali4wqcXk0gsTRAx
        Depth:1
        Start:1561733145.3268
        StartArg:null
        End:1561733146.3302
        EndArg:{"failMsg":"timeout"}
        ChildCount:0
        Children:None
        NextPoint:None
NextPoint:
#
PointName:afterAction
Status:success
PointId:yFxTHB43XJENpOtAkL
Depth:0
Start:1561733146.3303
StartArg:null
End:1561733146.343
EndArg:{"log":"success"}
ChildCount:0
Children:None
NextPoint:None
```

> 如果想以自己的格式记录到数据库，可以具体查看Point实现的方法，每个Point都有自己的Id