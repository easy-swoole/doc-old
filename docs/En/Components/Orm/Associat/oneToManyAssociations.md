---
title: One-to-many association
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|One-to-many association
---

# One-to-many association

## Definition

For example, a user model may be associated with multiple relationship models.

In order to define this association, we need to write a relationship method in the user model. Call the hasmany method inside the relation method and return the result:

The first parameter of the hasmany method is the class name of the associated model.

```php
public function relation()
{
    return $this->hasMany(Relation::class);
}
```

Model association methods allow you to add custom restrictions to associations

```php
use EasySwoole\Mysqli\QueryBuilder;

public function settingWhere()
{
    return $this->hasMany(Relation::class, function(QueryBuilder $query){
        $query->where('u_id', $this->id);
        $query->where('status', 1);
        return $query;
    });
}
```

The ORM automatically associates based on the primary key column of the associated model.

In this case, the relationship ID primary key is used automatically. If you want to override this Convention, you can pass the third and fourth parameters to the hasmany method:

The third parameter is the 'column' of the current model, and the fourth parameter is the corresponding 'column' of the associated model`

```php
public function settingWhere()
{
    return $this->hasMany(Relation::class, null, 'id', 'user_id');
}
```

## use

Once the model association is defined, we can use the ORM dynamic properties to get the relevant records. Dynamic properties allow you to access relational methods just like properties defined in the model:

If the query is not found, it will be null. If the query is not found, it will be an array. Each array element is an instance of the model class. You can continue to call ORM for quick update and deletion

```php
$userModel = User::create()->get(1);
$hasManyRelation = $userModel->relation; //The access is actually the result of the processing of the relation method; what is returned is that each array element of the array is a relation model object

$userId = [];
foreach($res->relation as $relationModel) {
    $userId[] = $relationModel->user_id;
}
```
