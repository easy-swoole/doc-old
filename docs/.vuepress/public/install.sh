#!/bin/bash
composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/;
composer require easyswoole/easyswoole=3.x;
php vendor/easyswoole/easyswoole/bin/easyswoole install;
php easyswoole start;