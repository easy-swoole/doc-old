---
title: 关键词检测
meta:
  - name: description
    content: Easyswoole提供了一个基于字典树算法的关键词检测组件
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole,关键词,关键词检测
---

# 压测结果
对此组件分别进行1.5万、13万等级的词库测试，服务默认开启3个进程。
::: warning 
仅做参考，具体还以线上验证
:::

### 电脑配置
```
MacBook Air (13-inch, 2017)
处理器 1.8 GHz Intel Core i5
内存 8 GB 1600 MHz DDR3
```

### 1.5万词

##### 并发1总请求数10

```
Concurrency Level:      1
Time taken for tests:   0.014 seconds
Complete requests:      10
Failed requests:        0
Non-2xx responses:      10
Total transferred:      1730 bytes
HTML transferred:       260 bytes
Requests per second:    700.82 [#/sec] (mean)
Time per request:       1.427 [ms] (mean)
Time per request:       1.427 [ms] (mean, across all concurrent requests)
Transfer rate:          118.40 [Kbytes/sec] received
```

##### 并发10总请求数100

```
10 100
Concurrency Level:      10
Time taken for tests:   0.067 seconds
Complete requests:      100
Failed requests:        0
Non-2xx responses:      100
Total transferred:      17300 bytes
HTML transferred:       2600 bytes
Requests per second:    1492.49 [#/sec] (mean)
Time per request:       6.700 [ms] (mean)
Time per request:       0.670 [ms] (mean, across all concurrent requests)
Transfer rate:          252.15 [Kbytes/sec] received
```

##### 并发100总请求数1000

```
Concurrency Level:      100
Time taken for tests:   0.239 seconds
Complete requests:      1000
Failed requests:        0
Non-2xx responses:      1000
Total transferred:      173000 bytes
HTML transferred:       26000 bytes
Requests per second:    4189.17 [#/sec] (mean)
Time per request:       23.871 [ms] (mean)
Time per request:       0.239 [ms] (mean, across all concurrent requests)
Transfer rate:          707.74 [Kbytes/sec] received
```

### 13万词

##### 并发1总请求数10

```
Concurrency Level:      1
Time taken for tests:   0.014 seconds
Complete requests:      10
Failed requests:        0
Non-2xx responses:      10
Total transferred:      1730 bytes
HTML transferred:       260 bytes
Requests per second:    699.45 [#/sec] (mean)
Time per request:       1.430 [ms] (mean)
Time per request:       1.430 [ms] (mean, across all concurrent requests)
Transfer rate:          118.17 [Kbytes/sec] received
```

##### 并发10总请求数100

```
Concurrency Level:      10
Time taken for tests:   0.057 seconds
Complete requests:      100
Failed requests:        0
Non-2xx responses:      100
Total transferred:      17300 bytes
HTML transferred:       2600 bytes
Requests per second:    1751.71 [#/sec] (mean)
Time per request:       5.709 [ms] (mean)
Time per request:       0.571 [ms] (mean, across all concurrent requests)
Transfer rate:          295.94 [Kbytes/sec] received
```

##### 并发100总请求数1000

```
Concurrency Level:      100
Time taken for tests:   0.225 seconds
Complete requests:      1000
Failed requests:        0
Non-2xx responses:      1000
Total transferred:      173000 bytes
HTML transferred:       26000 bytes
Requests per second:    4444.84 [#/sec] (mean)
Time per request:       22.498 [ms] (mean)
Time per request:       0.225 [ms] (mean, across all concurrent requests)
Transfer rate:          750.93 [Kbytes/sec] received
```

