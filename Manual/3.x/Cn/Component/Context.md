## Context
Context上下文管理器  
在swoole中,由于多个协程是并发执行的，因此不能使用类静态变量/全局变量保存协程上下文内容。使用局部变量是安全的，因为局部变量的值会自动保存在协程栈中，其他协程访问不到协程的局部变量。  
在控制器中,我们可以使用Context保存协程上下文内容:
```php
//在 onRequest全局事件中注册MysqlObject
$conf = Config::getInstance()->getConf("MYSQL");
$dbConf = new \EasySwoole\Mysqli\Config($conf);
Context::getInstance()->register('Mysql',new MysqlObject($dbConf));//注册一个mysql连接,这次请求都将是单例Mysql的
//在控制器中获取本次请求唯一的一个数据库连接

function index()
{
    $mysql_object = Context::getInstance()->get('Mysql');
    $data = $mysql_object->rawQuery("select 1;");
    var_dump($data);
}

```
>如上,我们可以使用Context实现在某个协程中的"全局"变量,这个变量在当前协程中是可全局访问修改的   

方法列表:  
 *  register(string $name,$object) 注册一个对象,object可以是类名,对象实例,回调函数
 *  get(string $name, $cid = null,...$params)  获取,当获取的是注册对象时,$params可作为对象实例化参数
 *  set(string $name,$obj,$cid = null):Context 设置赋值
 *  clear($cid = null):Context  清除某个协程的变量
 *  clearAll():Context  清除所有变量