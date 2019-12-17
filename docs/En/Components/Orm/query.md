---
title: Inquire
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|Inquire
---


# Inquire

Query a line
- get($where, $returnAsArray = false)
- findOne(where) is equivalent to the equivalent get($where, true)

Query multiple lines
- all($where, $returnAsArray = false)
- select(where) is equivalent to the equivalent all($where, true)
- findAll(where) is equivalent to the equivalent all($where, true)

## Return value description

- `get` returns an instance of `EasySwoole\ORM\AbstractModel`, which can be ** reused to perform other operations on the model. Returns `null` when there is no query result.
- `all` returns an array with each element inside it being an instance of `EasySwoole\ORM\AbstractModel`

- When get/all has an error, it returns false and the user can get lastError by itself.

- `findOne` returns an array of key-value pairs
- `select`, `findAll` returns a two-dimensional array, returning `null` when there is no query result.

## Multiple transmission methods

In the above list of methods, the most important is the `$where` parameter, which can be used in multiple ways.

```php
// via the primary key
$res = UserModel::create()->get(1);
// Through the key => value array
$res = UserModel::create()->get([
  'u_id' => 1,
  'u_state' => 0,
  'is_vip' ​​=> 1
]);
// Through the closure method, construct a complex sql
// This is a very powerful and flexible way. The closure parameter is a mysqli component query constructor that can call all consecutive operations.
// http://www.easyswoole.com/Components/Mysqli/builder.html
$res = UserModel::create()->get(function(QueryBuilder $queryBuilder){
    $queryBuilder->where('u_state', 1);
    $queryBuilder->where('age', 12, '>');// Various special operators between like : != etc. can be completed
    $queryBuilder->order('u_id');
});
// Consistent operation, continue to view the ORM documentation
$res = UserModel::create()->where('u_id', 1)->get();
```

## Pagination

Limit and withTotalCount, get the paging list data and the total number of bars.

The following simulation obtains the page data of the page, the page is the page number, and the limit is how many numbers are displayed per page.

```php
$page = 1; // current page number
$limit = 10; // How many data per page

$model = AdminModel::create()->limit($limit * ($page - 1), $limit * $page - 1)->withTotalCount();

// list data
$list = $model->all(null, true);

$result = $model->lastQueryResult();

// total number of articles
$total = $result->getTotalCount();
```

## Error getting

```php
$user = UserModel::create()->where(['There is an error in the case of a field that does not exist' => 1])->get();
If ($user === false){
     Echo $user->lastQueryResult()->getLastError();
}
```
