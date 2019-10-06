# Docker
## Mirror pull-out
```
docker pull easyswoole/easyswoole3
```

> The environment on docker hub is php7.1.30 + swoole4.4.3

## start-up

```
docker run -ti -p 9501:9501 easyswoole/easyswoole3
```
The default working directory is ***/easyswoole***. When the above command starts, it automatically enters the working directory, executes PHP easyswoole start, and browsers access *** http://127.0.0.1:9501/**.*
You can see the easyswoole welcome page.

## Docker File
You can also use Docker file for automatic build.
```dockerfile

FROM centos:centos7

#version defined
ENV SWOOLE_VERSION 4.4.4
ENV EASYSWOOLE_VERSION 3.x-dev

#update core
RUN yum update -y

#install libs
RUN yum install -y curl zip unzip  wget openssl-devel gcc-c++ make autoconf

#install php
RUN yum install -y epel-release
RUN rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm
RUN yum clean all
RUN yum update -y
RUN yum install -y php71w-devel php71w-openssl php71w-gd php71w-mbstring php71w-mysqli

# composer
RUN curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/bin/composer \
    && composer self-update --clean-backups

# use aliyun composer
RUN composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/

# swoole ext
RUN wget https://github.com/swoole/swoole-src/archive/v${SWOOLE_VERSION}.tar.gz -O swoole.tar.gz \
    && mkdir -p swoole \
    && tar -xf swoole.tar.gz -C swoole --strip-components=1 \
    && rm swoole.tar.gz \
    && ( \
    cd swoole \
    && phpize \
    && ./configure --enable-openssl \
    && make \
    && make install \
    ) \
    && sed -i "2i extension=swoole.so" /etc/php.ini \
    && rm -r swoole

# Dir
WORKDIR /easyswoole

# install easyswoole


RUN cd /easyswoole \
    && composer require easyswoole/easyswoole=${EASYSWOOLE_VERSION} \
    && php vendor/bin/easyswoole install


EXPOSE 9501

```