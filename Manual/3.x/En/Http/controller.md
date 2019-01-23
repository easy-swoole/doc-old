# Controller
The default namespace for controller is ***App\HttpController*** , and the controller is manager by a pool, each ***__construct*** function for controller will be call only once at its lifecycle.

## Controller Extends
Each Controller must extends ***EasySwoole\Http\AbstractInterface\Controller*** ,the default function list:

- index()

    the default for a controller. for example ,request path is ***/test/index.html*** or ***/test*** and that exist ***Test*** controller .then index action match.
- actionNotFound(?string $action)
    
    for example ,request path is ***/test/index.html*** and that exist ***Test*** controller,the match action is ***hello***,but if you dont have a public function which name ***hello*** in your controller,then ***actionNotFount*** match 
- onRequest(?string $action):bool
    
    call before each action .and if you return false means dont exec the continue action
- afterAction(?string $actionName)

    call after each action（include action not found）
- onException(\Throwable $throwable)

    call when exception occur in you request action
- getActionName():?string

    get the current match action name
- gc()  
    
    call when your controller is return to controller pool
- request()
    
    get current psr-7 http request instance
- response()

    get current psr-7 http response instance