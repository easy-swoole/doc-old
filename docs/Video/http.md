---
title: 视频HTTP教程
meta:
  - name: description
    content: EasySwoole为广大新手用户专门录制了免费、开放的系列视频
  - name: keywords
    content: easyswoole|免费视频|php教学视频
---

## 关于版权
以上视频由EasySwoole开发组共同录制，版权归EasySwoole开源组织共有，任何人未经许可禁止转载。本入门教学视频纯属公益，如有错误或者瑕疵，欢迎指出。若您觉得视频对您有帮助，赞助将用以OSS存储费用支出。[捐赠链接](./../donate.md)

## CDN赞助
本视频CDN赞助由 [verycloud](https://www.verycloud.cn/) 提供



# HTTP教程

### 第一节 基本路由 约 5分钟
1. 使用EasySwoole自带的路由解析规则尝试进行访问
2. 使用 FastRoute 并尝试访问
3. 配置 `强制路由` 、`setMethodNotAllowCallBack` 、`setRouterNotFoundCallBack` 
         

::: warning 
 [HTTP解析与路由](https://www.easyswoole.com/playVideo.html?video=aHR0cDovL3ZpZGVvLW9zcy5lYXN5c3dvb2xlLmNvbS8lRTUlODUlQTUlRTklOTclQTglRTYlOTUlOTklRTclQTglOEIxL0Vhc3lTd29vbGVIdHRwJUU4JUE3JUEzJUU2JTlFJTkwJUU1JTkyJThDJUU4JUI3JUFGJUU3JTk0JUIxJUU3JUFFJTgwJUU0JUJCJThCLm1wNA==)
:::


### 第二节 控制器特性 以及常用方法 约 10分钟
1. 简单介绍 EasySwoole的请求运行过程 从客户端->nginx->server 从Event的onRequest->http dispatch->controller hook->controller onRequest -> 具体执行 -> controller Response -> gc 和onException，这个部分会配图我自己绘一个
2. 介绍controller的池特性以及静态变量，变量生命周期等
3. 介绍一些常用方法 尤其介绍请求数据的获取 如form-data raw header params 等等 以及响应数据的一些基本知识 如json 重定向 等等
         

::: warning 
 观看地址:[对象简介和池模型介绍](https://www.easyswoole.com/playVideo.html?video=aHR0cDovL3ZpZGVvLW9zcy5lYXN5c3dvb2xlLmNvbS8lRTUlODUlQTUlRTklOTclQTglRTYlOTUlOTklRTclQTglOEIxL0Vhc3lTd29vbGVDb250cm9sbGVyJUU1JUFGJUI5JUU4JUIxJUExJUU3JUFFJTgwJUU0JUJCJThCJUU1JTkyJThDJUU2JUIxJUEwJUU2JUE4JUExJUU1JTlFJThCJUU0JUJCJThCJUU3JUJCJThELm1wNA==)
:::

### [第三节 异常处理 约13分钟](http://video-oss.easyswoole.com/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B1/HTTP%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86.mp4)
1. 介绍EasySwoole全局异常处理及接管 和自定义异常处理 Di注入
2. 介绍HttpController onException 
