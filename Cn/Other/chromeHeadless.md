# Chrome Headless
## 什么是Chrome Headless
Headless Chrome 是 Chrome 浏览器的无界面形态，可以在不打开浏览器的前提下，使用所有 Chrome 支持的特性运行你的程序,简而言之，除了没有图形界面，headless chrome具有所有现代浏览器的特性，可以像在其他现代浏览器里一样渲染目标网页，并能进行网页截图，获取cookie，获取html等操作。
而对于写爬虫的同学，很多都会面临都一个问题，那就是数据都是通过动态渲染，甚至是加密得到的，普通的分析接口模式早已无法满足需求，因此我们引入Chrome Headless 来解决数据渲染问题。

## 部署 Chrome Headless
因为环境部署不是本文的重点，因此我们直接推荐docker。
```
docker pull alpeware/chrome-headless-trunk
docker run -d -p 9222:9222 alpeware/chrome-headless-trunk
```

访问debug 地址即可得到接口信息
```
curl http://{HOST}:9222/josn
```

> 以下例子中，{HOST}定义的IP主机

## 驱动Chrome Headless

Chrome Headless 可以通过websocket协议进行远程驱动debug。首先我们引入easyswoole的websocket客户端。
```
composer require easyswoole/http-client
```
我们以网站 https://datacenter.jin10.com/price 为例子，我们打开可以发现，里面的数据都是通过websocket实时刷新的，这个时候，通过传统手段抓接口的手段，是很难实现的。模拟实现如下：

```php
use EasySwoole\HttpClient\HttpClient;
use EasySwoole\Spl\SplBean;
use Swoole\WebSocket\Frame;

static $i = 0;

//定义命令bean,具体协议格式可以看 Chrome Headless 文档

class Command extends SplBean{
    protected $method;
    protected $id;
    protected $params;
    protected function initialize(): void
    {
        if(empty($this->id)){
            global $i;
            $i++;
            $this->id = $i;
        }
    }
}
//用websocket协议去驱动Chrome Headless
go(function (){
    $targetUrl = 'https://datacenter.jin10.com/price';
    $ch = curl_init('http://{HOST}:9222/json');
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
    $data = json_decode( curl_exec($ch) ,true);
    $client = new HttpClient($data[0]['webSocketDebuggerUrl']);
    if($client->upgrade()){
        //打开URL
        $command = new Command([
            'method'=>'Page.navigate',
            'params'=>[
                'url'=>$targetUrl
            ]
        ]);
        $client->getClient()->push($command->__toString());
        $client->recv(1);
        //模拟等待渲染
        \co::sleep(2);
        //实现 js 语句
        $command = new Command([
            'method'=>'Runtime.evaluate',
            'params'=>[
                'expression'=>"var p = document.querySelector('#J_pricewall > div:nth-child(1) > ul > li:nth-child(1)').innerHTML;p;"
            ]
        ]);
        $client->getClient()->push($command->__toString());
        //此处就可以得到渲染后的数据了
        $data = json_decode($client->recv()->data,true)['result']['result']['value'];
        var_dump($data);

    }else{
        var_dump('handshake fail');
    }
});

```

> 以上教程仅供学习之用，请勿用于非法用途