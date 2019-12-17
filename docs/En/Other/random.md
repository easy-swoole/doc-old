---
title: Random generation problem
meta:
  - name: description
    content: Easyswoole, randomly generated problem
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|Random generation problem
---
## Random generation problem

Due to the Swoole itself, when using random numbers, you need to pay extra attention. If `mt_rand` is called in the parent process, the result returned by calling `mt_rand` in different child processes will be the same. So you must call `mt_srand` to reseek in each child process.

::: warning 
`shuffle` and `array_rand` and other PHP functions that rely on random numbers will also be affected.
:::


## Scene example

In asynchronous tasks, asynchronous processes, you need to pay attention to the problem of random number seeding, as in the following example.

```php
mt_rand(0, 1);    // Mt_rand has been called here and has been automatically seeded within the parent process
$worker_num = 16;

// Fork process
for ($i = 0; $i < $worker_num; $i++) {
    $process = new swoole_process('child_async', false, 2);
    $pid = $process->start();
}

function child_async(swoole_process $worker)
{
    mt_srand();  // Must be replanted here, otherwise the same result will be obtained
    echo mt_rand(0, 100) . PHP_EOL;
    $worker->exit();
}
```

