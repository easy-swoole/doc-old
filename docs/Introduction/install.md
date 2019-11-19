---
title: 配置文件
meta:
  - name: description
    content: EasySwoole 安装，Composer安装EasySwoole，swoole快速入门
  - name: keywords
    content: easyswoole|swoole 扩展|swoole框架|php协程框架
---


# 框架安装


- [GitHub](https://github.com/easy-swoole/easyswoole)  喜欢记得给我们点个 ***star***
- [GitHub for Doc](https://github.com/easy-swoole/doc)

::: danger 
注意事项，请看完再进行安装
:::

- 框架使用 `Composer` 作为依赖管理工具，在开始安装框架前，请确保已经按上一章节的要求配置好环境并安装好了`Composer` 工具
- 关于 Composer 的安装可以参照 [Composer中国全量镜像](https://pkg.phpcomposer.com/#how-to-install-composer) 的安装教程
- 目前推荐的镜像为阿里云或者梯子拉取源站
- 在安装过程中，会释放框架的文件到项目目录，请保证项目目录有可写入权限
- 安装完成之后，不会自动生成App目录，请自行根据Hello World章节配置
- 不可把虚拟机共享目录作为安装目录，否则会因为权限不足无法创建socket，产生报错：`listen xxxxxx.sock fail `
- 共享目录产生以上报错，手动在dev.php配置文件里把Temp目录改为其他路径即可


## 切换阿里云镜像
````
composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/
````
## Composer 安装

按下面的步骤进行手动安装

(建议使用)
```bash
composer require easyswoole/easyswoole=3.x
php vendor/easyswoole/easyswoole/bin/easyswoole install
```


或者(可能出错)
```bash
composer require easyswoole/easyswoole=3.x
php vendor/bin/easyswoole install
```

```bash
  php vendor/easyswoole/easyswoole/bin/easyswoole install
  ______                          _____                              _        
 |  ____|                        / ____|                            | |       
 | |__      __ _   ___   _   _  | (___   __      __   ___     ___   | |   ___ 
 |  __|    / _` | / __| | | | |  \___ \  \ \ /\ / /  / _ \   / _ \  | |  / _ \
 | |____  | (_| | \__ \ | |_| |  ____) |  \ V  V /  | (_) | | (_) | | | |  __/
 |______|  \__,_| |___/  \__, | |_____/    \_/\_/    \___/   \___/  |_|  \___|
                          __/ |                                                
                         |___/                                                
  EasySwooleEvent.php has already existed. do you want to replace it? [ Y/N (default) ] : n
  index.php has already existed. do you want to replace it? [ Y/N (default) ] : n
  dev.php has already existed. do you want to replace it? [ Y/N (default) ] : n
  produce.php has already existed. do you want to replace it? [ Y/N (default) ] : n
```

::: danger 
新版安装注意事项
:::
- 新版的easyswoole安装会默认提供App命名空间，还有index控制器
- 在这里面需要填写n，不需要覆盖，已经有的 EasySwooleEvent.php，index.php dev.php produce.php
- 当提示exec函数被禁用时,请自己手动执行 `composer dump-autoload` 命令更新命名空间
## 启动框架

中途没有报错的话，执行：
```bash
# 启动框架
php easyswoole start
```
此时可以访问 `http://localhost:9501` 看到框架的欢迎页面，表示框架已经安装成功


## Docker

[Easyswoole官方docker](docker.md)


::: warning 
 docker 知识请自行学习q
:::

## 其他

- QQ交流群
    - VIP群 579434607 （本群需要付费599元）
    - EasySwoole官方一群 633921431(已满)
    - EasySwoole官方二群 709134628
    
- 商业支持：
    - QQ 291323003
    - EMAIL admin@fosuss.com
        
- 作者微信

     ![](/resources/authWx.png)
    
- [捐赠](../Preface/donation.md)
    您的捐赠是对Swoole项目开发组最大的鼓励和支持。我们会坚持开发维护下去。 您的捐赠将被用于:
        
  - 持续和深入地开发
  - 文档和社区的建设和维护

<script>
  export default {
    mounted () {
        if(localStorage.getItem('isNew') != 1){
            localStorage.setItem('isNew',1);
            layer.confirm('是否给EasySwoole点个赞',function (index) {
                 layer.msg('感谢您的支持');
                     setTimeout(function () {
                         window.open('https://github.com/easy-swoole/easyswoole');
                  },1500);
             });              
        }
    }
  }
</script>
  