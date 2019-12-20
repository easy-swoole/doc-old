---
title: 快捷查询
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|快捷查询
---


# 快捷查询

依赖关系
- mysqli >=2.1.2
- ORM >= 1.2.5

查询单行指定字段值
- val(string $column)
- scalar(?string $column = null)

查询多行指定字段值
- column(?string $column = null)
- indexBy(string $column)

## 返回值说明
- `val` 当存在该行数据并字段存在时，返回该字段值。  
		字段不存在时，返回该行数据数组。  
        该行不存在时，返回`null`
		
- `scalar` 当符合条件数据存在时，返回首条数据字段值。  
		   当符合条件不存在时，返回空数组。  
		   当不传参数时，默认返回主键值。
		
- `column` 返回该字段值的数组。  
		   当参数不传时，默认返回主键数组。
		   
- `indexBy`返回以指定字段为Key的数据数组。

## 示例

```php

// val 直接返回某一行的某一列
$res = UserModel::create()->val('loginName');
var_dump($res);

// column 快速查询结果的某一列
$res = UserModel::create()->column('loginName');
var_dump($res);

// scalar 快速查询结果的某一列的第一条数据
$res = UserModel::create()->scalar('loginName');
var_dump($res);

// indexBy 以某个字段名的数据返回结果数组
$res = UserModel::create()->indexBy('loginName');
var_dump($res);

```
