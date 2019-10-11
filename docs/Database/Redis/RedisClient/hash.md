---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现
  - name: keywords
    content:  EasySwoole redis| Swoole redis协程客户端
---
## 键操作方法
方法列表

| 方法名称     | 参数                     | 说明                  | 备注 |
|:-------------|:-------------------------|:---------------------|:----|
| hDel         | $key, ...$field          | 删除键,可多个          |     |
| hExists      | $key, $field             | 查询字段是否存在       |     |
| hGet         | $key, $field             | 获取一个字段值         |     |
| hGetAll      | $key                     | 获取这个key的全部字段值 |     |
| hSet         | $key, $field, $value     | 删除一个键            |     |
| hValS        | $key                     | 删除一个键            |     |
| hKeys        | $key                     | 删除一个键            |     |
| hLen         | $key                     | 删除一个键            |     |
| hMGet        | $key, $hashKeys          | 删除一个键            |     |
| hMSet        | $key, $data              | 删除一个键            |     |
| hIncrBy      | $key, $field, $increment | 删除一个键            |     |
| hIncrByFloat | $key, $field, $increment | 删除一个键            |     |
| hSetNx       | $key, $field, $value     | 删除一个键            |     |


## 实例
```php


```