# 内置验证

> #### EasySwoole\Core\Utility\Validate;

实践出真理，我只是个渣渣。

## 使用方式1：

最直接的是在Controller的子类中使用父类的validateParams方法  
（就是下图这个方法）  
    ![](/assets/QQ20180126-194914.png)

### 在子类中使用，上例子🌰🌰🌰：

实践出真理，我只是个渣渣。

```php
<?php
namespace App\HttpController\Agreement:

class User extends Controller
{
    public function add()
    {
        // 定制规则
        $rules = new Rules();
        // add(要验证字段，错误信息)->withRule(验证规则);规则看Validate类内常量
        $rules->add('filed', 'errorMsg')->withRule('rele');
        // 传入规则
        $validate = $this->validateParams($rules);
        // 获取相关返回
        $validate->getErrorList();
        $validate->first();
        $validate->getError('field');
        }

}
```

> #### 也可以自己重写哦!

## 使用方式2：

其他地方使用，上例子🌰🌰🌰：  
实践出真理，我只是个渣渣。

```php
<?php
namespase App\HttpController;

use EasySwoole\Core\Utility\Validate\Validate;
use EasySwoole\Core\Utility\Validate\Rules;

class superMan
{
    public function fly()
    {
        // 定制规则
        $rules = new Rules();
        // add(要验证字段，错误信息)->withRule(验证规则);规则看Validate类内常量
        $rules->add('filed', 'errorMsg')->withRule('rele');

        // 实例化传进去一个数组和规则对象。
        $validate = new Validate();
        $return = $validata->('array', 'reles');

        // 获取相关返回
        $return->getErrorList();
        $return->first();
        $return->getError('field');
    }
}
```



