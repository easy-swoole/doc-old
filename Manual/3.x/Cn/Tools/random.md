## Random

> 随机数生成工具类: EasySwoole\Utility\Random

该工具类可用于生成随机验证码,随机字符串等等

#### 方法列表

字符串随机生成：

- int    `length`     生成长度
- string `alphabet`   自定义生成字符集

```php
static function character($length = 6, $alphabet = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789')
```

纯数字字符串随机生成：

- int `length` 生成长度

```php
static function number(length = 6)
```
