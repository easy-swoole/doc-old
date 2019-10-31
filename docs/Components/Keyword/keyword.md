---
title: 关键词检测
meta:
  - name: description
    content: Easyswoole提供了一个基于字典树算法的关键词检测组件
  - name: keywords
    content: easyswoole,关键词,关键词检测
---

# 关键词检测服务-Keyword

`感谢Easyswoole开发组的其它小伙伴的耐心指导和AbelZhou开源的字典树供我学习`

Keyword组件底层围绕字典树并基于UnixSock通讯和自定义进程实现的关键词检测服务，开发本组件的目的是帮小伙伴们快速部署关键词检测服务，尤其是对于内容型产品尤为重要。

::: warning 
 此组件稳定后，会尝试使用AC自动机或其它检测方式，提供底层可配置化检测服务
:::

## 安装

```
composer require easyswoole/keyword
```

## 准备词库

第一列为关键词，其它列当命中关键词时会相应返回

```
我@es@其它信息1@es@其它信息2
我是@es@其它信息1
我叫@es@其它信息1@es@其它信息2@es@其它信息3
```

## 代码示例

```php
<?php
namespace EasySwoole\EasySwoole;

use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;
use EasySwoole\Keyword\KeywordClient;
use EasySwoole\Keyword\KeywordServer;

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
        KeywordServer::getInstance()
                ->setMaxMem('1024M') // 每个进程最大内存
                ->setServerName('Easyswoole 关键词检测') // 服务名称
                ->setTempDir(EASYSWOOLE_TEMP_DIR) // temp地址
                ->setDefaultPath('xxx') // 默认路径
                ->setDefaultWordBank('xxx/xxx.txt') // 默认词库
                ->setExportPath('xxx') // 默认导出路径，没有则使用默认路径
                ->setImportPath('xx') // 默认导入路径，没有则使用默认路径
                ->setSeparator('@es@') // 关键词和其它信息分隔符
                ->attachToServer(ServerManager::getInstance()->getSwooleServer());
    }

    public static function onRequest(Request $request, Response $response): bool
    {
        // TODO: Implement onRequest() method.
        KeywordClient::getInstance()->append('我叫Easyswoole', []);
        KeywordClient::getInstance()->append('我叫Es', []);
        $res = KeywordClient::getInstance()->search('我叫Easyswoole');
        var_dump($res);
        return true;
    }

    public static function afterRequest(Request $request, Response $response): void
    {
        // TODO: Implement afterAction() method.
    }
}
```

## 命中结果

```
array(3) {
  ["16815254531798dc21ee979d1d9c6675"]=>
  array(3) {
    ["keyword"]=>
    string(3) "我"
    ["other"]=>
    array(2) {
      [0]=>
      string(13) "其它信息1"
      [1]=>
      string(13) "其它信息2"
    }
    ["count"]=>
    int(1)
  }
  ["77e4a7023ca547689990f2aa4c81f33b"]=>
  array(3) {
    ["keyword"]=>
    string(6) "我叫"
    ["other"]=>
    array(3) {
      [0]=>
      string(13) "其它信息1"
      [1]=>
      string(13) "其它信息2"
      [2]=>
      string(13) "其它信息3"
    }
    ["count"]=>
    int(1)
  }
  ["1695a633cf1782cab389ab3bf3fcb1a0"]=>
  array(3) {
    ["keyword"]=>
    string(16) "我叫Easyswoole"
    ["other"]=>
    array(1) {
      [0]=>
      string(12) "附加信息"
    }
    ["count"]=>
    int(1)
  }
}
```
::: warning 
 keyword:命中的关键词，other：为关键词其它信息，count：检测文本中的命中次数
:::

## 支持的方法

### KeywordServer

设置临时目录
```
public function setTempDir(string $tempDir): KeywordServer
```

设置进程数量，默认3
```
public function setProcessNum(int $num): KeywordServer
```

设置每个进程最多所占内存大小
```
public function setMaxMem(string $maxMem='512M')
```

设置UnixSocket的Backlog队列长度
```
public function setBacklog(?int $backlog = null)
```

设置服务名称
```
public function setServerName(string $serverName): KeywordServer
```

默认加载的词库
```
public function setDefaultWordBank(string $defaultWordBank): KeywordServer
```

绑定到当前主服务
```
function attachToServer(swoole_server $server)
```

关键词和其它信息的分隔符
```
public function setSeparator(string $separator): KeywordServer
```

关键词默认路径，导入导出时如果没有指定路径则使用此路径
```
public function setDefaultPath(string $path): KeywordServer
```

导出路径
```
public function setExportPath(string $exportPath): KeywordServer
```

导入路径
```
public function setImportPath(string $importPath): KeywordServer
```

### KeywordClient

向字典树中添加关键词
```
public function append($keyword, array $otherInfo=[], float $timeout = 1.0)
```
::: warning 
添加一次各进程间会自动同步
:::

向字典树中移除关键词
```
public function remove($keyword, float $timeout = 1.0)
```
::: warning 
添加一次各进程间会自动同步
:::

搜索关键词
```
public function search($keyword, float $timeout = 1.0)
```

导入词库
```
public function import($fileName, $separator='@es@', $isCover=false, float $timeout=1.0)
```

导出词库
```
public function export($fileName, $separator='@es@', float $timeout=1.0)
```
