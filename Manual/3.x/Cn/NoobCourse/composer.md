## Composer
Composer 是 PHP5.3以上 的一个依赖管理工具。它允许你声明项目所依赖的代码库，它会在你的项目中为你安装他们。Composer 不是一个包管理器。是的，它涉及 "packages" 和 "libraries"，但它在每个项目的基础上进行管理，在你项目的某个目录中（例如 vendor）进行安装。默认情况下它不会在全局安装任何东西。因此，这仅仅是一个依赖管理。

>可以这么理解,composer是一个实现了自动加载的框架,它可以通过配置的声明,下载相应的依赖,代码库,并通过配置,使其能psr-4规范被正确的自动引入
>详细文档可查看composer文档:https://github.com/5-say/composer-doc-cn

### composer使用步骤
 * 安装composer
 * 创建composer项目,自动生成composer.json
 * 通过composer.json配置需要加载的代码库
 * 通过composer install下载代码库,依赖
 * 框架引入composer的autoload.php
 * 即可实现自动加载代码
 

### 常用命令
```
composer install;  #安装包,根据composer.json
composer update;   #更新包,升级composer.json的所有代码库(如果能升级的话)
composer search 关键字; #搜索包,搜索composer可用的包
composer require 包名称; #引入包,会在composer.json新增一条包配置,并下载该代码包 
composer remove 包名称; #删除包
composer dump-autoload;#生成当前命名空间与类库文件路径的一个映射，运行时加载会直接读取这个映射，加快文件的加载速度。
```


 