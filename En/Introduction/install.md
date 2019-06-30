# Framework Installation

EasySwoole utilizes `Composer` to manage its dependencies. Before starting the installation process, please ensure that you have got your system satisfied with our requirements, and `Composer` installed on your machine. During the installation process, the framework files will be downloaded to the project root directory automatically, please make sure the folder is writable.

## Install via Composer

Follow the steps below to install manually

```bash
composer require easyswoole/easyswoole=3.x
php vendor/bin/easyswoole install
```

> If the installation encounters an error, please see the error handling below

## Reporting Error Handling

In some cases, especially those PHP integrated server environment such as wamp/xampp/mamp, you might see the following error message appear:

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

The most likely reason could be the `symlink` function is disabled in the PHP.ini file, or can't create a symbolic link in the `vendor` directory. You can execute the following command line to confirm whether the `symlink` function is disabled or not. If it was, there should no `symlink` in the output list

```bash
php -ini | grep disable_functions
```

> If the function is disabled, you can directly modify PHP.ini or enable the function in the admin panel, delete the `vendor` directory in the project directory, and re-run `composer install` command to pull the dependency package once again.

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

If there is no error appears during the installation, then:
```bash
# Fire-up the framework
php easyswoole start
```
> If the fire-up action failed, please refer to the error message.

Now if you could see the welcome page by visiting `http://localhost:9501`, congratulations, EasySwoole has been installed and good to go!


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
> docker build Dockerfile? please google it yourself

## Hello World
Create the following directory structure in the project root directory. 

```
project - The project root directory
----------------------------------
├─App               - App directory
│ └─HttpController  - the controller directory of the application
│   └─Index.php     - default controller file
----------------------------------
```

The `App` directory is the central place where you should put all business logic. Modify the `Index.php` file to add some codes as below:

```php
<?php
namespace App\HttpController;
use EasySwoole\Http\AbstractInterface\Controller;

class Index extends Controller
{

    function index()
    {
        // TODO: Implement index() method.
        $this->response()->write('Hello World');
    }
}
```
Then update the composer.json file in the root directory to register the application's namespace.

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

> In fact, the namespace `App` is registered

At last, run `composer dumpautoload` command in the prompt. The framework now can automatically load the files in the **App** directory, so you can start writing the business logic at this stage.

```bash
# update namespace mapping
composer dumpautoload
# start framework
php easyswoole start
```
After the application launched, you should see `Hello World` by visiting `http://localhost:9501`.

## About IDE Assistant

Since Swoole extension is not included in default PHP installation packages, so the IDE which you're using, might not perform automatic completion. In order to avoid the tips of undefined and improve work efficiency, we recommend you install the `Swoole IDE Helper` by:

```bash
composer require easyswoole/swoole-ide-helper
```

## Directory Structure

**EasySwoole** can support very flexible files/directories structure, almost it can be customized without any constraints, but we still recommended you to use the directory structure below:

```
Project                     - project root directory
├─App                       - application directory (can have more than one)
│ ├─HttpController          - controllers directory
│ │ └─Index.php             - default controller
│ └─Model                   - models directory
├─Log                       - log files directory
├─Temp                      - temporary files directory
├─vendor                    - third-party library directory
├─composer.json             - composer.json
├─composer.lock             - composer.lock
├─EasySwooleEvent.php       - framework global event
├─easyswoole                - framework management script
├─easyswoole.install        - framework installation lock file
├─dev.php                   - development environment configuration file
├─produce.php               - production environment configuration file
```

> If you want to use some static resource files (Such as images, css, js, etc.) in your project, it is recommended to use **Nginx** / **Apache** as the tier-1 server, then forward the request to EasySwoole for processing. Meanwhile using a separated `Public` directory as the root of web server.

> Note! You shall never ever use the framework root directory as the root directory of the web server, which is going to make the dev.php/produce.php accessible.

## Other

- QQ Discussion group
    - VIP group 579434607 (this group needs to pay 599 RMB)
    - EasySwoole official group: 633921431 (No vacancies)
    - EasySwoole official alternative group: 709134628
    
- Commercial users support:
    - QQ 291323003
    - EMAIL: <a href="mailto:admin@fosuss.com">admin@fosuss.com</a>
        
- Author WeChat

    ![](http://easyswoole.com/img/authWx.jpg)
    
- [donation] (../donate.md)
    Your donation is the greatest encouragement and support for EasySwoole project development team. We will insist on development and maintenance. Your donation will be used to:
        
   - Continuous development and upgrade
   - Documentations, Community and Long term technical support
  
- **EasySwoole**'s documentation uses **GitBook** as a document writing tool. If you find that the document needs to be corrected/supplemented during use, please **fork** project's document repository for modification , submit **Pull Request** and contact us