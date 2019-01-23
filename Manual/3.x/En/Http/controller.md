# Controller
The default namespace for controller is ***App\HttpController*** , and the controller is manager by a pool, each ***__construct*** function for controller will be call only once at its lifecycle.

## Controller Extends
Each Controller must extends ***EasySwoole\Http\AbstractInterface\Controller*** ,the default function list:

- index()
- actionNotFound(?string $action)
- onRequest(?string $action):bool
- afterAction(?string $actionName)
- onException(\Throwable $throwable)
- getActionName():?string
- gc()
- request()
- response()