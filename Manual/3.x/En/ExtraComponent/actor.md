# Actor
## Git
https://github.com/easy-swoole/actor
## Composer 
```
composer require eaasyswoole/actor
```

## SwooleServerBased
```
use EasySwoole\Actor\Actor;
use EasySwoole\Actor\Test\RoomActor;

Actor::getInstance()->register(RoomActor::class);


$http = new swoole_http_server("127.0.0.1", 9501);

Actor::getInstance()->attachToServer($http);

$http->on("start", function ($server) {
    echo "Swoole http server is started at http://127.0.0.1:9501\n";
});

$http->on("request", function ($request, $response) {
    var_dump(RoomActor::invoke()->status());
    $response->header("Content-Type", "text/plain");
    $response->end("Hello World\n");
});

$http->start();
```

## SwooleProcessBase
```
use EasySwoole\Actor\Actor;
use EasySwoole\Actor\Test\RoomActor;

Actor::getInstance()->register(RoomActor::class);


$processes = Actor::getInstance()->initProcess();

foreach ($processes as $process){
    $process->getProcess()->start();
}

while($ret = \Swoole\Process::wait()) {
    echo "PID={$ret['pid']}\n";
}
```


## Client

```
use EasySwoole\Actor\Actor;
use EasySwoole\Actor\Test\RoomActor;

Actor::getInstance()->register(RoomActor::class);

go(function (){
    $actorId = RoomActor::invoke()->create([
        'arg'=>1,
        'time'=>time()
    ]);
    var_dump($actorId .' create');
//    $ret = RoomActor::invoke()->exit('0000000000001');
//    $ret = RoomActor::invoke()->push('0020000000001',2);
//    $ret = RoomActor::invoke()->pushMulti([
//        "0020000000001"=>'0001data',
//        '0010000000001'=>'0022Data'
//    ]);
    $ret = RoomActor::invoke()->broadcastPush('121212');
//    $ret = RoomActor::invoke()->exitAll();
     var_dump($ret);
});

```

## Cli-Test
```
use EasySwoole\Actor\Test\RoomActor;
use EasySwoole\Actor\DeveloperTool;

go(function (){
    $tool = new DeveloperTool(RoomActor::class,'001000001',[
        'startArg'=>'startArg....'
    ]);
    $tool->onReply(function ($data){
        var_dump('reply :'.$data);
    });
    swoole_event_add(STDIN,function ()use($tool){
        $ret = trim(fgets(STDIN));
        if(!empty($ret)){
            go(function ()use($tool,$ret){
                $tool->push(trim($ret));
            });
        }
    });
    $tool->run();
});
```