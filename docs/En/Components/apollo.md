---
title: Apollo configuration center
meta:
  - name: description
    content: EasySwoole Apollo configuration center
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|apollo
---
# Apollo configuration center
EasySwoole supports apollo data center. Synchronization can be configured according to this component.
# apollo

## Installation

```
composer require easyswoole/apollo
```

## Use

```php
go(function (){
    //Configure apollo server information
    $server = new \EasySwoole\Apollo\Server([
        'server'=>'http://106.12.25.204:8080',
        'appId'=>'easyswoole'
    ]);
    //Create an apollo client
    $apollo = new \EasySwoole\Apollo\Apollo($server);
    //First sync
    var_dump( $apollo->sync('mysql'));
    //The second synchronization, if the server has not changed, then the result returned, isModify marked as fasle, with lastReleaseKey
    var_dump( $apollo->sync('mysql'));
});
```


::: warning 
 Can start a timer in the process to achieve automatic timing update
:::

