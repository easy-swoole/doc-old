# apollo配置中心
EasySwoole实现了对apollo数据中心的支持.可根据该组件,进行同步配置
````text
composer require easyswoole/apollo-config
````
## 示例代码
````php
<?php
use EasySwoole\ApolloConfig\Server;
use EasySwoole\ApolloConfig\Apollo;

go(function (){
    $server = new Server([
        'server'=>'http://106.12.25.204:8080',
        'appId'=>'easyswoole',
        //        'cluster'=>'test'
    ]);

    $config = new Apollo();
    /*
     * 设置当前客户端所处的数据中心名字，可选
     */
    $config->getClient()->setDataCenter('testDataCenter');

    $config->setServer($server);
    /*
     * 配置需要同步的配置项namespace
     */
    $config->setNameSpace([
        'mysql'
    ]);
    /*
     * 进行配置项同步
     */
    $config->sync();

    var_dump($config->getConf('mysql'));
    var_dump($config->getConf('mysql.db'));
    var_dump($config->getReleaseKey('mysql'));

});
````

### 在EasySwoole中使用
以下是关于动态获取mysql配置,如果mysql配置有改动,则热重启框架的例子
````php
public static function mainServerCreate(EventRegister $register)
{
    $register->add(EventRegister::onWorkerStart, function (\swoole_server $server, $workerId) {
        if ($workerId == 0) {
        定时10秒一次,获取配置版本号是否相同
            \EasySwoole\Component\Timer::getInstance()->loop(1 * 1000, function () {
                $server = new Server([
                    'server' => 'http://106.12.25.204:8080',
                    'appId'  => 'easyswoole',
                ]);
                $config = new Apollo();
                if (Core::getInstance()->isDev()) {
                    $config->setNameSpace([
                        'mysql'
                    ]);
                } else {
                    $config->setNameSpace([
                        'application'
                    ]);
                }
                $config->setServer($server);
                $releaseKey = Config::getInstance()->getConf('releaseKey_mysql');
                $config->sync();
                //获得原先的config配置项,加载到新的配置项中
                Config::getInstance()->merge($config->getConf());
                $oldConfig = Config::getInstance()->getConf();
                Config::getInstance()->storageHandler($config)->load($oldConfig);
                //配置版本号不同,则重启框架
                if ($releaseKey!=null&&$releaseKey!=$config->getReleaseKey('mysql')){
                    (new Reload())->exec(['all',Core::getInstance()->isDev()?'dev':'produce']);
                    Logger::getInstance()->console('重启成功');
                }
            });
        }
    });

    // TODO: Implement mainServerCreate() method.
}
````

