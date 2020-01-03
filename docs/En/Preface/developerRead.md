---
title: Developer reading
meta:
  - name: description
    content: Easyswoole developers read, notes, process isolation, coroutine issues
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|Swoole development considerations
---

# Developer reading

- [GitHub](https://github.com/easy-swoole/easyswoole)  Leave a star if you like
- [GitHub for Doc](https://github.com/easy-swoole/doc)

## Community Q & A

- QQ exchange group 
    - VIP group 579434607 (this group needs to pay 599 RMB)
    - EasySwoole official group 633921431 (full)
    - EasySwoole official two groups 709134628 (full)
    - EasySwoole official three groups 932625047

- Commercial support:
    - QQ 291323003
    - EMAIL admin@fosuss.com
      
## Precautions
- Don't execute sleep and other sleep functions in your code, which will cause the entire process to block.
    Exit/die is dangerous and will cause the worker process to exit
- Fatal error can be caught by register_shutdown_function. Do some request work when the process exits abnormally.
- If there is an exception thrown in the PHP code, the TRY/CATCH capture exception must be made in the callback function, otherwise the worker process will exit.
- Swoole does not support set_exception_handler, you must use try/catch to handle exceptions.
- You can't write the logic of sharing network service client connections such as Redis or MySQL in the controller. Every time you access the controller, you must connect a new one.

## Class/function repeat definition

- It is very easy for novices to make this mistake. Since easySwoole is resident in memory, it will not be released after loading the class/function definition file.Therefore, you must use include_once or require_once when importing php files of classes/functions. Otherwise a fatal error of cannot redeclare function/class will occur.

::: warning
It is recommended to use composer for automatic loading.
:::


## Process isolation and memory management

Process isolation is also a problem that many newcomers often encounter. Modified the value of the global variable, why it does not take effect, the reason is that the global variable is in a different process, the memory space is isolated, so it is invalid.  
So using the easySwoole development server program needs to understand the process isolation problem.

- In different processes, the PHP variable is not shared. Even if it is a global variable, its value is modified in the A process. It is invalid in the B process. If you need to share data in different Worker processes, you can use Redis, MySQL, and files, Swoole\Table, APCu, shmget and other tools to achieve shared data within the Worker process

- The file handles of different processes are isolated, so the Socket connection or open file created in the A process is invalid in the B process, even if it is sent to the B process is not available. (handles cannot be shared by the process)

- Process clone. When the server starts, the main process will clone the current process state. After that, the in-process data will be independent of each other and will not affect each other. Novice newcomers can understand php's pcntl

### 4-layer life cycle of objects in easyswoole

The development of the swoole program is fundamentally different from normal LAMP programming. In traditional Web programming, PHP programmers only need to pay attention to the request arrival, and the request ends. In the swoole program, the programmer can control a larger range, and variables/objects can have four life cycles.

::: warning  
Variables, objects, resources, require/include files, etc. are collectively referred to below as objects.
:::

#### Program global period

Create a good object in `bootstrap` and `initialize` of `EasySwooleEvent.php`, which we call the program global lifecycle object. As long as these variables are not destroyed by the scope, they will persist after the program starts, and will not be destroyed until the entire program finishes running.

Some server programs may run for months or even years to shut down/restart, and the objects in the program's global period continue to reside in memory during this time. The memory occupied by the program global object is shared between the Worker processes and does not occupy additional memory.
E.g:
- `Initialize` the use of Di to inject an object, then after the program starts, the controller of the easyswoole or other places can directly call this object through Di.
- Introduce a file `test.php` in `bootstrap.php` that defines a static variable that can be called by the controller of easyswoole or elsewhere.

This part of the memory will be separated when writing(COW). When these objects are written in the Worker process, they are automatically separated from the shared memory and become process global objects.
E.g:
- In the `initialize`, use Di to inject an object, and modify the properties of the object when user A accesses the controller. When other users access the controller, the object property may be unchanged when it is accessed (because different users The process of accessing the controller is different, other processes will not modify this change, so you need to pay attention to this problem)
- Introduce a file `test.php` in `bootstrap.php`, which defines a static variable $a=1. User A changes the variable $a=2 when accessing the controller, possibly while other users are accessing it. Still the state of $a=1

::: warning 
The code of the program global include/require must be released when the entire program is shutdown, reload is invalid.
:::

#### Process global period
Swoole has a mechanism for process lifecycle control. Objects created after the worker process is started (objects created in onWorkerStart or objects created in the controller) are resident memory within the lifetime of this child process.
 
E.g:
- After the program global lifecycle object is modified by the controller, the object will be copied out to the process to which the controller belongs. This object can only be accessed by this process, and other processes still access the global object.
- The object created when the service registers the `onWorkerStart` event (created in the `mainServerCreate` event in `EasySwooleEvent.php`), only the worker process can get it.


::: warning 
The memory occupied by the process global object is in the current child process, not shared memory. The modification of the object is only valid in the current Worker process. The process include/required files will be reloaded after reload.
:::

#### Session period

The session is created after onConnect, or it is created on the first onReceive and destroyed on onClose. After a client connection comes in, the created object will be resident in memory until the client leaves. 


In LAMP, a client browser accessing multiple websites can be understood as a session period. But traditional PHP programs don't perceive sessions. Only use session_start for a single access, access the $_SESSION global variable to get some information about the session.

The object in the session period of swoole is directly resident memory, and does not require operations such as session_start. You can access the object directly and execute the method of the object.

#### Request period

The request period means that a complete request is sent, that is, `onReceive` receives the request and starts processing until the result is returned and the response is sent. Objects created during this cycle are destroyed after the request is completed.


The request period object in swoole is the same as the object in the normal PHP program. Created when the request arrives, and destroyed after the request ends.


#### Memory management mechanism in swoole_server

The underlying principle of memory management after `swoole_server` startup is consistent with the normal `php-cli` program. Please refer to the `Zend VM` memory management article for details.

#### Local variable

After the event callback function returns, all local objects and variables are reclaimed, no `unset` is required. If the variable is a resource type, the corresponding resource will also be released by the underlying PHP.

```php
function test()
{
    $a = new Object;
    $b = fopen('/data/t.log', 'r+');
    $c = new swoole_client(SWOOLE_SYNC);
    $d = new swoole_client(SWOOLE_SYNC);
    global $e;
    $e['client'] = $d;
}

```
`$a, $b, $c` are all local variables. When this function returns, these 3 variables will be released immediately, the corresponding memory will be released immediately, and the open IO resource file handle will be closed immediately. `$d` is also a local variable, but it is saved to the global variable $e before return, so it will not be released. When `unset($e['client'])` is executed and no other PHP variables are still referencing the $d variable, `$d` will be released.

#### Global variable

In PHP, there are three types of global variables.

- Variable declared with the `global` keyword
- Class static variables, function static variables declared using the `static` keyword
- PHP super global variables, including `$_GET, $_POST, $GLOBALS` etc.

Global variables and objects, class static variables, variables stored on the swoole_server object are not released. The programmer needs to handle the destruction of these variables and objects.

```php
class Test
{
    static $array = array();
    static $string = '';
}

function onReceive($serv, $fd, $reactorId, $data)
{
    Test::$array[] = $fd;
    Test::$string .= $data;
}
```

- In the event callback function, you need to pay special attention to the array type value of non-local variables. Some operations such as `TestClass::$array[] = "string"` may cause memory leaks. In severe cases, memory may burst. If necessary, you should pay attention to clean up `Array`.
- In the event callback function, the string concatenation of non-local variables must be careful with memory leaks, such as `TestClass::$string .= $data`, there may be memory leaks, and in severe cases, burst memory may occur.

Solution
- The synchronous blocking and requesting responsive stateless server program can set `max_request`, and the process automatically exits when the `Worker Process/Task Process` ends running or reaches the upper limit of the task. All variables/objects/resources of the process are released for recycling.
- In the program `onClose` or set the timer to use `unset` to clean up variables in time, recycle resources


::: warning 
The memory management section refers to the official swoole documentation.
:::

## Convention specification

- The class name and class file (folder) are named in the project, both are `upper camel case`, and the variable and class method is `lower camel case`.
- In the `HTTP` response, `echo $var` does not output the $var content to the corresponding content in the business logic code. Please call the `wirte()` method in the `Response` instance.

<script>
  export default {
    mounted () {
        if(localStorage.getItem('isNew') != 1){
            localStorage.setItem('isNew',1);
            layer.confirm('是否给EasySwoole点个赞',function (index) {
                 layer.msg('感谢您的支持');
                     setTimeout(function () {
                         window.open('https://github.com/easy-swoole/easyswoole');
                  },1500);
             });              
        }
    }
  }
</script>
