# Controllers
You may wish to organize all of your request handling logic using Controller classes. `EasySwoole` implements
the `Multiplexing` pattern for your convenience and injects the `request` and `response` instance into your controller from the instances pool.

## Multiplexing and objects pool

In your controller, you can always get the instance from the objects pool, for instance:

- 1: `Client A` required the `/Index` resource at the very first time
- 2: After route parsing, it's dispatched to the controller `App\HttpController\Index.php`
- 3: `App\HttpController\Index.php` will be initialized at this time and pushed into the objects pool
- 4: `EasySwoole` retrieves the instance of `App\HttpController\Index.php` from the pool then invoke `index()` method
- 5: After `index()` method finished, the controller object will be reset and put back to the pool
- 6: `Client B` required the `/Index` resource later
- 7: After route parsing, it's dispatched to the controller `App\HttpController\Index.php`
- 8: At this time, `EasySwoole` will retrieve the instance of `App\HttpController\Index.php` from the pool straight away then invoke `index()` method

> `Multiplexing` implements different request to reuse the same object, reducing the overhead of creating/destroying objects. The controller object will be initialised at the very first time, once it's created and pushed into the objects pool, 

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