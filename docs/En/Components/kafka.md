# kafka
本项目代码参考自 https://github.com/weiboad/kafka-php

# 安装
```php
composer required easyswoole/kafka
```

### 注册kafka服务
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
        // 生产者
        ServerManager::getInstance()->getSwooleServer()->addProcess((new ProducerProcess())->getProcess());
        // 消费者
        ServerManager::getInstance()->getSwooleServer()->addProcess((new ConsumerProcess())->getProcess());
    }
    
    ......
    
}

```
### 生产者
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


### 消费者
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
            // 设置消费回调
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

### 附赠
1. Kafka 集群部署 docker-compose.yml 一份，使用方式如下
    1. 保证2181,9092,9093,9000端口未被占用（占用后可以修改compose文件中的端口号）
    2. 根目录下，docker-compose up -d
    3. 访问localhost:9000，可以查看kafka集群状态。
    
### Any Question
kafka使用问题及bug，欢迎到Easyswoole的kaka群中提问或反馈
QQ群号：827432930
