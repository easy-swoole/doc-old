## 回调函数
回调函数就是在主进程执行当中,突然跳转到预先设置好的函数中去执行的函数.
```
以下是自知乎作者常溪玲的解说：
你到一个商店买东西，刚好你要的东西没有货，于是你在店员那里留下了你的电话，过了几天店里有货了，店员就打了你的电话，然后你接到电话后就到店里去取了货。在这个例子里，你的电话号码就叫回调函数，你把电话留给店员就叫登记回调函数，店里后来有货了叫做触发了回调关联的事件，店员给你打电话叫做调用回调函数，你到店里去取货叫做响应回调事件。
```

以下是一个非常简单的回调函数的例子:
```php
<?php
//登记回调函数
function insert(int $i):bool {
    echo "插入数据{$i}\n";//模拟数据库插入//响应回调事件
    return true;
}
$arr = range(0,1000);//模拟生成1001条数据
function action(array $arr, callable $function)
{
    foreach ($arr as $value) {
        if ($value % 10 == 0) {//当满足条件时,去执行回调函数处理//触发回调
            call_user_func($function, $value);//调用回调事件
        }
    }
}
action($arr,'insert');

```
在这个例子中,首先定义了一个插入数据的函数,定义了一个1001条数据的数组
然后调用了action函数,当遍历数组满足条件时,则执行设定好的回调函数进行插入数据


### 回调函数的几种写法

#### 函数字符串:
```php
<?php
function insert(int $i):bool {
    echo "插入数据{$i}\n";//模拟数据库插入
    return true;
}
$arr = range(0,1000);//模拟生成1001条数据
function action(array $arr, callable $function)
{
    foreach ($arr as $value) {
        if ($value % 10 == 0) {//当满足条件时,去执行回调函数处理
            call_user_func($function, $value);
        }
    }
}
action($arr,'insert');
```

#### 匿名函数
```php
<?php
$arr = range(0,1000);//模拟生成1001条数据
function action(array $arr, callable $function)
{
    foreach ($arr as $value) {
        if ($value % 10 == 0) {//当满足条件时,去执行回调函数处理
            call_user_func($function, $value);
        }
    }
}
action($arr,function($i){
    echo "插入数据{$i}\n";//模拟数据库插入
    return true;
});
```

### 类静态方法
```php
<?php
$arr = range(0, 1000);//模拟生成1001条数据
function action(array $arr, callable $function)
{
    foreach ($arr as $value) {
        if ($value % 10 == 0) {//当满足条件时,去执行回调函数处理
            call_user_func($function, $value);
        }
    }
}
class A{
    static function insert(int $i):bool {
        echo "插入数据{$i}\n";//模拟数据库插入
        return true;
    }
}
action($arr,'A::insert');
action($arr,array('A','insert'));

```

### 类方法
```php
<?php
$arr = range(0, 1000);//模拟生成1001条数据
function action(array $arr, callable $function)
{
    foreach ($arr as $value) {
        if ($value % 10 == 0) {//当满足条件时,去执行回调函数处理
            call_user_func($function, $value);
        }
    }
}
class A{
    public function insert(int $i):bool {
        echo "插入数据{$i}\n";//模拟数据库插入
        return true;
    }
}
$a = new A();
action($arr,array($a,'insert'));

```