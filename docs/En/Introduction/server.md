---
title: Service management
meta:
  - name: description
    content: Easyswoole service management, start service, stop service, etc.
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|easyswoole installation|easyswoole startup|easyswoole soft restart|easyswoole restart
---

# Service management script
After performing the framework installation, you can see one more easywool file in your project root directory.
Execute the following command:
```
php easyswoole
```
visible：
```
 ______                          _____                              _
 |  ____|                        / ____|                            | |
 | |__      __ _   ___   _   _  | (___   __      __   ___     ___   | |   ___
 |  __|    / _` | / __| | | | |  \___ \  \ \ /\ / /  / _ \   / _ \  | |  / _ \
 | |____  | (_| | \__ \ | |_| |  ____) |  \ V  V /  | (_) | | (_) | | | |  __/
 |______|  \__,_| |___/  \__, | |_____/    \_/\_/    \___/   \___/  |_|  \___|
                          __/ |
                         |___/

Welcome to the easySwoole framework for the API. Current version: 3.x

Use:
  easyswoole [Operation] [Options]

operating:
  install       Install EasySwoole
  start         Start EasySwoole
  stop          Stop EasySwoole (used in daemon mode)
  reload        Hot restart EasySwoole (used in daemon mode)
  restart       Restart EasySwoole (used in daemon mode)
  help          View help information for the command

For more information on an operation, use the HELP command to view
For details on the start operation, please enter easyswoole help -start
```

## Service start
Development model： 
```
php easyswoole start
```
## Daemon mode starts
```
php easyswoole start d
```
## Production environment (the default configuration is to load dev.php, use this command to load produce.php 3.1.2 before dev.env, produce.env)
```
php easyswoole start produce
```
## The service stops (the default configuration loads dev.php, using this command to load produce.php 3.1.2 before dev.env, produce.env)
```
php easyswoole stop produce
```

::: warning 
 Note that stop is required in the daemon mode, otherwise control+c or the terminal disconnects to exit the process.
:::

::: warning
 Note that after the command is added, other related stop, reload, and restart commands need to increase the produce parameter, otherwise it may be wrong.
:::

## Hot restart service
```
php easyswoole reload   (Hot restart)
```

::: warning
 Note that reload is required only in the daemon mode, otherwise control+c or the terminal disconnects to exit the process. Here is a hot restart, which can be used to update the file (business logic) that is loaded after the worker start, the main process (such as configuration File) will not be restarted. The http custom routing configuration will not be updated and needs to be restarted;
:::

## Restart service
```
php easyswoole restart (Force stop service and restart)
```

::: warning
`restart` is to force the service to stop and restart, so it is disabled in production mode, otherwise the process interruption may have unexpected loss.
:::


## File hot loading

Due to the characteristics of `swoole` resident memory, after modifying the file, you need to restart the worker process to reload the modified file into memory. We can customize the process to implement file change and automatically perform service overloading.

See related examples

- [Hot overload implementation principle](../Other/hotReload.md)

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
  
- **easySwoole**'s documentation uses **GitBook** as a document writing tool. If you find that the document needs to be corrected/supplemented during use, please **fork** project's document repository, modify and supplement it. Submit **Pull Request** and contact us
