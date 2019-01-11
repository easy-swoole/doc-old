# 爬虫案例（京东苹果手机为例子）

> 参考Demo: [京东苹果手机爬取](https://github.com/HeKunTong/easyswoole3_demo)

## 清空队列数据

```php
// 清空数据
$conf = Config::getInstance()->getConf('REDIS');
$redis = new \Redis();
$redis->connect($conf['host'], $conf['port']);
if (!empty($conf['auth'])) {
    $redis->auth($conf['auth']);
}
$redis->del(Queue::$queue);
```

## 开启协程式任务采集任务

```php
\Co::create(function (){
    $redis = PoolManager::getInstance()->getPool(RedisPool::class)->getObj();
    if ($redis) {
//      $jd = new Jd($redis);     // curl模式
//      $jd->run();
        $client = new JdClient($redis);     // 协程客户端
        $client->run();
    } else {
        echo 'redis pool is empty'.PHP_EOL;
    }
});
```

## 采集京东苹果手机任务

curl模式:

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-10-10
 * Time: 下午1:49
 */

namespace App\Task;


use App\Queue\Queue;
use EasySwoole\Curl\Request;

class Jd
{

    public function run()
    {
        // TODO: Implement run() method.
        $url = 'https://list.jd.com/list.html';
        $params = [
            'cat' => '9987,653,655',
            'ev' => 'exbrand_14026',
            'sort' => 'sort_rank_asc',
            'trans' => 1,
            'JL' => '3_品牌_Apple'
        ];
        $url = $url.'?'.http_build_query($params);
        echo $url.PHP_EOL;
        $request = new Request($url);
        $request->setUserOpt([CURLOPT_REFERER => 'https://list.jd.com/list.html?cat=9987,653,655']);
        $body = $request->exec()->getBody();
        $html = new \simple_html_dom();
        $html->load($body);
        $curr = $html->find('.p-num a.curr', 0);
        $skip = $html->find('.p-skip b', 0);
        if (!empty($curr) && !empty($skip)) {
            $currentPage = 'https://list.jd.com'.$curr->href;
            $total = intval($skip->plaintext);
            $i = 2;
            echo $currentPage.PHP_EOL;
            $queue = new Queue();
            $queue->lPush($currentPage);
            while($i <= $total) {
                $page = str_replace('page=1', "page=$i", $currentPage);
                echo $page.PHP_EOL;
                $queue->lPush($page);
                $i++;
            }
        }
    }
}
```

协程客户端模式:

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-11
 * Time: 上午11:17
 */

namespace App\Task;


use App\Queue\Queue;
use App\Utility\Pool\RedisObject;
use EasySwoole\HttpClient\HttpClient;

class JdClient
{
    private $redis;

    function __construct(RedisObject $redis)
    {
        $this->redis = $redis;
    }

    public function run()
    {
        // TODO: Implement run() method.
        $url = 'https://list.jd.com/list.html';
        $params = [
            'cat' => '9987,653,655',
            'ev' => 'exbrand_14026',
            'sort' => 'sort_rank_asc',
            'trans' => 1,
            'JL' => '3_品牌_Apple'
        ];
        $url = $url.'?'.http_build_query($params);
        echo $url.PHP_EOL;
        $client = new HttpClient();
        $client->setUrl($url);
        $client->setTimeout(3);
        $client->setHeader('Referer', 'https://list.jd.com/list.html?cat=9987,653,655');
        $body = $client->exec()->getBody();
        $html = new \simple_html_dom();
        $html->load($body);
        $curr = $html->find('.p-num a.curr', 0);
        $skip = $html->find('.p-skip b', 0);
        if (!empty($curr) && !empty($skip)) {
            $currentPage = 'https://list.jd.com'.$curr->href;
            $total = intval($skip->plaintext);
            $i = 2;
            echo $currentPage.PHP_EOL;
            $queue = new Queue($this->redis);
            $queue->lPush($currentPage);
            while($i <= $total) {
                $page = str_replace('page=1', "page=$i", $currentPage);
                echo $page.PHP_EOL;
                $queue->lPush($page);
                $i++;
            }
        }
    }
}
```


## 开启两个协程任务,处理采集任务

```php
// 定时任务
$timer = Timer::getInstance()->loop(1 * 1000, function () use (&$timer) {
    \Co::create(function () use (&$timer){
        $db = PoolManager::getInstance()->getPool(MysqlPool::class)->getObj();
        $redis = PoolManager::getInstance()->getPool(RedisPool::class)->getObj();
        if ($db && $redis) {
            $queue = new Queue($redis);
            // $goodTask = new JdGood($db);        // curl模式
            $goodTask = new JdGoodClient($db);        // 协程客户端
            $task = $queue->rPop();
            if($task) {
                echo 'task-----'.$task.PHP_EOL;
                $goodTask->handle($task);
            } else {
                if ($timer) {
                    Timer::getInstance()->clear($timer);
                }
                echo 'end-----'.PHP_EOL;
            }
            PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
            PoolManager::getInstance()->getPool(RedisPool::class)->recycleObj($redis);
        } else {
            if ($redis) {
                echo 'mysql pool is empty'.PHP_EOL;
                PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
            } else {
                echo 'redis pool is empty'.PHP_EOL;
                PoolManager::getInstance()->getPool(RedisPool::class)->recycleObj($redis);
            }
        }
    });
});
```

## 采集任务处理逻辑

curl模式:

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-10-10
 * Time: 下午3:33
 */

namespace App\Task;


use App\Model\Jd\JdBean;
use App\Model\Jd\JdModel;
use App\Utility\Pool\MysqlPool;
use EasySwoole\Component\Pool\PoolManager;
use EasySwoole\Curl\Request;

class JdGood
{
    protected $db;

    function __construct()
    {
        $db = PoolManager::getInstance()->getPool(MysqlPool::class)->getObj();
        if ($db) {
            $this->db = $db;
        } else {
            throw new \Exception('mysql pool is empty');
        }
    }

    function handle($url)
    {
        $request = new Request($url);
        $body = $request->exec()->getBody();
        $html = new \simple_html_dom();
        $html->load($body);
        $list = $html->find('ul.gl-warp', 0);
        $len = count($list->find('.gl-item'));
        $skus = [];
        for ($i = 0; $i < $len; $i++) {
            $item = $list->find('.gl-item', $i);
            $sku = $item->find('.j-sku-item', 0)->getAttribute('data-sku');
            $skus[] = 'J_'.$sku;
            $name = trim($item->find('.p-name em', 0)->plaintext);
            $shop = $item->find('.p-shop', 0)->getAttribute('data-shop_name');
            $data = [
                'name' => $name,
                'shop' => $shop,
                'sku' => $sku,
            ];
            $bean = new JdBean($data);
            $model = new JdModel($this->db);
            $model->insert($bean);
        }
        $this->getPrice($skus);
    }

    private function getPrice($skus)
    {
        $url = 'https://p.3.cn/prices/mgets';
        $params = [
            'skuIds' => implode(',', $skus)
        ];
        $url = $url.'?'.http_build_query($params);
        $request = new Request($url);

        $result = json_decode($request->exec()->getBody(), true);

        foreach ($result as $item) {
            $sku = substr($item['id'], 2);
            $price = floatval($item['p']) * 100;
            $bean = new JdBean();
            $bean->setSku($sku);
            $model = new JdModel($this->db);
            $model->update($bean, $price);
        }
    }

    function __destruct()
    {
        // TODO: Implement __destruct() method.
        PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($this->db);
    }
}    
``` 

协程客户端:

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-11
 * Time: 上午11:45
 */

namespace App\Task;


use App\Model\Jd\JdBean;
use App\Model\Jd\JdModel;
use App\Utility\Pool\MysqlPoolObject;
use EasySwoole\HttpClient\HttpClient;

class JdGoodClient
{
    protected $db;

    function __construct(MysqlPoolObject $db)
    {
        $this->db = $db;
    }

    function handle($url)
    {
        $client = new HttpClient();
        $client->setUrl($url);
        $client->setTimeout(3);
        $body = $client->exec()->getBody();
        $html = new \simple_html_dom();
        $html->load($body);
        $list = $html->find('ul.gl-warp', 0);
        $len = count($list->find('.gl-item'));
        $skus = [];
        for ($i = 0; $i < $len; $i++) {
            $item = $list->find('.gl-item', $i);
            $sku = $item->find('.j-sku-item', 0)->getAttribute('data-sku');
            $skus[] = 'J_'.$sku;
            $name = trim($item->find('.p-name em', 0)->plaintext);
            $shop = $item->find('.p-shop', 0)->getAttribute('data-shop_name');
            $data = [
                'name' => $name,
                'shop' => $shop,
                'sku' => $sku,
            ];
            $bean = new JdBean($data);
            $model = new JdModel($this->db);
            $model->insert($bean);
        }
        $this->getPrice($skus);
    }

    private function getPrice($skus)
    {
        $url = 'https://p.3.cn/prices/mgets';
        $params = [
            'skuIds' => implode(',', $skus)
        ];
        $url = $url.'?'.http_build_query($params);

        $client = new HttpClient();
        $client->setUrl($url);
        $client->setTimeout(3);
        $body = $client->exec()->getBody();
        $result = json_decode($body, true);

        foreach ($result as $item) {
            $sku = substr($item['id'], 2);
            $price = floatval($item['p']) * 100;
            $bean = new JdBean();
            $bean->setSku($sku);
            $model = new JdModel($this->db);
            $model->update($bean, $price);
        }
    }
}
```

采集任务分两步。

1. 采集手机名，sku以及店铺
2. 采集手机价格

## 数据表结构

```sql
CREATE TABLE `jd` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sku` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `shop` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=806 DEFAULT CHARSET=utf8mb4;
```