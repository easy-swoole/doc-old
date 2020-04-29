---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# Query constructor

QueryBuilder is a SQL constructor for constructing prepare sql. E.g:

```php
use EasySwoole\Mysqli\QueryBuilder;

$builder = new QueryBuilder();

//Execution conditional construction logic
$builder->where('col1',2)->get('my_table');

//Get the last query parameter
echo $builder->getLastQueryOptions();

//Get subquery
echo $builder->getSubQuery();


//Get the pre-processing sql statement of the last condition construct
echo $builder->getLastPrepareQuery();
// SELECT  * FROM whereGet WHERE  col1 = ? 

//Get the pre-processing sql statement of the last condition construct, so the required binding parameters
echo $builder->getLastBindParams();
//[2]

//Get the sql statement of the last conditional construct
echo $builder->getLastQuery();
//SELECT  * FROM whereGet WHERE  col1 = 2 
```
