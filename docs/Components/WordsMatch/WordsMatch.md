---
title: 文本检测
meta:
  - name: description
    content: Easyswoole提供了一个基于字典树算法的内容检测组件
  - name: keywords
    content: easyswoole,敏感词,敏感词检测
---

# 文本检测(words-match)

`感谢Easyswoole开发组的其它小伙伴的耐心指导和AbelZhou开源的字典树供我学习`

words-match组件是基于字典树(DFA)并利用UnixSock通讯和自定义进程实现，开发本组件的目的是帮小伙伴们快速部署敏感词检测服务，这对于内容型产品来说非常重要。

::: warning 
 此组件稳定后，会尝试使用AC自动机或其它检测方式，提供底层可配置化检测服务
:::

## 使用场景

博客:评论、文章

即时通讯: 聊天室中的消息

只要和文本内容相关的都有应用场景

## 安装

```
composer require easyswoole/words-match
```

## 准备词库

服务启动的时候会一行一行将数据读出来，每一行的第一列为敏感词，其它列为附属信息

```
php,是世界上,最好的语言
java
golang
程序员
代码
逻辑
```
::: warning 
 注意!!!!!! 服务启动时可以用setDefaultWordBank 方法指定默认加载的词库。
:::

## 代码示例

```php
<?php
namespace EasySwoole\EasySwoole;

use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;
use EasySwoole\WordsMatch\WordsMatchClient;
use EasySwoole\WordsMatch\WordsMatchServer;

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
        WordsMatchServer::getInstance()
                ->setMaxMem('1024M') // 每个进程最大内存
                ->setProcessNum(5) // 设置进程数量
                ->setServerName('Easyswoole words-match')// 服务名称
                ->setTempDir(EASYSWOOLE_TEMP_DIR)// temp地址
                ->setWordsMatchPath(EASYSWOOLE_ROOT.'/WordsMatch/')
                ->setDefaultWordBank('comment.txt')// 服务启动时默认导入的词库文件路径
                ->setSeparator(',')// 词和其它信息分隔符
                ->attachToServer(ServerManager::getInstance()->getSwooleServer());
    }

    public static function onRequest(Request $request, Response $response): bool
    {
        // TODO: Implement onRequest() method.
        $res = WordsMatchClient::getInstance()->search('php是世界上最好的语言，其它类型的程序员不认可php的这句话，比如java、golang。');
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
array(4) {
  ["e1bfd762321e409cee4ac0b6e841963c"]=>
  array(3) {
    ["word"]=>
    string(3) "php"
    ["other"]=>
    array(2) {
      [0]=>
      string(12) "是世界上"
      [1]=>
      string(15) "最好的语言"
    }
    ["count"]=>
    int(2)
  }
  ["72d9adf4944f23e5efde37f6364c126f"]=>
  array(3) {
    ["word"]=>
    string(9) "程序员"
    ["other"]=>
    array(0) {
    }
    ["count"]=>
    int(1)
  }
  ["93f725a07423fe1c889f448b33d21f46"]=>
  array(3) {
    ["word"]=>
    string(4) "java"
    ["other"]=>
    array(0) {
    }
    ["count"]=>
    int(1)
  }
  ["21cc28409729565fc1a4d2dd92db269f"]=>
  array(3) {
    ["word"]=>
    string(6) "golang"
    ["other"]=>
    array(0) {
    }
    ["count"]=>
    int(1)
  }
}
```
::: warning 
 word:命中的敏感词，other：为其它信息，count：此敏感词在内容中命中的次数
:::

## 支持的方法

### WordsMatchServer

设置临时目录
```
public function setTempDir(string $tempDir): WordsMatchServer
```

设置进程数量，默认3
```
public function setProcessNum(int $num): WordsMatchServer
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
public function setServerName(string $serverName): WordsMatchServer
```

服务启动时默认加载的词库
```
public function setDefaultWordBank(string $defaultWordBank): WordsMatchServer
```

绑定到当前主服务
```
function attachToServer(swoole_server $server)
```

敏感词和其它信息的分隔符
```
public function setSeparator(string $separator): WordsMatchServer
```

组件根路径
```
public function setWordsMatchPath(string $path): WordsMatchServer
```

### WordsMatchClient

添加敏感词
```
public function append($word, array $otherInfo=[], float $timeout = 1.0)
```

移除敏感词
```
public function remove($word, float $timeout = 1.0)
```

检测内容

`第二个参数默认无过滤，如果下面三种方式满足不了需求，可自行过滤。`

`Package::FILTER_CEN`(只保留中文、英文、数字)

`Package::FILTER_C`(只保留中文)

`Package::FILTER_EMOJI`(过滤掉表情)

```
public function search(string $word, int $type, float $timeout=1.0);
```

导入词库，此方法可以将新词库追加到正在运行的字典树中也可以覆盖字典树，这样就可以做到实时的词库切换
```
public function import($fileName, $separator=',', $isCover=false, float $timeout=1.0)
```

导出词库，此方法可以将字典树正在运行中的敏感词落地到文件中
```
public function export($fileName, $separator=',', float $timeout=1.0)
```
