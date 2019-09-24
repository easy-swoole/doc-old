---
title: apollo配置中心
meta:
  - name: description
    content: EasySwoole apollo配置中心
  - name: keywords
    content: easyswoole,apollo
---
# apollo配置中心
EasySwoole实现了对apollo数据中心的支持.可根据该组件,进行同步配置
# apollo

## 安装

```
composer require easyswoole/apollo
```

## 使用

```php
go(function (){
    //配置apollo服务器信息
    $server = new \EasySwoole\Apollo\Server([
        'server'=>'http://106.12.25.204:8080',
        'appId'=>'easyswoole'
    ]);
    //创建apollo客户端
    $apollo = new \EasySwoole\Apollo\Apollo($server);
    //第一次同步
    var_dump( $apollo->sync('mysql'));
    //第二次同步，若服务端没有改变，那么返回的结果，isModify标记为fasle，并带有lastReleaseKey
    var_dump( $apollo->sync('mysql'));
});
```


:::danger 
 可以在进程中起一个定时器，实现自动定时更新
:::

