# 入门教程

## 关于版权
以上视频由EasySwoole开发组共同录制，版权归EasySwoole开源组织共有，任何人未经许可禁止转载。本入门教学视频纯属公益，如有错误或者瑕疵，欢迎指出。

## CDN赞助
EasySwoole目前为非盈利组织，若您觉得EasySwoole的视频教程对您有帮助，期待您共享一点力量，帮助我们减少CDN费用支出压力。[捐赠链接](./../donate.md)

## 安装

### 第一节 安装swoole 约 5分钟
1. 使用一台腾讯云 Cenos7.4 机器 已经装好了LNMP 大概阐述下当前环境
2. 通过github访问swoole项目仓库  然后选择最新4.3 or 4.4  下载
3. 利用yum 安装swoole相关依赖
4. 编译安装swoole 并且启用 openssl socket 以及指定php config路径
5. 添加swoole.so到php.ini 并 使用php --ri swoole 检查
   
> 观看地址:[Swoole4.x安装](https://www.easyswoole.com/play_video.html?video=aHR0cHM6Ly9lYXN5c3dvb2xlLm9zcy1jbi1zaGVuemhlbi5hbGl5dW5jcy5jb20vJUU1JTg1JUE1JUU5JTk3JUE4JUU2JTk1JTk5JUU3JUE4JThCMS8lRTUlQUUlODklRTglQTMlODVzd29vbGUubXA0)
   
### 第二节 安装composer 并且配置国内镜像 约 3分钟
1. 下载composer
2. 配置国内镜像
      
> 观看地址:[Composer镜像更换](https://www.easyswoole.com/play_video.html?video=aHR0cHM6Ly9lYXN5c3dvb2xlLm9zcy1jbi1zaGVuemhlbi5hbGl5dW5jcy5jb20vJUU1JTg1JUE1JUU5JTk3JUE4JUU2JTk1JTk5JUU3JUE4JThCMS8lRTUlQUUlODklRTglQTMlODVjb21wb3NlciVFNSVCOSVCNiVFOSU4NSU4RCVFNyVCRCVBRSVFNSU5QiVCRCVFNSU4NiU4NSVFOSU5NSU5QyVFNSU4MyU4Ri5tcDQ=)


### 第三节 安装EasySwoole3 约 5分钟
1. 在期望目录建立项目 并使用composer require 安装EasySwoole3
2. 删除上步目录 使用composer.json 进行手动配置安装 并讲解 composer版本追踪
3. 执行 EasySwoole安装程序 
4. 运行EasySwoole 并使用浏览器访问
      
> 观看地址:[EasySwoole安装](https://www.easyswoole.com/play_video.html?video=aHR0cHM6Ly9lYXN5c3dvb2xlLm9zcy1jbi1zaGVuemhlbi5hbGl5dW5jcy5jb20vJUU1JTg1JUE1JUU5JTk3JUE4JUU2JTk1JTk5JUU3JUE4JThCMS8lRTUlQUUlODklRTglQTMlODVFYXN5U3dvb2xlLm1wNA==)


### 第四节 安装EasySwoole Mysqli 等扩展包 约2分钟
1. 使用 composer require 安装 Mysqli
2. 使用 编辑 composer.json + update 安装Utility
3. 简单教学如何找EasySwoole维护的官方composer包 (通过 github 和 composer官网库)
      
> 观看地址:暂无


## Http部分

### 第一节 基本路由 约 5分钟
1. 使用EasySwoole自带的路由解析规则尝试进行访问
2. 使用 FastRoute 并尝试访问
3. 配置 `强制路由` 、`setMethodNotAllowCallBack` 、`setRouterNotFoundCallBack` 
         
> [HTTP解析与路由](https://www.easyswoole.com/play_video.html?video=aHR0cHM6Ly9lYXN5c3dvb2xlLm9zcy1jbi1zaGVuemhlbi5hbGl5dW5jcy5jb20vJUU1JTg1JUE1JUU5JTk3JUE4JUU2JTk1JTk5JUU3JUE4JThCMS9FYXN5U3dvb2xlSHR0cCVFOCVBNyVBMyVFNiU5RSU5MCVFNSU5MiU4QyVFOCVCNyVBRiVFNyU5NCVCMSVFNyVBRSU4MCVFNCVCQiU4Qi5tcDQ=)


### 第二节 控制器特性 以及常用方法 约 10分钟
1. 简单介绍 EasySwoole的请求运行过程 从客户端->nginx->server 从Event的onRequest->http dispatch->controller hook->controller onRequest -> 具体执行 -> controller Response -> gc 和onException，这个部分会配图我自己绘一个
2. 介绍controller的池特性以及静态变量，变量生命周期等
3. 介绍一些常用方法 尤其介绍请求数据的获取 如form-data raw header params 等等 以及响应数据的一些基本知识 如json 重定向 等等
         
> 观看地址:[对象简介和池模型介绍](https://www.easyswoole.com/play_video.html?video=aHR0cHM6Ly9lYXN5c3dvb2xlLm9zcy1jbi1zaGVuemhlbi5hbGl5dW5jcy5jb20vJUU1JTg1JUE1JUU5JTk3JUE4JUU2JTk1JTk5JUU3JUE4JThCMS9FYXN5U3dvb2xlQ29udHJvbGxlciVFNSVBRiVCOSVFOCVCMSVBMSVFNyVBRSU4MCVFNCVCQiU4QiVFNSU5MiU4QyVFNiVCMSVBMCVFNiVBOCVBMSVFNSU5RSU4QiVFNCVCQiU4QiVFNyVCQiU4RC5tcDQ=)


### 第三节 异常处理 约3分钟
1. 介绍EasySwoole全局异常处理及接管 和自定义异常处理 Di注入
2. 介绍HttpController onException 

## 数据库部分

### 连接池的介绍 配置 及使用 约10分钟
1. 介绍为什么需要连接池， 简单阐述 同步阻塞和 非阻塞会产生的问题 以及数据库压力 服务器熔断知识
2. 配置连接池并且简单讲解 invoke 和defer的区别 和使用场景
3. 在controller 写一个操作数据库的demo  分别使用 直接new mysqli invoke 和defer
   
### 模型封装 约5分钟
1. 手动封装model 以及强调 mysql连接的问题 
2. 在controller 使用模型进行操作数据库

### Bean的介绍和使用 约5分钟
1. 简单介绍 Bean 和数据对象的概念 以及 array的问题
2. 写一个 Bean的demo 介绍一些常用的方法
3. 配合model 在controller进行操作 数据库
   
### 事务使用和注意点 约10分钟
1. 再次阐述 事务和mysql 连接的问题
2. 在controller写一个事务操作 并进行回滚，并且写一个反例 使用多连接事务 导致事务操作失败的例子
3. 强调mysqli 目前不支持事务嵌套
4. 简述tp orm不安全的问题 以及ez的仿tp库的简单介绍（注 还是推荐mysqli)
   
## 其他额外部分

### 并发查询 约 5分钟
1. 如何利用 Channel 进行并发查询 （这部分考虑放到后期做)
   
### http上传 约5分钟
1. 简单阐述http 上传以及 request 对象获取uploadFile对象
2. 利用Utility库进行文件类型验证
3. nginx swoole 上传大小限制 带宽 超时 等科普类介绍 （不做具体demo）

### 异步任务 约10分钟
1. 简单讲一下异步任务的处理方式(task进程等)
2. 写一个异步任务投递的demo 包括闭包和模板

### 自定义进程 约10分钟
1. 简单用EasySwoole的包写个消费者进程


## 其他视频
- [CSP编程](https://easyswoole.oss-cn-shenzhen.aliyuncs.com/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B1/%E5%85%A5%E9%97%A8csp.mov)

- [php-fpm进程模型](https://www.easyswoole.com/play_video.html?video=aHR0cHM6Ly9lYXN5c3dvb2xlLm9zcy1jbi1zaGVuemhlbi5hbGl5dW5jcy5jb20vJUU1JTg1JUE1JUU5JTk3JUE4JUU2JTk1JTk5JUU3JUE4JThCMS9waHAtZnBtJUU0JUJCJThCJUU3JUJCJThELm1wNA==)

- [php多进程模型介绍(WorkMan作者公开的pdf)](https://easyswoole.oss-cn-shenzhen.aliyuncs.com/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B1/php%E5%A4%9A%E8%BF%9B%E7%A8%8B%E6%A8%A1%E5%9E%8B.pdf)
  
- [Swoole变量生命周期](https://www.easyswoole.com/play_video.html?video=aHR0cHM6Ly9lYXN5c3dvb2xlLm9zcy1jbi1zaGVuemhlbi5hbGl5dW5jcy5jb20vJUU1JTg1JUE1JUU5JTk3JUE4JUU2JTk1JTk5JUU3JUE4JThCMS9zd29vbGUlRTUlOEYlOTglRTklODclOEYlRTclOTQlOUYlRTUlOTElQkQlRTUlOTElQTglRTYlOUMlOUYubXA0)
  
- [Swoole进程模型](https://www.easyswoole.com/play_video.html?video=aHR0cHM6Ly9lYXN5c3dvb2xlLm9zcy1jbi1zaGVuemhlbi5hbGl5dW5jcy5jb20vJUU1JTg1JUE1JUU5JTk3JUE4JUU2JTk1JTk5JUU3JUE4JThCMS9zd29vbGUlRTclOUElODQlRTclQUUlODAlRTQlQkIlOEIlRTUlOTIlOEMlRTglQkYlOUIlRTclQTglOEIlRTYlQTglQTElRTUlOUUlOEJ+MS5tcDQ=)
  
