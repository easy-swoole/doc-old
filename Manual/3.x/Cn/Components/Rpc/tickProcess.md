# 定时器进程
具体代码请查看 TickProcess.php
````php
<?php
namespace EasySwoole\Rpc;
use EasySwoole\Component\Openssl;
use EasySwoole\Component\Process\AbstractProcess;
use Swoole\Coroutine\Client;
use Swoole\Coroutine\Socket;

class TickProcess extends AbstractProcess
{
    //创建自定义进程回调
    public function run($arg)
    {
        /** @var Config $config */
        $config = $arg['config'];          //rpc config配置
        $serviceList = $arg['serviceList'];//本节点的所有服务列表
        $this->addTick(3 * 1000, function () use ($config, $serviceList) {
            //每3秒刷新本节点各个服务的心跳时间
            /** @var AbstractService $service */
            foreach ($serviceList as $service) {//遍历本节点的服务列表
                try {
                    $node = new ServiceNode();
                    $node->setServiceVersion($service->version());
                    $node->setServiceName($service->serviceName());
                    $node->setServerIp($config->getServerIp());
                    $node->setServerPort($config->getListenPort());
                    $node->setLastHeartBeat(time());
                    $node->setNodeId($config->getNodeId());
                    $config->getNodeManager()->serviceNodeHeartBeat($node);
                } catch (\Throwable $throwable) {
                    $this->onException($throwable);
                }
                try {
                    $service->onTick($config);//定时清理节点其他的操作
                } catch (\Throwable $throwable) {
                    $this->onException($throwable);
                }
            }
        });
        //对外广播,ps:redis 节点管理器可以不启用
        if ($config->getBroadcastConfig()->isEnableBroadcast()) {
            $this->addTick($config->getBroadcastConfig()->getInterval() * 1000, function () use ($config, $serviceList) {
                $this->udpBroadcast($config, $serviceList, BroadcastCommand::COMMAND_HEART_BEAT);
            });
        }
        //监听广播,ps:redis 节点管理器可以不启用
        if ($config->getBroadcastConfig()->isEnableListen()) {
            go(function () use ($config) {
                $openssl = null;
                $secretKey = $config->getBroadcastConfig()->getSecretKey();
                if (!empty($secretKey)) {
                    $openssl = new Openssl($secretKey);
                }
                $socketServer = new Socket(AF_INET, SOCK_DGRAM);//创建socket监听
                $socketServer->bind($config->getBroadcastConfig()->getListenAddress(), $config->getBroadcastConfig()->getListenPort());
                while (1) {
                    $peer = null;
                    $data = $socketServer->recvfrom($peer);
                    if (empty($data)) {
                        continue;
                    }
                    if ($openssl) {
                        $data = $openssl->decrypt($data);
                    }
                    $data = unserialize($data);
                    if ($data instanceof BroadcastCommand) {
                        $node = $data->getServiceNode();
                        if ($data->getCommand() == $data::COMMAND_HEART_BEAT) {     //收到心跳命令。删除节点
                            if ($node->getNodeId() != $config->getNodeId()) {//过滤本节点
                                $config->getNodeManager()->serviceNodeHeartBeat($node);
                            }
                        } else if ($data->getCommand() == $data::COMMAND_OFF_LINE) {//收到下线命令，删除节点
                            $config->getNodeManager()->deleteServiceNode($node);
                        }
                    }
                }
            });
        }
    }

    //进程关闭时回调
    protected function onShutDown()
    {
        /** @var Config $config */
        $config = $this->getConfig()->getArg()['config'];
        $serviceList = $this->getConfig()->getArg()['serviceList'];
        $this->udpBroadcast($config, $serviceList, BroadcastCommand::COMMAND_OFF_LINE);//执行广播下线命令操作
    }

    //udp广播
    protected function udpBroadcast(Config $config, array $serviceList, int $command)
    {
        $openssl = null;
        $secretKey = $config->getBroadcastConfig()->getSecretKey();
        if (!empty($secretKey)) {
            $openssl = new Openssl($secretKey);
        }
        $client = new Client(SWOOLE_UDP);
        //创建节点信息
        $node = new ServiceNode();
        $node->setServerPort($config->getListenPort());
        $node->setServerIp($config->getServerIp());
        $node->setNodeId($config->getNodeId());
        $node->setLastHeartBeat(time());
        //构建命令
        $broadcastCommand = new BroadcastCommand();
        $broadcastCommand->setCommand($command);
        $broadcastCommand->setServiceNode($node);
        /**
         * @var  $serviceName
         * @var AbstractService $service
         */
        foreach ($serviceList as $serviceName => $service) {
            $node->setServiceName($serviceName);
            $node->setServiceVersion($service->version());
            $data = serialize($broadcastCommand);
            if ($openssl) {
                $data = $openssl->encrypt($data);
            }
            //遍历广播地址发送
            foreach ($config->getBroadcastConfig()->getBroadcastAddress() as $address) {
                $address = explode(':', $address);
                $client->sendto($address[0], $address[1], $data);
            }
        }
        $client->close();
        unset($client);
    }

    protected function onException(\Throwable $throwable, ...$args)
    {
        /** @var Config $config */
        $config = $this->getConfig()->getArg()['config'];
        if ($config->getTrigger()) {
            $config->getTrigger()->throwable($throwable);
        } else {
            throw $throwable;
        }
    }
}