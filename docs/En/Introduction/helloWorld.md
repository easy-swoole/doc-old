---
title: Hello World
meta:
  - name: description
    Content: EasySwoole hello world development example
  - name: keywords
    Content: swoole|swoole extension|swoole framework|easyswoole|swoole extension|swoole framework|php coroutine framework
---

# Hello World

Create the following directory structure in the project root directory. This directory is the application directory for writing business logic. Edit the `Index.php` file and add the code of the base controller.

::: tip
Note that the directory will not be automatically generated after installation (this is different from the traditional framework), you need to create and add composer to load the configuration to take effect. Please read this content patiently.
:::

```
project                 Project deployment directory
----------------------------------
├─App                   Application directory
│  └─HttpController     Application controller directory
│     └─Index.php       Default controller file
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
Then edit the composer.json file in the root directory to register the application's namespace.

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
 In fact, it is the name space of the registered app.
:::

Finally, the `composer dumpautoload` command is executed to update the namespace. The framework can automatically load the files in the **App** directory. At this point, the framework has been installed and you can start writing business logic.

```bash
# Update namespace mapping
composer dumpautoload
# Start frame
php easyswoole start
```
After launching the framework, visit `http://localhost:9501` to see Hello World.

## About IDE Assistant

Since the function of Swoole is not a PHP standard function, the IDE cannot perform auto-completion. In order to facilitate development, you can execute the following command to introduce the IDE assistant, and the Swoole-related functions can be automatically completed under the IDE.

```bash
composer require easyswoole/swoole-ide-helper
```

## Directory Structure

**EasySwoole**'s directory structure is very flexible, basically can be customized, there are not many constraints, but for the convenience of development, it is still recommended to follow the following directory structure.

```
project                   Project deployment directory
├─App                     Application directory (can have multiple)
│  ├─HttpController       Controller directory
│  │  └─Index.php         Default controller
│  └─Model                Model file directory
├─Log                     Log file directory
├─Temp                    Temporary file directory
├─vendor                  Third-party class library directory
├─composer.json           Composer architecture
├─composer.lock           Composer lock
├─EasySwooleEvent.php     Framework global event
├─easyswoole              Framework management script
├─dev.php                 Development configuration file
├─produce.php             Production profile
```


::: warning 
 If the project also needs to use other static resource files, it is recommended to use **Nginx** / **Apache** as the front-end web service, forward the request to easySwoole for processing, and add a `Public` directory as the root directory of the web server.
:::


::: warning 
 Note! Please do not use the framework home directory as the root directory of the web server, otherwise the root directory file configuration such as dev.php,produce.php will be accessible, or you can exclude important files by yourself.
:::
