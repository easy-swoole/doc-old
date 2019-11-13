---
title: DDL
meta:
  - name: description
    content: 数据库模式定义语言DDL(Data Definition Language)，是用于描述数据库中要存储的现实世界实体的语言。Easyswoole提供了一个DDL库，方便用户用于定义一个数据库表结构。
  - name: keywords
    content: easyswoole|DDL|数据库语句生成|sql DDL
---

# DDL
数据库模式定义语言DDL(Data Definition Language)，是用于描述数据库中要存储的现实世界实体的语言。Easyswoole提供了一个DDL库，方便用户用于定义一个数据库表结构。
## Installation
```
composer require easyswoole/ddl
```
## 测试代码

```php
use EasySwoole\DDL\Blueprint\Table;
use EasySwoole\DDL\DDLBuilder;
use EasySwoole\DDL\Enum\Character;
use EasySwoole\DDL\Enum\Engine;

$sql = DDLBuilder::table('user', function (Table $table) {

    $table->setTableComment('用户表')//设置表名称/
    ->setTableEngine(Engine::MYISAM)//设置表引擎
    ->setTableCharset(Character::UTF8MB4_GENERAL_CI);//设置表字符集
    $table->colInt('user_id', 10)->setColumnComment('用户ID')->setIsAutoIncrement()->setIsPrimaryKey();
    $table->colVarChar('username')->setColumnLimit(30)->setIsNotNull()->setColumnComment('用户名');
    $table->colChar('sex', 1)->setIsNotNull()->setDefaultValue(1)->setColumnComment('性别：1男，2女');
    $table->colTinyInt('age')->setIsUnsigned()->setColumnComment('年龄')->setIsNotNull();
    $table->colInt('created_at', 10)->setIsNotNull()->setColumnComment('创建时间');
    $table->colInt('updated_at', 10)->setIsNotNull()->setColumnComment('更新时间');
    $table->indexUnique('username_index', 'username');//设置索引
});
echo $sql;

//结果如下


CREATE TABLE `user` (
  `user_id` int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(30) NOT NULL COMMENT '用户名',
  `sex` char(1) NOT NULL COMMENT '性别：1男，2女',
  `age` tinyint UNSIGNED NOT NULL COMMENT '年龄',
  `created_at` int(10) NOT NULL COMMENT '创建时间',
  `updated_at` int(10) NOT NULL COMMENT '更新时间',
  UNIQUE INDEX `username_index` (`username`)
)
ENGINE = MYISAM DEFAULT COLLATE = 'utf8mb4_general_ci' COMMENT = '用户表';

```
