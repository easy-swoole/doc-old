# 全局事件

> 参考不同的Demo分支event写法: [demo分支](https://github.com/easy-swoole/demo/branches)

EasySwoole有五个全局事件，全部位于框架安装后生成的EasySwooleEvent.php中。  

- initialize 框架初始化事件
- mainServerCreate 主服务创建事件
- onRequest Http请求事件
- afterRequest Http响应后事件
