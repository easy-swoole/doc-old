# Apollo configuration center
EasySwoole implements support for Apollo data center. It can be configured synchronously according to this component.
# apollo

## Install

```
composer require easyswoole/apollo
```

## Use

```php
go(function (){
    //Configure Apollo server information
    $server = new \EasySwoole\Apollo\Server([
        'server'=>'http://106.12.25.204:8080',
        'appId'=>'easyswoole'
    ]);
    //Create Apollo client
    $apollo = new \EasySwoole\Apollo\Apollo($server);
    //First Synchronization
    var_dump( $apollo->sync('mysql'));
    //The second synchronization, if the server has not changed, returns a result marked isModify as fasle with lastReleaseKey
    var_dump( $apollo->sync('mysql'));
});
```

> You can start a timer in the process to achieve automatic timing updates

