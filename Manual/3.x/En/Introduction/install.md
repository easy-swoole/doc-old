# Framework installation

The framework uses `Composer` as the dependency management tool. Before starting to install the framework, please make sure that you have configured the environment and installed the `Composer` tool according to the previous section. During the installation process, the framework files will be released to the project directory, please ensure that you have writeable permissions

## Composer installation

Follow these steps

```bash
composer require easyswoole/easyswoole=3.x-dev
php vendor/bin/easyswoole.php install
```

## Possible error

In some environment, you will get this error：

```bash
dir=$(d=${0%[/\\]*}; cd "$d" > /dev/null; cd '../easyswoole/easyswoole/bin' && pwd)

# See if we are running in Cygwin by checking for cygpath program
if command -v 'cygpath' >/dev/null 2>&1; then
    # Cygwin paths start with /cygdrive/ which will break windows PHP,
    # so we need to translate the dir path to windows format. However
    # we could be using cygwin PHP which does not require this, so we
    # test if the path to PHP starts with /cygdrive/ rather than /usr/bin
    if [[ $(which php) == /cygdrive/* ]]; then
        dir=$(cygpath -m "$dir");
    fi
fi

dir=$(echo $dir | sed 's/ /\ /g')
"${dir}/easyswoole" "$@"
```
It's a composer issue.make sure symlink function is allow. or you can run script directly

```bash
php vendor/easyswoole/easyswoole/bin/easyswoole.php install
```

If no error is reported, run：
```bash
# start framework
php easyswoole start
```
Now you can visit `http://localhost:9501` , you will see a welcome page.

## Hello World
Create the following directory structure in the project root directory. This directory is the application directory for writing business logic. Edit the `Index.php` file and add the code of the base controller.

```
project              project root dir
----------------------------------
├─App        application dir
│  └─HttpController     controller dir
│     └─Index.php    default controller
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
Then edit composer.json, register namespace

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "App/"
        }
    },
    "require": {
        "easyswoole/easyswoole": "3.x-dev"
    }
}
```

Finally, run `composer dumpautoload` to update namespace，now you have successfully installed the framework.

```bash
# update namespace mapping
composer dumpautoload
# start framework
php easyswoole start
```
After starting，visit `http://localhost:9501`, you can see Hello World 。

## About IDE helper

For development, you can install IDE helper for IDE auto completion.

```bash
composer require easyswoole/swoole-ide-helper
```

## Demo

> [https://github.com/easy-swoole/demo/tree/3.x](https://github.com/easy-swoole/demo/tree/3.x)

## Directory Structure

It is recommended to follow the directory structure below.

```
project                   root dir
├─App                     application dir(can be multiple)
│  ├─HttpController       controller dir
│  │  └─Index.php         default controller
│  └─Model                
├─Log                     
├─Temp                    
├─vendor                  
├─composer.json           
├─composer.lock           
├─EasySwooleEvent.php     global event
├─easyswoole              
├─easyswoole.install      
├─dev.php                 development config
├─produce.php             production config
```

> Note! Please do not use the framework root directory as the root directory of the web server, otherwise the dev.env,produce.env configuration will be accessible, or you can exclude the file yourself.

