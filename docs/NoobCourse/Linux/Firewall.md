## 防火墙
当你开启一个tcp服务,却发现访问不了,那么你得考虑下是否是防火墙拦截了,  
目前,最常见的拦截有以下几种情况:
 * 服务器本机防火墙拦截
 * 服务器供应商拦截(阿里云,腾讯云安全组)

服务器本机拦截,可通过防火墙管理软件,开端口,或者直接关闭防火墙进行解决(不建议):
例如centos 7下,防火墙管理软件为firewalld.
基础命令为:
```
systemctl start firewalld;#启动
systemctl stop firewalld;#停止
systemctl status firewalld;#查看状态
systemctl disable firewalld;#开机禁用
systemctl enable firewalld;#开启启动
firewall-cmd --zone=public --add-port=80/tcp --permanent #开放80/tcp端口  （--permanent永久生效，没有此参数重启后失效）;
firewall-cmd --reload;#
firewall-cmd --zone= public --query-port=80/tcp;#查看80/tcp端口
firewall-cmd --zone= public --remove-port=80/tcp --permanent;#删除该端口开放
```





