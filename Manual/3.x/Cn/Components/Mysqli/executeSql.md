## 执行原始语句
通过rawQuery可执行原始语句:
````php
<?php
$data = MysqlPool::invoke(function (MysqlObject $db) {
            $result = $db->rawQuery('
                 CREATE TABLE `member` (
                   `member_id` int(11) NOT NULL AUTO_INCREMENT,
                   `mobile` varchar(255) DEFAULT NULL,
                   `name` varchar(255) DEFAULT NULL,
                   `password` varchar(255) DEFAULT NULL,
                   PRIMARY KEY (`member_id`)
                 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ');
        });
````
可通过参数绑定方式传值:
````php
<?php
 $data = MysqlPool::invoke(function (MysqlObject $db) {
            $result = $db->rawQuery('
                select * from member where member_id=? and member_id=? and member_id =?;
            ',['1','2','3']);
            var_dump($db->getLastQuery());
        });
````
将生成语句:
````sql
select * from member where member_id='1' and member_id='2' and member_id ='3';
````
