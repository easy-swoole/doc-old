---
title: 配置文件
meta:
  - name: description
    content: EasySwoole hello world开发示例
  - name: keywords
    content: easyswoole|swoole 扩展|swoole框架|php协程框架
---

# Hello World

在项目根目录下创建如下的目录结构，这个目录是编写业务逻辑的应用目录，编辑 `Index.php` 文件，添加基础控制器的代码

::: tip
注意，安装后不会自动生成目录（这跟传统框架不同），需要创建并且加入composer加载配置才能生效，请耐心看完本篇内容
:::

```
project              项目部署目录
----------------------------------
├─App        应用目录
│  └─HttpController      应用的控制器目录
│     └─Index.php    默认控制器文件
----------------------------------
```

```php
<?php
namespace App\HttpController;


use EasySwoole\Http\AbstractInterface\Controller;

class Index extends Controller
{

    function index()
    {
        // TODO: Implement index() method.
        $this->response()->write('hello world');
    }
}
```
然后编辑根目录下的 composer.json 文件，注册应用的命名空间

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "App/"
        }
    },
    "require": {
        "easyswoole/easyswoole": "3.x"
    }
}
```


::: warning 
 实际上就是注册App的名称空间
:::

最后执行 `composer dumpautoload` 命令更新命名空间，框架已经可以自动加载 **App** 目录下的文件了，此时框架已经安装完毕，可以开始编写业务逻辑

```bash
# 更新命名空间映射
composer dumpautoload
# 启动框架
php easyswoole start
```
启动框架后，访问 `http://localhost:9501`即可看到 Hello World 。

## 关于IDE助手

由于 Swoole 的函数并不是PHP标准函数，IDE无法进行自动补全，为了方便开发，可以执行以下命令引入IDE助手，在IDE下即可自动补全 Swoole 相关的函数

```bash
composer require easyswoole/swoole-ide-helper
```

## 目录结构

**EasySwoole** 的目录结构是非常灵活的，基本上可以任意定制，没有太多的约束，但是仍然建议遵循下面的目录结构，方便开发

```
project                   项目部署目录
├─App                     应用目录(可以有多个)
│  ├─HttpController       控制器目录
│  │  └─Index.php         默认控制器
│  └─Model                模型文件目录
├─Log                     日志文件目录
├─Temp                    临时文件目录
├─vendor                  第三方类库目录
├─composer.json           Composer架构
├─composer.lock           Composer锁定
├─EasySwooleEvent.php     框架全局事件
├─easyswoole              框架管理脚本
├─dev.php                 开发配置文件
├─produce.php             生产配置文件
```


::: warning 
 如果项目还需要使用其他的静态资源文件，建议使用 **Nginx** / **Apache** 作为前端Web服务，将请求转发至 easySwoole 进行处理，并添加一个 `Public` 目录作为Web服务器的根目录
:::


::: warning 
 注意!请不要将框架主目录作为web服务器的根目录,否则dev.php,produce.php等根目录文件配置将会是可访问的,也可自行排除重要文件
:::