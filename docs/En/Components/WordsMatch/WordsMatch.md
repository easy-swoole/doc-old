---
title: Text detection
meta:
  - name: description
    content: Easyswoole provides a content detection component based on dictionary tree algorithm
  - name: keywords
    content: easyswoole,Sensitive word,Sensitive word detection
---

# Text detection(words-match)

`Thanks to the patient guidance of the other partners of the Easyswoole development team and the AbelZhou open source dictionary tree for me to learn.

The words-match component is based on the dictionary tree (DFA) and is implemented using UnixSock communication and custom processes. The purpose of developing this component is to help small partners quickly deploy sensitive word detection services, which is very important for content products.

::: warning
  After the component is stable, it will try to use the AC automaton or other detection methods to provide the underlying configurable detection service.
:::

## scenes to be used

Blog: comments, articles

Instant messaging: Messages in chat rooms

As long as there is an application scenario related to the text content

## Installation

```
Composer require easyswoole/words-match
```

## Preparing the thesaurus

When the service starts, the data will be read out line by line. The first column of each line is sensitive words, and the others are listed as subsidiary information.

```
Php, the best language in the world
Java
Golang
programmer
Code
logic
```
::: warning
  Note!!!!!! You can use the setDefaultWordBank method to specify the default loaded thesaurus when the service starts.
:::

## Code Example

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
                ->setMaxMem('1024M') // Maximum memory per process
                ->setProcessNum(5) // Set the number of processes
                ->setServerName('Easyswoole words-match')// service name
                ->setTempDir(EASYSWOOLE_TEMP_DIR)// Temp address
                ->setWordsMatchPath(EASYSWOOLE_ROOT.'/WordsMatch/')
                ->setDefaultWordBank('comment.txt')// The lexicon file path imported by default when the service starts
                ->setSeparator(',')// Word and other information separators
                ->attachToServer(ServerManager::getInstance()->getSwooleServer());
    }

    public static function onRequest(Request $request, Response $response): bool
    {
        // TODO: Implement onRequest() method.
        $res = WordsMatchClient::getInstance()->search('Php is the best language in the world, other types of programmers do not recognize the php sentence, such as java, golang.');
        var_dump($res);
        return true;
    }

    public static function afterRequest(Request $request, Response $response): void
    {
        // TODO: Implement afterAction() method.
    }
}
```

## Hit result

```php
array(4) {
  ["e1bfd762321e409cee4ac0b6e841963c"]=>
  array(3) {
    ["word"]=>
    string(3) "php"
    ["other"]=>
    array(2) {
      [0]=>
      string(12) "Is the world"
      [1]=>
      string(15) "Best language"
    }
    ["count"]=>
    int(2)
  }
  ["72d9adf4944f23e5efde37f6364c126f"]=>
  array(3) {
    ["word"]=>
    string(9) "programmer"
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
Word: the sensitive word of the hit, other: for other information, count: the number of times the sensitive word hits in the content
:::

## Supported methods

### WordsMatchServer

Set up a temporary directory
```
Public function setTempDir(string $tempDir): WordsMatchServer
```

Set the number of processes, default 3
```
Public function setProcessNum(int $num): WordsMatchServer
```

Set the maximum memory size per process
```
Public function setMaxMem(string $maxMem='512M')
```

Set the length of the UnixSocket Backlog queue
```
Public function setBacklog(?int $backlog = null)
```

Set the service name
```
Public function setServerName(string $serverName): WordsMatchServer
```

Thesaurus that is loaded by default when the service starts
```
public function setDefaultWordBank(string $defaultWordBank): WordsMatchServer
```

Bind to the current main service
```
Function attachToServer(swoole_server $server)
```

Separator of sensitive words and other information
```
Public function setSeparator(string $separator): WordsMatchServer
```

Component root path
```
Public function setWordsMatchPath(string $path): WordsMatchServer
```

### WordsMatchClient

Add sensitive words to the dictionary tree
```
Public function append($word, array $otherInfo=[], float $timeout = 1.0)
```
::: warning
Add once and automatically synchronize between processes
:::

Remove sensitive words from the dictionary tree
```
Public function remove($word, float $timeout = 1.0)
```
::: warning
Add once and automatically synchronize between processes
:::

Test content
```
Public function search($word, float $timeout = 1.0)
```

Import the thesaurus, this method can append the new thesaurus to the running dictionary tree or overwrite the dictionary tree, so that real-time thesaurus can be switched.
```
Public function import($fileName, $separator=',', $isCover=false, float $timeout=1.0)
```
::: warning
Processes are synchronized after importing the thesaurus
:::


Export the thesaurus, this method can put sensitive words in the dictionary tree running into the file
```
public function export($fileName, $separator=',', float $timeout=1.0)
```
