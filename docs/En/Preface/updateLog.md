# EasySwoole version update record
## 3.2.x old document address

https://github.com/easy-swoole/doc/tree/3.x-old

## V3.3.0-dev(August 15, 2019)
------------
- Update asynchronous task implementation as Task component implementation
- Update CronTab task adaptation to Task task
Old version upgrade steps：
- Configuration item delete MAIN_SERVER.SETTING.task_worker_num with MAIN_SERVER.SETTING.task_enable_coroutine
- The configuration item adds MAIN_SERVER.TASK and the default value is ```['workerNum'=>4,'maxRunningNum'=>128,'timeout'=>15]```
- 注意EasySwoole的Temp目录不在虚拟机与宿主机共享目录下，否则会导致没有权限创建UnixSocket链接

- [Asynchronous task adaptation](../Components/task.md)
- [CronTab task adaptation](../BaseUsage/crontab.md)

## V3.2.6 (July 31, 2019)
------------

- Support swoole 4.4.0
  - Mandatory swoole version is not lower than 4.4.0


## V3.2.5 (July 15, 2019)
------------
  
- Support to modify the configuration item storage driver, the default is swoole table, you can modify the dynamic configuration
- Support bootstrap, do the highest level of hooks on the outside 
- Phpunit is supported by default


## V3.2.1 (April 22, 2019)
------------

- Default configuration adjustment
  - start `max_wait_time` [See for details](https://wiki.swoole.com/wiki/page/1082.html)
- renovate `Console Client` problem

## V3.1.19 (April 15, 2019)
------------

- The main frame no longer relies on the `Actor` component and the `Process` component, which can be introduced separately and created in the `mainServerCreate` event if needed.
- Default configuration adjustment
  - `Task` Process forced to open coroutine
  - Remove the `max_request` and `task_max_request` settings
  - Enable asynchronous secure restart configuration `reload_async` [See for details](https://wiki.swoole.com/wiki/page/791.html)
- Add a new command line helper

## V3.1.18 (March 11, 2019)
------------

- The default number of HttpController pools is increased from single process `15` to `500`
- Fix the problem that the console default username and password cannot be started normally when it is empty.
- Console configuration `Host` parameter name changed to `LISTEN_ADDRESS`

## V3.1.17 (March 9, 2019)
------------
Stability update

- Fixed Console related bugs

## V3.1.16 (March 8, 2019)
------------
The Console component is no longer a core component, now he is a standalone composer package

- Publish the Console component [GitHub](https://github.com/easy-swoole/console)
	- Console removed from core components

## V3.1.15 (February 25, 2019)
------------
Adaptation swoole 4.2.13

- Support swoole 4.2.13
    - Adapted according to the underlying api changes of the swoole
	- Mandatory swoole version is not lower than 4.2.13

## V3.1.14 (January 29, 2019)
------------
Refactoring console

- Refactoring console
    - Optimized reload and stop commands
	- Adjusted the reload time type
	- Fixed an issue with incorrect loading configuration when `produce load`
    
## V3.1.13 (January 22, 2019)
------------
Rationality adjustment

- Rationality adjustment to prepare for cli unit testing

## V3.1.12 (January 21, 2019)
------------
Rationality adjustment, increase console permissions configuration

- Add console permission assignment

## V3.1.11 (January 18, 2019)
------------
Added `FastCache` configuration item, refactored console, added user-defined session processing

- Added `FastCache` configuration item
- Refactoring the console, requiring mandatory user authentication and multi-user login
- `Http` component supports custom session processing
- `Http` component adjusts custom sessionHandle to handle return value

## V3.1.10 (January 15, 2019)
------------
Rationality adjustment

- Modify some internal method defaults without affecting users

## V3.1.9 (January 15, 2019)
------------
Rationality adjustment

- Modify some code that does not follow PSR-2 to follow PSR-2
- Fix `Http` component path error

## V3.1.8 Refactor the log processing class! (January 12, 2019)
------------
Refactored log processing, no impact on most users, previously used ** custom log class ** need to be re-adapted

- Refactoring log processing
    - The log processing class no longer needs to inherit `\EasySwoole\Trace\Logger`
    - The log processing class now needs to implement `\EasySwoole\Trace\AbstractInterface\LoggerInterface`
- Added configuration item `DISPLAY_ERROR` default `false`, if you need Debug user, please set it to `true`

## V3.1.7 (January 11, 2019)
------------
Adaptation `Task` can not be executed normally when delivering closures

- Adaptation `Task` can not be executed normally when delivering closures

## V3.1.6 (January 10, 2019)
------------
Adapt `Swoole 4.1.12`, enable callback onTask after coroutine, add flag parameter to abstract task template.

- Adapted to `Swoole 4.1.12`
- Support coroutine `onTask` callback (** users who have upgraded new version please pay attention to adaptation**)
- Abstract task template added `flag` parameter

## V3.1.5 (January 7, 2019)
------------
Fixed an issue where the `onMessage` event could not be registered properly

## V3.1.4 (January 7, 2019)
------------
Add global event `onPacket` `onMessage`
Added automatic main service context cleanup `onRequest` `onMessage` `onReceive` `onPacket`

- Add a global event:
    - `onPacket`
    - `onMessage`
- Added automatic cleaning of the main service context：
    - `onRequest`
    - `onMessage`
    - `onReceive`
    - `onPacket`

## V3.1.3 (January 3, 2019)
------------
Fix the wrong type problem when creating a service

- Fix the wrong type problem when creating a service

## V3.1.2 (January 1, 2019)
------------
This release modifies configuration file suffixes and service type constants

- The configuration file was changed from `dev.env` and `produce.env` to `dev.php` and `produce.php`
- The original configuration file MYSQL.host = 127.0.0.1 The `.` connection format is changed to Array mode of MYSQL => ['host' => '127.0.0.1']
- The original service mode constant `SERVER` `WEB_SERVER` `WEB_SOCKET_SERVER` is modified to `EASYSWOOLE_SERVER` `EASYSWOOLE_WEB_SERVER` `EASYSWOOLE_SOCKET_SERVER`

## V3.1.1 Large version upgrade! (December 27, 2018)
------------
The built-in `AbstractProcess`, `Timer`, `FastCache`, and `Actor` have been completely removed from the stand-alone component library implementation.  
If you use the above components in your project, you can change the dependency branch to `^3.0` (Note): Previously `3.x-dev`.
Upgrade documentation will be provided later

- Remove `AbstractProcess`
- Remove `Timer`
- Remove `FastCache`
- Remove `Actor`
- New component `FastCache` Warehouse Address: [FastCache](https://github.com/easy-swoole/fast-cache)
- New component `Actor` Warehouse Address: [Actor](https://github.com/easy-swoole/actor)
- `Component` Component added `Process` class Warehouse Address:[Component-Process](https://github.com/easy-swoole/component/tree/master/src/Process)
- `Component` Component added `Timer` class Warehouse Address:[Component-Timer](https://github.com/easy-swoole/component/blob/master/src/Timer.php)
