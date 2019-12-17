---
title: Transaction operation
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|Transaction operation
---

# Transaction operation

## Open transaction
Pass the instructions

| Parameter Name    | Required  | Parameter Description |
| ---------------   | --------  | ------------------------------------------------------------ |
| connectionNames   | No        | Open the connection name of the transaction; string or array<br/> is specified in addConnection. Under normal circumstances, no special settings are required.

Return Description: bool returns true if it is successful, false if it fails to open

```php
DbManager::getInstance()->startTransaction($connectionNames = 'default');
```

## Submitting a transaction

Pass the instructions

| Parameter Name    | Required  | Parameter Description |
| ----------------- | --------  | ------------------------------------------------------------ |
|ConnectName        | No        | Specifies to submit a connection name, if not passed, automatically submit the transaction connection obtained in the current coroutine. In general, no special settings are required.


Return Description: bool returns true if the submission is successful, false if it fails

```php
DbManager::getInstance()->commit($connectName = null);
```

## Rollback transaction

Pass the instructions

| Parameter Name    | Required  | Parameter Description |
| ----------------- | --------  | ------------------------------------------------------------ |
|ConnectName        | No        | Specifies to submit a connection name, if not passed, automatically submit the transaction connection obtained in the current coroutine. In general, no special settings are required.



Return Description: bool returns true if the submission is successful, false if it fails

```php
DbManager::getInstance()->rollback();
```



## Transaction use case

```php 
$user = UserModel::create()->get(4);

$user->age = 4;
// Open the transaction
$strat = DbManager::getInstance()->startTransaction();

// update operation
$res = $user->update();

// Roll back directly regardless of whether the update succeeded or failed
$rollback = DbManager::getInstance()->rollback();

// returns false because the connection has been rolled back. The transaction is closed.
$commit = DbManager::getInstance()->commit();
Var_dump($commit);
```

