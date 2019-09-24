---
title: 配置文件
meta:
  - name: description
    content: EasySwoole的docker镜像构建
  - name: keywords
    content: easyswoole,swoole docker镜像,swoole dockerfile
---



# Docker

- [GitHub](https://github.com/easy-swoole/easyswoole)  喜欢记得点个 ***star***
- [GitHub for Doc](https://github.com/easy-swoole/doc)

## 镜像拉取
```
docker pull easyswoole/easyswoole3
```


::: danger 
 docker hub上的环境为php7.1.30 + swoole4.4.3
:::

## 启动

```
docker run -ti -p 9501:9501 easyswoole/easyswoole3
```
默认工作目录为: ***/easyswoole*** ，以上命令启动的时候，自动进入工作目录，执行php easyswoole start ，浏览器访问 ***http://127.0.0.1:9501/***
即可看到easyswoole欢迎页。

## Docker File
您也可以使用Docker file进行自动构建。
```dockerfile

FROM centos:latest

#version defined
ENV SWOOLE_VERSION 4.4.3
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