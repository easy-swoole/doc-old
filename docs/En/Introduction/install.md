---
title: Frame installation
meta:
  - name: description
    content: EasySwoole installation, Composer installation EasySwoole, swoole quick start
  - name: keywords
    content: Easyswoole|swoole extension|swoole framework|php coroutine framework
---




# Frame installation


- [GitHub](https://github.com/easy-swoole/easyswoole)  Leave a star if you like
- [GitHub for Doc](https://github.com/easy-swoole/doc)

::: danger 
Please pay attention to the installation.
:::

- The framework uses `Composer` as the dependency management tool. Before you start installing the framework, make sure you have configured the environment and installed the `Composer` tool as described in the previous section.
- For the installation of Composer, please refer to the [Composer China Full Mirror] (https://pkg.phpcomposer.com/#how-to-install-composer) installation tutorial.
- The currently recommended image is Alibaba Cloud or Source Station.
- During the installation process, the files of the framework will be released to the project directory, please ensure that the project directory has writeable permissions.
- After the installation is complete, the App directory will not be automatically generated. Please configure it according to the `Hello World` section.
- Do not use the virtual machine shared directory as the installation directory. Otherwise, the socket cannot be created because of insufficient permissions, and an error is reported: `listen xxxxxx.sock fail `
- The shared directory generates the above error, manually change the Temp directory to another path in the dev.php configuration file.


## Switch Ali cloud image
````
composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/
````
## Composer installation

Follow the steps below to manually install

(Recommended)
```bash
composer require easyswoole/easyswoole=3.x
php vendor/easyswoole/easyswoole/bin/easyswoole install
```

Or (may be wrong)
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

## Start frame

If there is no error in the middle, you can execute:
```bash
# Start frame
php easyswoole start
```
At this point you can visit `http://localhost:9501` to see the welcome page of the framework, indicating that the framework has been successfully installed.


## Docker

[Easyswoole official docker](docker.md)


::: warning 
 Docker knowledge, please learn by yourself
:::

## other
- QQ exchange group
    - VIP group 579434607 (this group needs to pay 599 RMP)
    - EasySwoole official group 633921431 (full)
    - EasySwoole official two groups 709134628 (full)
    - EasySwoole official three groups 932625047
    
- Business support:
    - QQ 291323003
    - EMAIL admin@fosuss.com   
- Author WeChat

    ![](/resources/authWx.png)    
    
- [Donation](../Preface/donation.md)
  Your donation is the greatest encouragement and support for the Swoole project development team. We will insist on development and maintenance. Your donation will be used to:
        
  - Continuous and in-depth development
  - Document and community construction and maintenance

<script>
  export default {
    mounted () {
        if(localStorage.getItem('isNew') != 1){
            localStorage.setItem('isNew',1);
            layer.confirm('Do you like the EasySwoole?',function (index) {
                 layer.msg('thank you for your support');
                     setTimeout(function () {
                         window.open('https://github.com/easy-swoole/easyswoole');
                  },1500);
             });              
        }
    }
  }
</script>
  