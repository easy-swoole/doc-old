# EasyswooleEvent
Easyswoole has global event callback entrance which register in ***EasySwooleEvent.php*** file  at your project root.

## initialize()
which is call when the easyswoole framework initialized . what you can do ? eg:
- load you config or extral lib
- register error handler or other callback
- register pool
- etc...

## mainServerCreate(EventRegister $register)
which is call when easyswoole has created the ***swoole_server*** instance . what you can do ? eg:
- register or hook default event callback
- add sub listener
- register your process into server
- etc...