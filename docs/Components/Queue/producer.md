# Queue生产者

```php
use EasySwoole\Queue\Job;
use App\Utility\Queue; // 这是自己封装的单例Queue  需要根据自己定义的命名空间使用

// 注册队列驱动后任意地方投递任务
$job = new Job();
$job->setJobData(time());
Queue::getInstance()->producer()->push($job);
```