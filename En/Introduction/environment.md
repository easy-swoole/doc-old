# Environmental Requirements

Some basic environment requirements are required to run the framework. The EasySwoole framework is very friendly to the environment. It only needs to fulfill the conditions of Swoole extension, and the PHP version above 7.1.

## Minimum requirement of your development/production environment
You will need to make sure your system meets the following requirements

- PHP >= 7.1
- **Swoole** PHP Extension >= **4.4.0**
- **pcntl** PHP extension
- Operating system: **Linux** / **FreeBSD** / **MacOS**
- Composer

> Refer to the suggestions below, they are not mandatory, but might make your coding experiences with EasySwoole much better

- Use **Ubuntu >= 14** / **CentOS >= 6.5** or Any GNU / Linux Distributions Operating System
- macOS

## DockerFile
```
FROM php:7.2

# Version
ENV PHPREDIS_VERSION 4.0.1
ENV SWOOLE_VERSION 4.4.2
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

- QQ Discussion group
    - VIP group 579434607 (this group needs to pay 599 RMB)
    - EasySwoole official group: 633921431 (No vacancies)
    - EasySwoole official alternative group: 709134628
    
- Commercial users support:
    - QQ 291323003
    - EMAIL: <a href="mailto:admin@fosuss.com">admin@fosuss.com</a>
