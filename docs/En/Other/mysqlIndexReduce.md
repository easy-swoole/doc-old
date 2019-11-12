---
title: Mysql index dimension reduction
meta:
  - name: description
    content: easyswoole,Mysql index dimension reduction
  - name: keywords
    content: easyswoole|Mysql index dimension reduction
---
## Mysql index dimension reduction
Many people know that mysql has the concept of indexing, but it rarely goes to the truth. How to use indexes to reduce the dimension of data to improve the query speed.

A common scenario is the user log (order), for example, in China Mobile's call recording system, which needs to be recorded.
The phone number, the called number and the outgoing time are called out, and in the system, the most common or used most demand is to query the call history of a certain user within a certain period of time. We made the following data feature simulation:

- Within a month, there are 10,000 accounts, and 30,000 call records are made every day.

Data simulation generated code:
```php
<?php

require 'vendor/autoload.php';

\EasySwoole\EasySwoole\Core::getInstance()->initialize();

function generatePhoneList()
{
    $list = [];
    for ($i=0;$i <= 10000; $i++){
        array_push($list,'155'.\EasySwoole\Utility\Random::number(8));
    }
    return $list;
}

function generateTimeList(int $startTime,$max = 30000)
{
    $list = [];
    for ($i=0;$i<=$max;$i++){
        //Simulation from 7 am to early morning
        $t = mt_rand(
            25200,86400
        );
        array_push($list,$startTime+$t);
    }
    sort($list);
    return $list;
}

$config = \EasySwoole\EasySwoole\Config::getInstance()->getConf('MYSQL');
$db = new \App\Utility\Pools\MysqlPoolObject($config);
$phoneList = generatePhoneList();
//Simulate one month's time data
$start = strtotime('20180101');
//
for ($i = 0; $i<=30; $i++){
    $timeList = generateTimeList($start);
    foreach ($timeList as $time){
        $phone = $phoneList[mt_rand(0,10000)];
        $target = $phoneList[mt_rand(0,10000)];
        $db->insert('user_phone_record',[
            'phone'=>$phone,
            'targetPhone'=>$target,
            'callTime'=>$time
        ]);

    }
    $start += 86400;
}
```
::: warning 
In this explanation, taking the data volume of 500,000 as an example, I am too lazy to wait for data generation. Phone, callTime is the index field.
:::



## Demand
Query all call records for an account within a certain period of time.
So at this moment, many people may write directly:
```
SELECT * FROM test.user_phone_record where callTime >=  1514768050 and  callTime <= 1514871213 and  phone = 15587575857;
```
The above statement executed 0.26s in my test machine, but if I adjust the order of where:
```
SELECT * FROM test.user_phone_record where phone = 15587575857 and callTime >=  1514768050 and  callTime <= 1514871213 ;
```
It only takes 0.1s for a long time, saving half the time. Then these two seemingly similar statements are not the same for the execution time.

## Intuitive interpretation

First, we execute two sql and view the results separately (don't say why not explain and explain), just want to give you the most intuitive explanation.

::: warning 
```
 SELECT count(*) FROM test.user_phone_record where phone = 15587575857 
```
The result was 15 records.
```
SELECT count(*) FROM test.user_phone_record where callTime >=  1514768050 and  callTime <= 1514871213 
```
The result was 76,491 records.
:::


Then the most intuitive explanation comes: first where callTime and then where phone, then what mysql does is:
First find 76,491 records, and then find the record with an account of 15587575857 from 76,491 records. In the same way, the first where phone, and then the screening time, is definitely faster.


## Why is this happening?
This is the same as the specific data structure and scene can be tuned by the preconditions:

- Within one month, there are 10,000 accounts, and 30,000 call records are made every day.

It can be seen that the frequency of a single user's call is not high. Therefore, the search method of locating the phone index set and then excluding the time is definitely more efficient than setting the account at a predetermined time.

::: warning 
Note that this is a specific scene! ! ! Specifically, please use explain and profiling to analyze, MYSQL execution interpreter, not so simple.
:::

