# EasySwoole version update record

## V3.3.0-dev (15 August 2019)

------------
- Update asynchronous task implementation as Task component implementation
- Update CronTab Task Adaptation Task
Old version upgrade steps：
- Configuration Item Deletion  MAIN_SERVER.SETTING.task_worker_num and MAIN_SERVER.SETTING.task_enable_coroutine
- Configuration Item Added MAIN_SERVER.TASK ,The default value is ```['workerNum'=>4,'maxRunningNum'=>128,'timeout'=>15]```
- Note that the Temp directory of EasySwoole is not in the shared directory between the virtual machine and the host machine, otherwise you will not have permission to create UnixSocket links

- [Asynchronous task adaptation](./../BaseUsage/asyncTask.md)
- [CronTab adaptation](./../BaseUsage/crontab.md)

## V3.2.6 (31 July 2019)
------------

- Support swoole 4.4.0
  - Mandatory swoole version no less than 4.4.0


## V3.2.5 (July 15, 2019)
------------

- Support for modifying configuration item storage driver, default is swoole table, you can modify dynamic configuration
- Support bootstrap to hook the highest level outside 
- Default support for phpunit


## V3.2.1 (April 22, 2019)
------------

- Default configuration adjustment
- Enable  `max_wait_time` [See details.](https://wiki.swoole.com/wiki/page/1082.html)
- Repair problem `Console Client`

### V3.1.19 (April 15, 2019)
------------

- The main framework is no longer mandatory to rely on `Actor'components and `Process` components, and can be introduced separately and created in the `mainServer Create` event if necessary.
- Default configuration adjustment
  - `Task` forces the start of the coroutine
  - remove `max_request` and `task_max_request` settings
  - Enable Asynchronous Security Restart Configuration `reload_async'` [See details.](https://wiki.swoole.com/wiki/page/791.html)
- Added a command-line helper prompt

### V3.1.18 (11 March 2019)
------------

- The default number of HttpController pools increased from `15`to `500` for a single process
- Fix Console default username and password can not start properly when they are empty
- Console configuration `Host` parameter name changed to  `LISTEN_ADDRESS`

### V3.1.17 (9 March 2019)
------------
Stability update

- Fixed Console related bugs

### V3.1.16 (8 March 2019)
------------
Console components are no longer core components, but now they are a separate composer package

- Publish Console components [GitHub](https://github.com/easy-swoole/console)
	- Console removed from core components

### V3.1.15 (February 25, 2019)
------------
Adapt swoole 4.2.13

- Support for swoole 4.2.13
    - Adapted to changes in the swoole underlying API
	- Mandatory swoole version no less than 4.2.13

### V3.1.14 (January 29, 2019)
------------
Reconfiguration console

- Reconfiguration console
    - Optimized reload and stop commands
	- Adjusted reload time type
	- Fixed the problem of incorrect loading configuration when producing load
    
### V3.1.13 (January 22, 2019)
------------
Rationality adjustment

- Rationality adjustment，Preparing for cli unit testing

### V3.1.12 (January 21, 2019)
------------
Rationality Adjustment, Increase Console Rights Configuration

- Added Console Permission Allocation

### V3.1.11 (January 18, 2019)
------------
Add `FastCache` configuration item, rebuild console, add user-defined session processing

- Add `FastCache` configuration item
- Reconstructing the console requires mandatory user authentication to support multi-user login
-`Http` Component Supports Custom Session Processing
-`Http` Component Adjusts Custom Session Handle Processing Return Value

### V3.1.10 (January 15, 2019)
------------
Rationality adjustment

- Modify the default values of some internal methods without affecting users

### V3.1.9 (January 15, 2019)
------------
Rationality adjustment

- Modify some code that does not follow PSR-2 to follow PSR-2
- Fix `Http`Component Path Error Problem

## V3.1.8 Refactoring Log Processing Classes! (January 12, 2019)
------------
Refactored log processing, no impact on most users, previous use of ** custom log class ** needs to be re-adapted

- Refactoring log processing
    - The log processing class no longer needs inheritance `\EasySwoole\Trace\Logger`
    - The log processing class now needs to be implemented `\EasySwoole\Trace\AbstractInterface\LoggerInterface`
- New configuration item `DISPLAY_ERROR'defaults to `false`. If you need Debug, set it to `true`.

### V3.1.7 (11 January 2019)
------------
Problem of unsuitable execution when adapting `Task` delivery closures

- Problem of unsuitable execution when adapting `Task` delivery closures

### V3.1.6 (January 10, 2019)
------------
Adapt `Swoole 4.1.12`, turn on the callback support of onTask, add flag parameters to abstract task template.

- Adapt `Swoole 4.1.12`
- Supporting the `onTask` callback of the protocol (** Users who have upgraded the new version should pay attention to the adaptation **)
- Add `flag` parameter to abstract task template

### V3.1.5 (7 January 2019)
------------
Fixed the problem that `onMessage` events could not be registered properly

### V3.1.4 (7 January 2019)
------------
Added Global Events`onPacket` `onMessage`
Automatic Cleaning of New Master Service Context `onRequest` `onMessage` `onReceive` `onPacket`

- Added Global Events:
    - `onPacket`
    - `onMessage`
- Automatic Cleaning of New Master Service Context：
    - `onRequest`
    - `onMessage`
    - `onReceive`
    - `onPacket`

### V3.1.3 (January 3, 2019)
------------
Fix the type of errors when creating services

- Fix the type of errors when creating services

### V3.1.2 (January 1, 2019)
------------
This version modifies configuration file suffixes and service type constants

- The configuration file is composed of `dev.env` and `produce.env` modify `dev.php` and `produce.php`
- Original configuration file MYSQL.host = 127.0.0.1  `.` modify MYSQL => ['host' => '127.0.0.1']
- Former service pattern constants `SERVER` `WEB_SERVER` `WEB_SOCKET_SERVER` modify `EASYSWOOLE_SERVER`  `EASYSWOOLE_WEB_SERVER` `EASYSWOOLE_SOCKET_SERVER`

## V3.1.1 Large version upgrade! (December 27, 2018)
------------
Full removal of built-in `AbstractProcess` 、 `Timer` 、 `FastCache` 、`Actor` Change to a stand-alone component library implementation。  
If you use the above components in your project, you can modify the dependency branch to `^ 3.0'(note): previously `3.x-dev'.
Upgrade documentation will be provided later.

- Remove `AbstractProcess`
- Remove `Timer`
- Remove `FastCache`
- Remove `Actor`
- Added `FastCache` Component Warehouse Address: [FastCache](https://github.com/easy-swoole/fast-cache)
- Added `Actor` Component Warehouse Address: [Actor](https://github.com/easy-swoole/actor)
- `Component` Added `Process` class Warehouse Address:[Component-Process](https://github.com/easy-swoole/component/tree/master/src/Process)
- `Component` Added `Timer` class Warehouse Address:[Component-Timer](https://github.com/easy-swoole/component/blob/master/src/Timer.php)

### V3.0.11 (December 27, 2018)
------------
`fastCache` add `onStart` `tickCall` `onShutdown` ,Facilitate data landing

- `fastCache` add `onStart` `tickCall` `onShutdown` ,Facilitate data landing
- bug fix

### V3.0.10 (December 24, 2018)
------------
New `actor` component `exist` method can exit by itself

- `actor` Added `exit` Method Can Exit by itself
- Optimizing configuration item reading
- Rationality adjustment

### V3.0.9 (December 17, 2018)
------------
Several bugs and issues related to `FastCache` components have been fixed.

- The key assignment transformation mode was adjusted to avoid a non-well formed numeric value encountered error in extreme cases.
- bug fix
- Rationality adjustment

### V3.0.8 (09 December 2018)
------------
The `FastCache` component was added to allow variables to be shared across processes, and the `isDev` method was added to the Core class to check the current allowable environment.

- Added component `FastCache` ，([Detailed documentation](SystemComponent/FastCache.html))
- Added component `isDev` Judging Current Operating Environment
- `console` Modify the default port to 9500
- Rationality adjustment

### V3.0.7 (19 November 2018)
------------
Add `Crontab`component, optimize Task asynchronous task and support closure, fix HTTP global exception handler can not handle global exception problem and ** configuration file name modification **

- Add `Crontab` component
- `Task` Supports Delivery Closures
- `console` default port changed to 9500
- ** Abandon `swoole_serialize` for compatibility with php7.3**
- ** Fix HTTP Global Exception Processor Failure to Handle Global Exception Problem**
- ** MAIN_SERVER.HOST and CONSOLE.HOST renamed LISTEN_ADDRESS**

### V3.0.6 (November 02, 2018)
------------
A command line table creator has been added, as well as a large number of reasonable changes to facilitate developers.
- Added Command Line Table Creator
- Improving command line help prompt information
- ** Fixed the problem of unable to read produce.env**

### V3.0.5 (October 26, 2018)
------------
A new remote console function has been added and bugs in the previous version have been fixed.
- Added Management Window
- Allow Console Leader Connection
- Added Console Management and Console Log Push
- New Dynamic Configuration
