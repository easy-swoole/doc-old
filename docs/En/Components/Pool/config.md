---
title: Connection pool configuration
meta:
  - name: description
    content: Connection pool configuration
  - name: keywords
    content: swoole|swoole extension|swoole framework|Connection pool configuration
---

## Connection pool configuration
When instantiating a connection pool object, you need to pass in a connection pool configuration object `EasySwoole\Pool\Config`. The properties of the object are as follows:

| Configuration Item | Default | Description | Notes |
|:-------------------|:--------|:------------------------|:------------------------------------------------------|
| $intervalCheckTime | 30*1000 | Timer Execution Frequency | Used to periodically perform connection pool object reclamation, create operations |
| $maxIdleTime       | 15       | Connection pool object maximum idle time (seconds)        | Objects that are not used beyond this time will be reclaimed by the timer |
| $maxObjectNum      | 20       | Maximum number of connection pools                        | Each process creates up to $maxObjectNum connection pool objects, or nulls if the objects are in use, or wait for connections to be idle |
| $minObjectNum     | 5         | Minimum number of connection pools (hot start)            | When the total number of connection pool objects is less than $minObjectNum, the connection is automatically created, keeping the connection active and allowing the controller to get the connection as soon as possible |
$getObjectTimeout   | 3.0       | Get the connection pool timeout                           | When the connection pool is empty, it will wait for $getObjectTimeout seconds, if there is a connection idle, the connection object will be returned, otherwise return null |
| $extraConf        |           | Additional Configuration Information                      | Before you instantiate a connection pool, you can put some extra configuration here, such as database configuration information, redis configuration, etc. |

