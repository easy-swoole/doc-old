# Environmental Requirements

Some basic environment requirements are required to run the framework. The easySwoole framework is very friendly to the environment. It only needs to fulfill the conditions of Swoole extension, and the PHP version above 7.1.

## Basic Operating Environment

- Guaranteed **PHP** version is greater than or equal to **7.1**
- Guaranteed **Swoole** Extended version is greater than or equal to **4.3.0**
- Requires any version of **pcntl** extension
- Use either **Linux** / **FreeBSD** / **MacOS** operating systems
- Use **Composer** as a dependency management tool

> Refer to the suggestions below, they are not necessary, but they help to use the framework and develop more efficiently

- Use **Ubuntu14** / **CentOS 7.0** or higher operating system

> Refer to the suggestions below, they are not necessary, but they help to use the framework and develop more efficiently

- Use **Ubuntu14** / **CentOS 6.5** or higher operating system

## DockerFile
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

