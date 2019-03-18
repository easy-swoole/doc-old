## 收到请求事件

```php
 public static function onRequest(Request $request, Response $response): bool
```

当EasySwoole收到任何的HTTP请求时，均会执行该事件。该事件可以对HTTP请求全局拦截。

```php
<?php
 public static function onRequest(Request $request, Response $response): bool
    {
        //不建议在这拦截请求,可增加一个控制器基类进行拦截
        //如果真要拦截,判断之后return false即可
        $code = $request->getRequestParam('code');
        if (0/*empty($code)验证失败*/){
            $data = Array(
                "code" => Status::CODE_BAD_REQUEST,
                "result" => [],
                "msg" => '验证失败'
            );
            $response->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
            $response->withHeader('Content-type', 'application/json;charset=utf-8');
            $response->withStatus(Status::CODE_BAD_REQUEST);
            return false;
        }

        return true;
    }
```

> 若在该事件中，执行 $response->end(),则该次请求不会进入路由匹配阶段。

> 可查看[demo](https://github.com/easy-swoole/demo/tree/3.x-http)

