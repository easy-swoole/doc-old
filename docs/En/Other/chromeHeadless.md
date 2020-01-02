---
title: Chrome Headless
meta:
  - name: description
    content: easyswoole,Chrome Headless
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|Chrome Headless|No interface browser | chrome no interface
---
## Chrome Headless
## What is Chrome Headless
Headless Chrome is Chrome's no-interface form that lets you run your programs with all Chrome-supported features without opening your browser. In short, headless chrome has all modern browsers except for no graphical interface. Features, can render the target page as in other modern browsers, and can take screenshots, get cookies, get html and other operations.
For the students who write reptiles, many of them will face a problem, that is, the data is obtained through dynamic rendering or even encryption. The common analytic interface mode can no longer meet the demand, so we introduce Chrome Headless to solve the data rendering problem.

## Deploy Chrome Headless
Because environment deployment is not the focus of this article, we recommend docker directly.
```
docker pull alpeware/chrome-headless-trunk
docker run -d -p 9222:9222 alpeware/chrome-headless-trunk
```

Access the debug address to get the interface information
```
curl http://{HOST}:9222/josn
```

::: warning 
In the following example, the IP host defined by {HOST} rings.
:::


## Drive Chrome Headless

Chrome Headless can remotely drive debug via the websocket protocol. First we introduce the websocket client of easyswoole.
```php
composer require easyswoole/http-client
```
We take the website https://datacenter.jin10.com/price as an example. We can find out that the data in it is refreshed in real time through websocket. At this time, the means of grasping the interface by traditional means is difficult to achieve. The simulation is implemented as follows:

```php
use EasySwoole\HttpClient\HttpClient;
use EasySwoole\Spl\SplBean;
use Swoole\WebSocket\Frame;

static $i = 0;

//Define the command bean. The specific protocol format can be seen in the Chrome Headless document.

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
//Use the websocket protocol to drive Chrome Headless
go(function (){
    $targetUrl = 'https://datacenter.jin10.com/price';
    $ch = curl_init('http://{HOST}:9222/json');
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
    $data = json_decode( curl_exec($ch) ,true);
    $client = new HttpClient($data[0]['webSocketDebuggerUrl']);
    if($client->upgrade()){
        //Open URL
        $command = new Command([
            'method'=>'Page.navigate',
            'params'=>[
                'url'=>$targetUrl
            ]
        ]);
        $client->getClient()->push($command->__toString());
        $client->recv(1);
        //Simulation waiting for rendering
        \co::sleep(2);
        //Implement the js statement
        $command = new Command([
            'method'=>'Runtime.evaluate',
            'params'=>[
                'expression'=>"var p = document.querySelector('#J_pricewall > div:nth-child(1) > ul > li:nth-child(1)').innerHTML;p;"
            ]
        ]);
        $client->getClient()->push($command->__toString());
        //Here you can get the rendered data.
        $data = json_decode($client->recv()->data,true)['result']['result']['value'];
        var_dump($data);

    }else{
        var_dump('handshake fail');
    }
});

```

::: warning 
The above tutorial is for learning purposes only, please do not use it for illegal purposes.
:::

