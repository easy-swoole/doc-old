---
title: One-to-one association
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|One-to-one association
---


# One to one Association

## Definition

For example, a user model might be associated with a relationship model.

In order to define this association, we need to write a relationship method in the user model. Call the hasone method inside the relation method and return the result:

The first parameter of the hasone method is the class name of the associated model.

```php
public function relation()
{
    return $this->hasOne(Relation::class);
}
```

Model association methods allow you to add custom restrictions to associations

The following case shows that the u id in the relation table is equal to the ID value of the current model (assuming user)

```php
use EasySwoole\Mysqli\QueryBuilder;

public function settingWhere()
{
    return $this->hasOne(Relation::class, function(QueryBuilder $query){
        $query->where('u_id', $this->id);
        $query->where('status', 1);
        return $query;
    });
}
```

ORM Automatically associate based on the primary key column of the associated model。

In this case, the relationship ID primary key is used automatically. If you want to override this Convention, you can pass the third and fourth parameters to the hasone method:

The third parameter is the 'column' of the current model, and the fourth parameter is the corresponding 'column' of the associated model`

```php
public function settingWhere()
{
    return $this->hasOne(Relation::class, null, 'id', 'user_id');
}
```

## use

Once the model association is defined, we can use the ORM dynamic properties to get the relevant records. Dynamic properties allow you to access relational methods just like properties defined in the model:

If the query is not found, it will be null. If the query is not found, the instance of a model class can continue to call ORM for quick update and deletion

```php
$res = User::create()->get(1);
$hasOneRelation = $res->relation; //The access is actually the result of the relation method processing; the return is the relation model object

$userid = $hasOneRelation->user_id;
```

