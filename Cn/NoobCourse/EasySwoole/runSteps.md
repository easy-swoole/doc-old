## EasySwoole运行步骤
EasySwoole的框架运行步骤大概为以下几步:

 * 从php easyswoole start开始,首先进行了目录常量定义,临时目录,日志目录定义,
 * 触发`initialize`,这个事件你可以进行一些服务注册,修改临时目录,日志目录等
 * 获取框架配置,监听ip,端口,worker进程数,子服务配置,回调等,准备开启swoole服务
 * 触发`mainServerCreate`,这个事件你可以自行重新配置监听ip,端口,回调事件,框架异常,等等
 * 框架根据配置,启动swoole服务,附带子服务(如果有配置的话)
  
到这个时候,框架已经是启动成功了,由于swoole_server的特性,开启之后会常驻内存(进程会一直运行,可以理解成一直在while(1){}),等待请求进入然后回调.  
 用户请求步骤:
 * 用户请求
 * swoole_server触发回调事件,经过框架解析
 * 触发 `onRequest`(http服务时),`onReceive`(tcp服务时)
 * 经过http组件的调度,调用控制器方法完毕
 * 触发 `afterRequest` 事件,表明这次请求已经要结束
 * es将响应数据交回给swoole_server,给客户端响应数据

