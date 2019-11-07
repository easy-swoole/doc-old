# EasySwoole版本更新记录
## 3.2.x旧文档地址

https://github.com/easy-swoole/doc/tree/3.x-old

## V3.3.0-dev(2019年8月15)
------------
- 更新异步任务实现为Task组件实现
- 更新CronTab任务适配为Task任务
老版本升级步骤：
- 配置项删除  MAIN_SERVER.SETTING.task_worker_num 与 MAIN_SERVER.SETTING.task_enable_coroutine
- 配置项新增 MAIN_SERVER.TASK ,默认值为```['workerNum'=>4,'maxRunningNum'=>128,'timeout'=>15]```
- 注意EasySwoole的Temp目录不在虚拟机与宿主机共享目录下，否则会导致没有权限创建UnixSocket链接

- [异步任务适配](../Components/task.md)
- [CronTab任务适配](../BaseUsage/crontab.md)

## V3.2.6 (2019年7月31日)
------------

- 支持 swoole 4.4.0
  - 强制要求swoole版本不低于4.4.0


## V3.2.5 (2019年7月15日)
------------
  
- 支持修改配置项存储驱动，默认为swoole table，可以修改动态配置
- 支持bootstrap，在外部做最高一层级的hook 
- 默认支持phpunit


## V3.2.1 (2019年4月22日)
------------

- 默认配置调整
  - 启用 `max_wait_time` [详情参见](https://wiki.swoole.com/wiki/page/1082.html)
- 修复 `Console Client` 问题

## V3.1.19 (2019年4月15日)
------------

- 主框架不再强制依赖 `Actor` 组件和 `Process` 组件，有需要可以单独引入并在 `mainServerCreate` 事件中自行创建
- 默认配置调整
  - `Task` 进程强制开启协程
  - 去除 `max_request` 和 `task_max_request` 设置
  - 启用异步安全重启配置 `reload_async` [详情参见](https://wiki.swoole.com/wiki/page/791.html)
- 新增一个命令行辅助提示

## V3.1.18 (2019年3月11日)
------------

- HttpController 池默认数量从单进程 `15` 提升至 `500`
- 修复Console默认用户名和密码为空时无法正常启动的问题
- Console 配置 `Host` 参数名修改为  `LISTEN_ADDRESS`

## V3.1.17 (2019年3月9日)
------------
稳定性更新

- 修复了Console相关bug

## V3.1.16 (2019年3月8日)
------------
Console组件不再是核心组件，现在他是一个独立的composer包

- 发布Console组件 [GitHub](https://github.com/easy-swoole/console)
	- Console 从核心组件移出

## V3.1.15 (2019年2月25日)
------------
适配 swoole 4.2.13

- 支持 swoole 4.2.13
    - 根据swoole底层api变动进行了适配
	- 强制要求swoole版本不低于 4.2.13

## V3.1.14 (2019年1月29日)
------------
重构控制台

- 重构控制台
    - 优化了reload 和stop 命令
	- 调整了reload时间类型
	- 修复了produce load 时错误加载配置的问题
    
## V3.1.13 (2019年1月22日)
------------
合理性调整

- 合理性调整，为cli单元测试做准备

## V3.1.12 (2019年1月21日)
------------
合理性调整， 增加控制台权限配置

- 新增控制台权限分配

## V3.1.11 (2019年1月18日)
------------
新增 `FastCache` 配置项， 重构控制台，增加用户自定义session处理

- 新增 `FastCache` 配置项
- 重构控制台，要求强制设置用户鉴权，支持多用户登陆
- `Http` 组件支持自定义session处理
- `Http` 组件调整自定义sessionHandle处理返回值

## V3.1.10 (2019年1月15日)
------------
合理性调整

- 修改部分内部方法默认值，不影响用户

## V3.1.9 (2019年1月15日)
------------
合理性调整

- 将部分未遵循PSR-2的代码修改遵循PSR-2
- 修复 `Http` 组件路径错误问题

## V3.1.8 重构日志处理类! (2019年1月12日)
------------
重构了日志处理，对大部分用户无影响，之前使用了 **自定义日志类** 的需要重新适配

- 重构日志处理
    - 日志处理类不再需要继承 `\EasySwoole\Trace\Logger`
    - 日志处理类现在需要实现 `\EasySwoole\Trace\AbstractInterface\LoggerInterface`
- 新增配置项 `DISPLAY_ERROR` 默认 `false`， 如果需要Debug的用户 请设置为 `true`

## V3.1.7 (2019年1月11日)
------------
适配 `Task` 投递闭包时无法正常执行的问题

- 适配 `Task` 投递闭包时无法正常执行的问题

## V3.1.6 (2019年1月10日)
------------
适配 `Swoole 4.1.12`，  开启协程后onTask的回调支持，抽象任务模板新增flag参数。

- 适配 `Swoole 4.1.12`
- 支持协程 `onTask` 回调 (**有升级新版本的用户请注意适配**)
- 抽象任务模板新增 `flag` 参数

## V3.1.5 (2019年1月7日)
------------
修复 `onMessage` 事件无法正常注册的问题

## V3.1.4 (2019年1月7日)
------------
新增全局事件`onPacket` `onMessage`
新增主服务上下文自动清理 `onRequest` `onMessage` `onReceive` `onPacket`

- 新增全局事件:
    - `onPacket`
    - `onMessage`
- 新增主服务上下文自动清理：
    - `onRequest`
    - `onMessage`
    - `onReceive`
    - `onPacket`

## V3.1.3 (2019年1月3日)
------------
修复创建服务时错误的类型问题

- 修复创建服务时错误的类型问题

## V3.1.2 (2019年1月1日)
------------
此版本修改了配置文件后缀和服务类型常量

- 配置文件由 `dev.env` 和 `produce.env` 改为 `dev.php` 和 `produce.php`
- 原配置文件 MYSQL.host = 127.0.0.1 的 `.` 连接格式修改为 MYSQL => ['host' => '127.0.0.1'] 的数组模式
- 原服务模式常量 `SERVER` `WEB_SERVER` `WEB_SOCKET_SERVER` 修改为 `EASYSWOOLE_SERVER`  `EASYSWOOLE_WEB_SERVER` `EASYSWOOLE_SOCKET_SERVER`

## V3.1.1 大版本升级! (2018年12月27日)
------------
全面移除了内置 `AbstractProcess` 、 `Timer` 、 `FastCache` 、`Actor` 改为独立组件库实现。  
如果在项目中使用了以上组件，可以将依赖分支修改为 `^3.0` (注): 之前为 `3.x-dev`。  
后续会提供升级文档

- 移除 `AbstractProcess`
- 移除 `Timer`
- 移除 `FastCache`
- 移除 `Actor`
- 新增组件 `FastCache` 仓库地址: [FastCache](https://github.com/easy-swoole/fast-cache)
- 新增组件 `Actor` 仓库地址: [Actor](https://github.com/easy-swoole/actor)
- `Component` 组件新增 `Process` 类 仓库地址:[Component-Process](https://github.com/easy-swoole/component/tree/master/src/Process)
- `Component` 组件新增 `Timer` 类 仓库地址:[Component-Timer](https://github.com/easy-swoole/component/blob/master/src/Timer.php)
