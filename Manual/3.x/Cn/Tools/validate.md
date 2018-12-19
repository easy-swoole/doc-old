## Validate

> 验证器类: EasySwoole\Validate\Validate

#### 方法列表

获取Error：

```php
function getError():?EasySwoole\Validate\Error
```

给字段添加规则：

- string `name`         字段key
- string `errorMsg`     错误信息
    - string `alias`    别名

```php
public function addColumn(string $name,?string $errorMsg = null,?string $alias = null):EasySwoole\Validate\Rule
```

返回一个Rule对象可以添加自定义规则。

数据验证：

- array `data` 数据

```php
function validate(array $data)
```

#### 例子（[demo](https://github.com/easy-swoole/demo/tree/3.x/CliExample/validate.php)）

```php

<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-10-11
 * Time: 上午10:26
 */

require_once 'vendor/autoload.php';

$data = [
    'name' => 'blank',
    'age'  => 25
];

$valitor = new \EasySwoole\Validate\Validate();
$valitor->addColumn('name', '名字不为空')->required('名字不为空')->lengthMin(10,'最小长度不小于10位');
$bool = $valitor->validate($data);
var_dump($valitor->getError()->getErrorRuleMsg()?:$valitor->getError()->getColumnErrorMsg());

/* 结果：
 string(26) "最小长度不小于10位"
*/
```

#### 如何在控制器使用验证例子([demo](https://github.com/easy-swoole/demo/tree/3.x/App/HttpController/Validate/Index.php))

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-11-14
 * Time: 下午2:33
 */

namespace App\HttpController\Validate;


use App\HttpController\Base;
use EasySwoole\Http\Message\Status;
use EasySwoole\Validate\Validate;

class Index extends Base
{
    function index() {
        $validate = new Validate();
        $validate->addColumn('name')->required('姓名必填');
        $validate->addColumn('age')->required('年龄必填')->between(20, 30, '年轻只能在20岁到30岁之前');
        if ($this->validate($validate)) {
            $this->writeJson(Status::CODE_OK, null, 'success');
        } else {
            $this->writeJson(Status::CODE_BAD_REQUEST, $validate->getError()->__toString(), 'fail');
        }
    }
}
```

启动服务。

访问<http://localhost:9501/validate>,响应结果如下：

```
{"code":400,"result":"name姓名必填","msg":"fail"}
```

访问<http://localhost:9501/validate?name=blank>,响应结果如下：

```
{"code":400,"result":"age年龄必填","msg":"fail"}
```

访问<http://localhost:9501/validate?name=blank&age=12>,响应结果如下：

```
{"code":400,"result":"age年龄只能在20岁到30岁之前","msg":"fail"}
```

访问<http://localhost:9501/validate?name=blank&age=22>,响应结果如下：

```
{"code":400,"result":"age年龄只能在20岁到30岁之前","msg":"fail"}
```
