<head>
     <title>EasySwoole Policy|EasySwoole 策略权限|swoole 策略权限|PHP策略权限</title>
     <meta name="keywords" content="EasySwoole Policy|EasySwoole 策略权限|swoole 策略权限|PHP策略权限"/>
     <meta name="description" content="EasySwoole Policy|EasySwoole 策略权限|swoole 策略权限|PHP策略权限"/>
</head>
---<head>---

# Policy

Policy（即策略）是在特定模型或者资源中组织授权逻辑的类，用来处理用户授权动作。

## 安装
```bash
composer require easyswoole/policy
```

## 使用方法

```php

use EasySwoole\Policy\PolicyNode;
use EasySwoole\Policy\Policy;

//授权动作
//PolicyNode::EFFECT_ALLOW   允许
//PolicyNode::EFFECT_DENY    拒绝
//PolicyNode::EFFECT_UNKNOWN 未知


$policy = new Policy();
//添加节点授权   
$policy->addPath('/user/add',PolicyNode::EFFECT_ALLOW);
$policy->addPath('/user/update',PolicyNode::EFFECT_ALLOW);
$policy->addPath('/user/delete',PolicyNode::EFFECT_DENY);
$policy->addPath('/user/*',PolicyNode::EFFECT_DENY);

//验证节点权限
var_dump($policy->check('user/asdasd'));//deny
var_dump($policy->check('user/add'));   //allow
var_dump($policy->check('user/update'));//allow

/*
 * 允许/api/*,但是唯独拒绝/api/order/charge,/api/order/info,/api/sys/*
 */
 
$policy->addPath('/api/*',PolicyNode::EFFECT_ALLOW);
$policy->addPath('/api/order/charge',PolicyNode::EFFECT_DENY);
$policy->addPath('/api/order/info',PolicyNode::EFFECT_DENY);
$policy->addPath('/api/sys/*',PolicyNode::EFFECT_DENY);

var_dump($policy->check('/api/whatever'));
var_dump($policy->check('/api/order/charge'));
var_dump($policy->check('/api/order/info'));
var_dump($policy->check('/api/sys/whatever'));


//对象添加
$root = new PolicyNode('*');
$userChild = $root->addChild('user');
$userAddChild = $userChild->addChild('add');
$userAddChild->addChild('aaaaaa')->setAllow(PolicyNode::EFFECT_ALLOW);
$userChild->addChild('update')->setAllow(PolicyNode::EFFECT_DENY);
$userChild->addChild('*')->setAllow(PolicyNode::EFFECT_ALLOW);

$apiChild = $root->addChild('charge');
$apiChild->addChild('*');

$node = $root->search('/user/add/aaaa');
if ($node) {
    var_dump($node->isAllow());
}

```