---
title: TP ORM usage problem
meta:
  - name: description
    content: Easyswoole, TP ORM usage problem
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|TP ORM usage problem
---
## TP ORM usage problem
Since the swoole is running in the resident memory + coroutine environment, when using the TP ORM, the TP ORM comes with a lot of static variables, and there will be problems. The specific analysis is as follows:

### Non-co-resident resident memory mode
In synchronous, non-co-schedu mode, a worker only processes one request in one time, and will restart the process when it reaches max_request. It can barely operate sql, but the following static variables will have problems:
#### Think\Db static variable:
```php
protected static $config = [];
//Database configuration, almost no impact

protected static $query;
//Query class name, no effect

protected static $queryMap = [
    'mongo' => '\\think\\db\Mongo',
];
//Query class automatic mapping, no effect

public static $queryTimes = 0;
//Database query count
//Resident memory is the number of global queries

public static $executeTimes = 0;
//Number of executions
//Resident memory is actually the number of global executions

protected static $cacheHandler;
//Cache object, no effect

```
#### Think\Model static variable:
```php
protected static $initialized = [];
//Initialized model.
//Original role: ensure that the init method in a model class is only executed once in a single request.
//Resident in memory: A model only executes this method on the first request, subsequent requests are no longer executed, and it is very likely to cause a bug.

protected static $readMaster;
//Whether to read data from the main library
//Almost no effect

```

#### Think\db\Connection static variable:
```php
protected static $instance = [];
//PDO operation example
//Established connection management instance
//Coroutine mode, high concurrency may cause database operation bugs

protected static $event = [];
//Listening callback
//Original role: event callback set for the model
//Resident memory: As the running time increases, the running memory will continue to increase, and the event of one request increase will affect another request.

protected static $info = [];
// Data sheet information
// Almost no effect

protected static $log = [];
// Database log
// Original role: Log all log operations for a request
// Resident memory: As the database continues to operate, this variable will continue to increase, causing memory overflow

```
#### Think\db\Query static variable:
```php
protected static $connections = [];
// Database Connection object
// Temporarily not found where to use

private static $event = [];
//Callback event
//Original role: set a callback event of its own under one request
//Resident in memory: an event that is added in one request will affect another request

private static $extend = [];
//Extended query method
//Almost no effect

private static $readMaster = [];
//Need to read the table of the main library
//Original role: set whether one or all models read data from the main library
//Resident memory: If a Query::readMaster() method is executed on a request, Query::$readMaster will not be released, which will affect other requests.

```
#### Think\Db\ModelEvent Static variable:
```php
private static $event = [];
// Callback event
//Original role: event callback set for the model
//Resident memory: As the running time increases, the running memory will continue to increase, and the event of one request increase will affect another request.

protected static $observe = ['before_write', 'after_write', 'before_insert', 'after_insert', 'before_update', 'after_update', 'before_delete', 'after_delete', 'before_restore', 'after_restore'];
//Model event observation
//No effect

```

### Coroutine resident memory mode
In the coroutine mode, multiple clients share a database connection, and database operation exceptions will occur.
E.g:
* User A accesses service A, database opens transaction -> payment logic -> complete transaction
* User B accesses service B at the same time and inserts n data.
* User C accesses service A at the same time, the database opens the transaction->payment logic->logic error, rollback

In this logic, since both are sharing a database operation and are affected by coroutine switching, the database execution steps may become:
User A database open transaction -> User B inserts n data -> User C opens transaction -> User A payment logic -> User C payment logic -> User C logic error, rollback transaction -> User A completes transaction
When the database is executed like this, all database operations of users A, B, and C will be rolled back, but the front end may return success.

Similarly, due to the sharing of static variables, other callback events and other issues also exist.
