## Context
Context manager
If use coroutine, static properties/global variables are not safety.So you can use Context to store some data.
```php
$conf = Config::getInstance()->getConf("MYSQL");
$dbConf = new \EasySwoole\Mysqli\Config($conf);
Context::getInstance()->register('Mysql',new MysqlObject($dbConf));// Register a mysql connection.
// get a conn

function index()
{
    $mysql_object = Context::getInstance()->get('Mysql');
    $data = $mysql_object->rawQuery("select 1;");
    var_dump($data);
}

```
>如上,我们可以使用Context实现在某个协程中的"全局"变量,这个变量在当前协程中是可全局访问修改的 
> We can use Context to store some "global" variables, these variables are not accessible in other coroutines.

Method list: 
 *  register(string $name,$object)
 *  get(string $name, $cid = null,...$params)
 *  set(string $name,$obj,$cid = null):Context
 *  clear($cid = null):Context
 *  clearAll():Context
