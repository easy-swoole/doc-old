# kafka
This project code is referenced from https://github.com/weiboad/kafka-php

# Installation
```php
composer required easyswoole/kafka
```

### Register kafka service
```php
namespace EasySwoole\EasySwoole;

use App\Producer\Process as ProducerProcess;
use App\Consumer\Process as ConsumerProcess;
use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;

class EasySwooleEvent implements Event
{

    public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
    }

    public static function mainServerCreate(EventRegister $register)
    {
        // TODO: Implement mainServerCreate() method.
        // Producer
        ServerManager::getInstance()->getSwooleServer()->addProcess((new ProducerProcess())->getProcess());
        // consumer
        ServerManager::getInstance()->getSwooleServer()->addProcess((new ConsumerProcess())->getProcess());
    }
    
    ......
    
}

```
### Producer
```php
namespace App\Producer;

use EasySwoole\Component\Process\AbstractProcess;
use EasySwoole\Kafka\Config\ProducerConfig;
use EasySwoole\Kafka\kafka;

class Process extends AbstractProcess
{
    protected function run($arg)
    {
        go(function () {
            $config = new ProducerConfig();
            $config->setMetadataBrokerList('127.0.0.1:9092,127.0.0.1:9093');
            $config->setBrokerVersion('0.9.0');
            $config->setRequiredAck(1);

            $kafka = new kafka($config);
            $result = $kafka->producer()->send([
                [
                    'topic' => 'test',
                    'value' => 'message--',
                    'key'   => 'key--',
                ],
            ]);

            var_dump($result);
            var_dump('ok');
        });
    }
}
```


### consumer
```php
namespace App\Consumer;

use EasySwoole\Component\Process\AbstractProcess;
use EasySwoole\Kafka\Config\ConsumerConfig;
use EasySwoole\Kafka\kafka;

class Process extends AbstractProcess
{
    protected function run($arg)
    {
        go(function () {
            $config = new ConsumerConfig();
            $config->setRefreshIntervalMs(1000);
            $config->setMetadataBrokerList('127.0.0.1:9092,127.0.0.1:9093');
            $config->setBrokerVersion('0.9.0');
            $config->setGroupId('test');

            $config->setTopics(['test']);
            $config->setOffsetReset('earliest');

            $kafka = new kafka($config);
            // Set consumption callback
            $func = function ($topic, $partition, $message) {
                var_dump($topic);
                var_dump($partition);
                var_dump($message);
            };
            $kafka->consumer()->subscribe($func);
        });
    }
}

```

### Bonus
1. Kafka cluster deployment docker-compose.yml one, use as follows
    1. Ensure that the ports 2181, 9092, 9093, and 9000 are not occupied (you can modify the port number in the compose file after occupying)
    2. Under the root directory, docker-compose up -d
    3. Visit localhost:9000 to view the kafka cluster status.
    
### any Question
Kafka use questions and bugs, welcome to questions or feedback in the kaka group of Easyswoole
QQ group number: 827432930
