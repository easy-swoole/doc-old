---
title: EasySwoole通用连接池
meta:
  - name: description
    content: EasySwoole通用连接池,协程连接池,easyswoole连接池
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole|连接池|swoole 连接池|通用连接池
---

## 连接池配置
在实例化一个连接池对象时,需要传入一个连接池配置对象`EasySwoole\Pool\Config`,该对象的属性如下:

| 配置项             | 默认值  | 说明                    | 备注                                                                                  |
|:-------------------|:--------|:------------------------|:--------------------------------------------------------------------------------------|
| $intervalCheckTime | 30*1000 | 定时器执行频率           | 用于定时执行连接池对象回收,创建操作                                                       |
| $maxIdleTime       | 15      | 连接池对象最大闲置时间(秒) | 超过这个时间未使用的对象将会被定时器回收                                                  |
| $maxObjectNum      | 20      | 连接池最大数量           | 每个进程最多会创建$maxObjectNum连接池对象,如果对象都在使用,则会返回空,或者等待连接空闲        |
| $minObjectNum      | 5       | 连接池最小数量(热启动)    | 当连接池对象总数低于$minObjectNum时,会自动创建连接,保持连接的活跃性,让控制器能够尽快的获取连接 |
| $getObjectTimeout  | 3.0     | 获取连接池的超时时间      | 当连接池为空时,会等待$getObjectTimeout秒,如果期间有连接空闲,则会返回连接对象,否则返回null    |
| $extraConf         |         | 额外配置信息             | 在实例化连接池前,可把一些额外配置放到这里,例如数据库配置信息,redis配置等等                   |

