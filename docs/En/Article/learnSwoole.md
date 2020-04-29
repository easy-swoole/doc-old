---
title: Learn how Swoole avoids being a programmer crying
meta:
  - name: description
    content: How to learn swoole|swoole pit | swoole|swoole study notes
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|swoole|How to learn swoole|swoole pits|swoole study notes
---


# Learn how Swoole avoids being a programmer crying

Many phpers who have just switched from the traditional fpm mode to the swoole memory resident mode will always feel grievances and even want to cry. The reason why swoole always makes you doubt life, is this really the php language I have known before? Why are you so pit?

## Common "pit" under swoole

- Why can't global variables be shared?
  
    For example, in the following code
    ```php
    $http = new swoole_http_server("127.0.0.1", 9501);
    $http->on("request", function ($request, $response) {
        static $i;
        $response->end($i);
        $i++;
    });
    
    $http->start();
    ```
    Some people will find that the `static $i` under swoole is inconsistent with the output understood under fpm. This is due to the emergence of process cloning, and the data between each process is inconsistent.

- Echo var_dump cannot be output to the browser (http response)
  
    In fpm mode, `echo $a` can output the result to the browser. Why can't it be in the swoole? The reason is that the mode change, the swoole mode is no longer fpm, but cli, if You need to respond to the data in the browser. You can only respond with the `response` object in the `Http request` callback.

- Http request parameter acquisition

    In the same swoole http service, many people will find that common global variables such as $_GET and $_POST cannot be used. This is because variables such as $_GET and $_POST are global, and there will be problems in the swoole. If you want to get the request parameters, you can use the `Request` object provided by the Swoole callback to get the result.

- Swoole can't use die/exit
  
    Phper is used to debugging code with die/exit. This is because this command will directly exit the current process. For fpm, each request corresponds to a separate process. Exiting the problem is not big, but in the swoole, there may be a process. There will be multiple requests being processed at the same time. If you exit or die to exit the current process, data will be lost.

- Why do you need to disconnect after swoole     
  
    Many programmers are accustomed to single-handling database connections, which obviously has the advantage of saving the overhead of requiring multiple connections per request database. So why is the error in the swoole always prompting me that the database is disconnected? The reason is that under the traditional fpm, the request is over, then the process cleanup will be performed, the database connection will be cleaned up, and the reconnection will be performed the next time it comes in. This ensures that the connection is available. However, in the case of swoole resident memory, after the request ends, the connection will not be cleaned up and remain in the memory space, and if the connection is not used for a long time, or because the network fluctuates, it will be disconnected. The next time the request comes in, you don't judge the connection status, just go to execute the sql statement, then it means that you have operated a disconnected database connection, so it will definitely report an error.

- Memory leak
    When many people use swoole to write services, they always run and run out of memory. This is because swoole is a resident process type model. Under fpm, the variables in the process will be cleaned up after the request ends, and the variables of the swoole process global period will not be cleaned up due to the end of the request, and will be saved. In memory, on the one hand, the efficiency is improved, but also the developer must pay attention to the necessity of variable recycling.

- Coroutine context access security
    When using the swoole coroutine, some people will encounter the value of the variable does not meet the expected situation, which may be the contamination of the variable. In the traditional php synchronous blocking programming mode, all executions are forced to execute sequentially. However, in the swoole, multiple coroutines are alternately executed. It is possible that when a coroutine gives up the execution right, the b coroutine modifies a cross-correlation variable, then when a coroutine resumes the execution right. This cross-correlation variable will not be the value of the timeout (if you have some knowledge of mysql, you will find this situation is not difficult to understand). At the same time, in order to solve this problem, we usually pay attention to the use of cross-correlation variables and the use of coroutine singletons to control variables.
## Knowledge points to learn from using swoole

::: warning 
In the following content, `must` represents the part that must be learned first. If you do not understand it will lead to learning difficulties and deviations, the code written cannot be applied in the production environment; `should` represent the knowledge points recommended for learning, but you can just understand ; `can` represents the recommendation to learn, usually the weakness of the developer.
:::

- Basic programming knowledge
  - ` should `understand the difference between `blocking` and `non-blocking`
  - `Must be clear `PHP's GC mechanism' This must be clear, most php developers are not clear
  - `Must`clear `php object-oriented programming` Here must be clear about the object reference mechanism and the relationship between objects and memory
  - `Must be clear about the `resources and connection handles' knowledge
  
- Multi-process programming
  - `Must` clear the multi-process models of `fpm` and `swoole` and their differences
  - `Must` understand `interprocess communication` and `process isolation`, `should` understand `process semaphore`

- Basic TCP/UDP awareness
  - `should be clear` the difference between TCP and UDP.
  - `should be clear` the difference between client and server
  - `Must`Understand the upper four layers of the OSI seven-layer model. Learn about common application layer protocols such as `http` `ftp` `smtp`

- Coroutine
  - `Must' clear swoole coroutine working mode
  - `Must`clear how to determine if a variable will be used across coroutines

## Summary

All in all, most php developers think that the reason for the pit when they learn swoole is from the lack of their own knowledge reserves. For the knowledge that many other language developers must master, php development may not need to be mastered, but this is also a technical debt that is owed, and will encounter bottlenecks when it is further improved; resulting in various uses when using swoole The problem. In fact, swoole is a very powerful php extension, ** he redefines php**, so that php has a stronger vitality.
