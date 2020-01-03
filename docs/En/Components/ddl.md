---
title: DDL
meta:
  - name: description
    content: The Database Definition Language (DDL) is a language used to describe real-world entities to be stored in a database. Easyswoole provides a DDL library that is easy for users to define a database table structure.
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|DDL|database statement generation|sql DDL
---

# DDL
The Database Definition Language (DDL) is a language used to describe real-world entities to be stored in a database. Easyswoole provides a DDL library that is easy for users to define a database table structure.
## Installation
```
composer require easyswoole/ddl
```
## Test code

```php
use EasySwoole\DDL\Blueprint\Table;
use EasySwoole\DDL\DDLBuilder;
use EasySwoole\DDL\Enum\Character;
use EasySwoole\DDL\Enum\Engine;

$sql = DDLBuilder::table('user', function (Table $table) {

    $table->setTableComment('User table')//Set the table name/
    ->setTableEngine(Engine::MYISAM)//Setting the table engine
    ->setTableCharset(Character::UTF8MB4_GENERAL_CI);//Set table character set
    $table->colInt('user_id', 10)->setColumnComment('User ID')->setIsAutoIncrement()->setIsPrimaryKey();
    $table->colVarChar('username')->setColumnLimit(30)->setIsNotNull()->setColumnComment('用户名');
    $table->colChar('sex', 1)->setIsNotNull()->setDefaultValue(1)->setColumnComment('Gender: 1 male, 2 female');
    $table->colTinyInt('age')->setIsUnsigned()->setColumnComment('age')->setIsNotNull();
    $table->colInt('created_at', 10)->setIsNotNull()->setColumnComment('Creation time');
    $table->colInt('updated_at', 10)->setIsNotNull()->setColumnComment('Update time');
    $table->indexUnique('username_index', 'username');//Setting index
});
echo $sql;

//Results are as follows


CREATE TABLE `user` (
  `user_id` int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(30) NOT NULL COMMENT 'username',
  `sex` char(1) NOT NULL COMMENT 'Gender: 1 male, 2 female',
  `age` tinyint UNSIGNED NOT NULL COMMENT 'age',
  `created_at` int(10) NOT NULL COMMENT 'Creation time',
  `updated_at` int(10) NOT NULL COMMENT 'Update time',
  UNIQUE INDEX `username_index` (`username`)
)
ENGINE = MYISAM DEFAULT COLLATE = 'utf8mb4_general_ci' COMMENT = 'user table';

```
