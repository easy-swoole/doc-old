---
title: Pressure measurement result
meta:
  - name: description
    content: Easyswoole Pressure measurement result
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole,Pressure measurement result
---

# Pressure measurement result
This component is tested with a lexicon of 15,000 and 130,000 levels, and the service starts with 3 processes by default.
::: warning
For reference only, specifically for online verification
:::

### Computer Configuration
```
MacBook Air (13-inch, 2017)
Processor 1.8 GHz Intel Core i5
Memory 8 GB 1600 MHz DDR3
```

### 1.5 million words

##### Concurrent 1 total requests 10

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

##### Concurrent 10 total requests 100

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

##### Concurrent 100 total requests 1000

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

### 130,000 words

##### Concurrent 1 total requests 10

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

##### Concurrent 10 total requests 100

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

##### Concurrent 100 total requests 1000

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

