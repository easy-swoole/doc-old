# Trigger

## Trigger a Exception
```
use EasySwoole\EasySwoole\Trigger;

Trigger::getInstance()->throwable(new Exception('exception msg'))
```

## Trigger a error msg
```
use EasySwoole\EasySwoole\Trigger;

Trigger::getInstance()->error('my error msg')
```
