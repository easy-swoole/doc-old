## Execute the original statement
Execute the original statement through rawQuery:
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
Pass values through parameter binding:
````php
<?php
 $data = MysqlPool::invoke(function (MysqlObject $db) {
            $result = $db->rawQuery('
                select * from member where member_id=? and member_id=? and member_id =?;
            ',['1','2','3']);
            var_dump($db->getLastQuery());
        });
````
The statement will be generated:
````sql
select * from member where member_id='1' and member_id='2' and member_id ='3';
````
