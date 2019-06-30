# 环境要求

满足基本的环境要求才能运行框架，easySwoole 框架对环境的要求十分简单，只需要满足运行 Swoole 拓展的条件，并且 PHP 版本在 7.1 以上即可

## 基础运行环境

- 保证 **PHP** 版本大于等于 **7.1**


- 保证 **Swoole** 拓展版本大于等于 **4.3.0**
- 需要 **pcntl** 拓展的任意版本
- 使用 **Linux** / **FreeBSD** / **MacOS** 这三类操作系统
- 使用 **Composer** 作为依赖管理工具

> 参考下面的建议，它们都不是必须的，但是有助于更高效的使用框架和进行开发

- 使用 **Ubuntu14** / **CentOS 7.0** 或更高版本操作系统

> 参考下面的建议，它们都不是必须的，但是有助于更高效的使用框架和进行开发

- 使用 **Ubuntu14** / **CentOS 6.5** 或更高版本操作系统

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

## 其他

- QQ交流群
    - VIP群 579434607 （本群需要付费599元）
    - EasySwoole官方一群 633921431(已满)
    - EasySwoole官方二群 709134628
    
- 商业支持：
    - QQ 291323003
    - EMAIL admin@fosuss.com
        
- 作者微信

    ![](http://easyswoole.com/img/authWx.jpg)    
    
- [捐赠](../donate.md)
    您的捐赠是对Swoole项目开发组最大的鼓励和支持。我们会坚持开发维护下去。 您的捐赠将被用于:
        
  - 持续和深入地开发
  - 文档和社区的建设和维护
  
- **easySwoole** 的文档采用 **GitBook** 作为文档撰写工具，若您在使用过程中，发现文档有需要纠正 / 补充的地方，请 **fork** 项目的文档仓库，进行修改补充，提交 **Pull Request** 并联系我们
