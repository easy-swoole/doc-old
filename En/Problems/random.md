# Random Generation Problem

Because of Swoole's own reasons, when using random numbers, additional attention is needed. If `mt_rand'is called in the parent process, the result will be the same if `mt_rand' is called again in different child processes. So `mt_srand'must be called within each subprocess to reseed.
` The `PHP'functions dependent on random numbers such as shuffle` and `array_rand` will also be affected.

## Scenario examples

In the asynchronous process of asynchronous tasks, attention should be paid to the problem of random number seeding, such as the following examples

```php
mt_rand(0, 1);    // Here mt_rand is invoked and seeded automatically in the parent process
$worker_num = 16;

// fork process
for ($i = 0; $i < $worker_num; $i++) {
    $process = new swoole_process('child_async', false, 2);
    $pid = $process->start();
}

function child_async(swoole_process $worker)
{
    mt_srand();  // It has to be replanted or the same results will be achieved.
    echo mt_rand(0, 100) . PHP_EOL;
    $worker->exit();
}
```

