# Framework Installation

The framework uses `Composer` as the dependency management tool. Before starting to install the framework, please ensure that you have configured the environment and installed the `Composer` tool as required in the previous section. During the installation process, the framework files will be released to the project. Directory, please make sure the project directory has writable permission.

> For the installation of Composer, please refer to the installation tutorial of [Composer China Full Mirror] (https://pkg.phpcomposer.com/#how-to-install-composer). In addition, Composer China has not been updated for a long time. Please use the ladder or other images.

## Switching Laravel Images
````
Composer config -g repo.packagist composer https://packagist.laravel-china.org
````
## Composer Installation

Follow the steps below to install manually

```bash
composer require easyswoole/easyswoole=3.x
php vendor/bin/easyswoole install
```

> If the installation encounters an error, please see the error handling below

## Reporting Error Handling

In some environments, especially PHP environments using the integrated panel installation, the following error occurs:

```bash
dir=$(d=${0%[/\\]*}; cd "$d" > /dev/null; cd '../easyswoole/easyswoole/bin' && pwd)

# See if we are running in Cygwin by checking for cygpath program
if command -v 'cygpath' >/dev/null 2>&1; then
    # Cygwin paths start with /cygdrive/ which will break windows PHP,
    # so we need to translate the dir path to windows format.
    # we could be using cygwin PHP which does not require this, so we
    # test if the path to PHP starts with /cygdrive/ rather than /usr/bin
    if [[ $(which php) == /cygdrive/* ]]; then
        Dir=$(cygpath -m "$dir");
    fi
fi

dir=$(echo $dir | sed 's/ /\ /g')
"${dir}/easyswoole" "$@"
```

Most of the reasons for this error are the current PHP.ini disables the `symlink` function, or can't create a symbolic link in the `vendor` directory. You can execute the following command line to observe the output to confirm whether the function is disabled. If the function is not disabled, there is no `symlink` in the output list

```bash
php -ini | grep disable_functions
```

> If the function is disabled, you can directly modify PHP.ini or disable the function in the integration panel, delete the `vendor` directory in the project directory, and re-execute `composer install` to pull the dependency package.

If the error is caused by other reasons, you can manually execute the following command in the project root directory to link the executable file:

```bash
cd vendor/bin/ && rm -rf easyswoole && ln -s ../easyswoole/easyswoole/bin/easyswoole easyswoole && cd ../../
```

Or directly point to the EasySwoole management script to execute the install command:

```bash
php vendor/easyswoole/easyswoole/bin/easyswoole install
```

## Manual Installation

Follow the steps below to manually install

```bash
composer require easyswoole/easyswoole=3.x-dev
php vendor/bin/easyswoole install
```

If there is no error in the middle, execute:
```bash
# start framework
php easyswoole start
```
At this point you can visit `http://localhost:9501` to see the welcome page of the framework, indicating that the framework has been installed successfully.

> If the install operation of the second step reports an error, please see the error handling above.

## Dockerfile

```
FROM php:7.2

# Version
ENV PHPREDIS_VERSION 4.0.1
ENV SWOOLE_VERSION 4.3.3
ENV EASYSWOOLE_VERSION 3.x-dev

# Timezone
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' > /etc/timezone

# Libs
RUN apt-get update \
    && apt-get install -y \
    curl \
    wget \
    git \
    zip \
    libz-dev \
    libssl-dev \
    libnghttp2-dev \
    libpcre3-dev \
    && apt-get clean \
    && apt-get autoremove

# Composer
RUN curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer \
    && composer self-update --clean-backups

# PDO extension
RUN docker-php-ext-install pdo_mysql

# Bcmath extension
RUN docker-php-ext-install bcmath

# Redis extension
RUN wget http://pecl.php.net/get/redis-${PHPREDIS_VERSION}.tgz -O /tmp/redis.tar.tgz \
    && pecl install /tmp/redis.tar.tgz \
    && rm -rf /tmp/redis.tar.tgz \
    && docker-php-ext-enable redis

# Swoole extension
RUN wget https://github.com/swoole/swoole-src/archive/v${SWOOLE_VERSION}.tar.gz -O swoole.tar.gz \
    && mkdir -p swoole \
    && tar -xf swoole.tar.gz -C swoole --strip-components=1 \
    && rm swoole.tar.gz \
    && ( \
    cd swoole \
    && phpize \
    && ./configure --enable-async-redis --enable-mysqlnd --enable-openssl --enable-http2 \
    && make -j$(nproc) \
    && make install \
    ) \
    && rm -r swoole \
    && docker-php-ext-enable swoole

WORKDIR /var/www/code

# Install easyswoole
RUN cd /var/www/code \
    && composer require easyswoole/easyswoole=${EASYSWOOLE_VERSION} \
    && php vendor/bin/easyswoole install

EXPOSE 9501

ENTRYPOINT ["php", "/var/www/code/easyswoole", "start"]

```
> docker build Dockerfile, please search from Baidu

## Hello World
Create the following directory structure in the project root directory. This directory is the application directory for writing business logic. Edit the `Index.php` file and add the code of the base controller.

```
project - project deployment directory
----------------------------------
├─App - App Catalog
│ └─HttpController - the controller directory of the application
│ └─Index.php - default controller file
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
        "easyswoole/easyswoole": "3.x-dev"
    }
}
```

> actually, the name space of the app is registered

Finally, the `composer dumpautoload` command is executed to update the namespace. The framework can automatically load the files in the **App** directory. At this point, the framework has been installed and you can start writing business logic.

```bash
# update namespace mapping
composer dumpautoload
# start framework
php easyswoole start
```
After launching the framework, visit `http://localhost:9501` to see Hello World.

## About IDE Assistant

Since the function of Swoole is not a PHP standard function, the IDE cannot perform automatic completion. In order to facilitate development, you can execute the following command to introduce the IDE assistant, which can automatically complete the Swoole related functions under the IDE.

```bash
composer require easyswoole/swoole-ide-helper
```

## Directory Structure

**EasySwoole**'s directory structure is very flexible, basically it can be customized without too many constraints, but it is still recommended to follow the following directory structure for easy development

```
Project - project deployment directory
├─App - application directory (can have more than one)
│ ├─HttpController - controller directory
│ │ └─Index.php - default controller
│ └─Model - model file directory
├─Log - log file directory
├─Temp - temporary file directory
├─vendor - third-party class library directory
├─composer.json - composer architecture
├─composer.lock - composer lock
├─EasySwooleEvent.php - framework global event
├─easyswoole - framework management script
├─easyswoole.install - framework installation lock file
├─dev.php - development environment configuration file
├─produce.php - production environment configuration file
```

> If the project also needs to use other static resource files, it is recommended to use **Nginx** / **Apache** as the front-end web service, forward the request to easySwoole for processing, and add a `Public` directory as the root of the web server table of Contents

> Note! Please do not use the framework home directory as the root directory of the web server, otherwise the dev.env, produce.env configuration will be accessible, or you can exclude the file (3.1.2 has been changed to dev.php, produce.php, but still recommended to set to Public)

## Other

- QQ exchange group
    - VIP group 579434607 (this group needs to pay 599 RMB)
    - EasySwoole official group 633921431 (full)
    - EasySwoole official second group 709134628
    
- Business support:
    - QQ 291323003
    - EMAIL admin@fosuss.com
        
- Author WeChat

    ![](http://easyswoole.com/img/authWx.jpg)
    
- [donation] (../donate.md)
    Your donation is the greatest encouragement and support for the Swoole project development team. We will insist on development and maintenance. Your donation will be used to:
        
   - Continuous and in-depth development
   - Documentation, community construction and maintenance
  
- **easySwoole**'s documentation uses **GitBook** as a document writing tool. If you find that the document needs to be corrected/supplemented during use, please **fork** project's document repository for modification , submit **Pull Request** and contact us

