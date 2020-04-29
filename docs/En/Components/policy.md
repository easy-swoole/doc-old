---
title: Policy
meta:
  - name: description
    content: Easyswoole Policy
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|Policy
---

# Policy

A policy is a class that organizes authorization logic in a specific model or resource to handle user authorization actions.

## Installation
```bash
composer require easyswoole/policy
```

## Instructions

```php

use EasySwoole\Policy\PolicyNode;
use EasySwoole\Policy\Policy;

//Authorized action
//PolicyNode::EFFECT_ALLOW      Allowed
//PolicyNode::EFFECT_DENY       Refused
//PolicyNode::EFFECT_UNKNOWN    Unknown


$policy = new Policy();
//Add node authorization   
$policy->addPath('/user/add',PolicyNode::EFFECT_ALLOW);
$policy->addPath('/user/update',PolicyNode::EFFECT_ALLOW);
$policy->addPath('/user/delete',PolicyNode::EFFECT_DENY);
$policy->addPath('/user/*',PolicyNode::EFFECT_DENY);

//Verify node permissions
var_dump($policy->check('user/asdasd'));//deny
var_dump($policy->check('user/add'));   //allow
var_dump($policy->check('user/update'));//allow

/*
 * Allow /api/*, but only reject /api/order/charge, /api/order/info, /api/sys/*
 */
 
$policy->addPath('/api/*',PolicyNode::EFFECT_ALLOW);
$policy->addPath('/api/order/charge',PolicyNode::EFFECT_DENY);
$policy->addPath('/api/order/info',PolicyNode::EFFECT_DENY);
$policy->addPath('/api/sys/*',PolicyNode::EFFECT_DENY);

var_dump($policy->check('/api/whatever'));
var_dump($policy->check('/api/order/charge'));
var_dump($policy->check('/api/order/info'));
var_dump($policy->check('/api/sys/whatever'));


//Object addition
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
