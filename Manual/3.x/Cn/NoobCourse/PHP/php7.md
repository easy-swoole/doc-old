## PHP7与php5
php在2015年12月03日发布了7.0正式版,带来了许多新的特性，以下是不完全列表:

 * 性能提升：PHP7比PHP5.6性能提升了两倍。 Improved performance: PHP 7 is up to twice as fast as PHP 5.6
 
 * 全面一致的64位支持。 Consistent 64-bit support
 
 * 以前的许多致命错误，现在改成抛出异常。Many fatal errors are now Exceptions
 
 * 移除了一些老的不在支持的SAPI（服务器端应用编程端口）和扩展。Removal of old and unsupported SAPIs and extensions
 
 * 新增了空接合操作符。The null coalescing operator (??)
 
 * 新增加了结合比较运算符。Combined comparison Operator (<=>)
 
 * 新增加了函数的返回类型声明。Return Type Declarations
 
 * 新增加了标量类型声明。Scalar Type Declarations
 
 * 新增加匿名类。Anonymous Classes


本教程主要讲解swoole将要用到或有相关性的特性


### 致命错误将可用异常形式抛出
在php7之后,大部分错误可通过异常形式抛出,并可使用catch拦截,例如:
```php
try {
   $a->test();//未定义该对象并没有该方法,抛出一个Throwable类
    // Code that may throw an Exception or Error.
} catch (Throwable $t) {
    var_dump($t->getMessage());
    // Executed only in PHP 7, will not match in PHP 5
} catch (Exception $e) {
}
```
运行之后将打印一条报错语句:
```
string(40) "Call to a member function test() on null"
```

### ??  null合并运算符
由于日常使用中存在大量同时使用三元表达式和 isset()的情况， php7添加了null合并运算符 (??) 这个语法糖。如果变量存在且值不为NULL， 它就会返回自身的值，否则返回它的第二个操作数。例如:
```
$a = $b??0;
//如果当$b为null,则返回0.如果$b不为null,则返回$b;
```

### 标量类型声明
标量类型声明 有两种模式: 强制 (默认) 和 严格模式。 现在可以使用下列类型参数（无论用强制模式还是严格模式）： 字符串(string), 整数 (int), 浮点数 (float), 以及布尔值 (bool)。它们扩充了PHP5中引入的其他类型：类名，接口，数组和 回调类型。例如:
```php
<?php
function a(
    ?int $a /*参数必须是int或者null*/,
    string $b/*参数必须string*/,
    Closure $function /*参数必须是匿名函数*/,
    array $array/*参数必须是数组*/
    ){}
```

>类名/接口限定都需要考虑命名空间


### 返回值类型声明
PHP 7 增加了对返回类型声明的支持。 类似于参数类型声明，返回类型声明指明了函数返回值的类型。可用的类型与参数声明中可用的类型相同。例如:
```php
<?php
function a():int{//必须返回int类型,否则报错
    return 1;
}
function b():?int{//必须返回int类型或者null类型,否则报错
    return 'das';
}
```

### 太空船操作符<=>（组合比较符）
太空船操作符用于比较两个表达式。当$a小于、等于或大于$b时它分别返回-1、0或1。 比较的原则是沿用 PHP 的常规比较规则进行的。
```php
<?php
// Integers
echo 1 <=> 1; // 0
echo 1 <=> 2; // -1
echo 2 <=> 1; // 1
// Floats
echo 1.5 <=> 1.5; // 0
echo 1.5 <=> 2.5; // -1
echo 2.5 <=> 1.5; // 1
// Strings
echo "a" <=> "a"; // 0
echo "a" <=> "b"; // -1
echo "b" <=> "a"; // 1
```
