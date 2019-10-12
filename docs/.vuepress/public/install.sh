#!/bin/bash
if [ -e ./composer.json ];
then
    echo "composer.json already exist\n";
    exit 1
fi

echo "{}" > composer.json

composer config repo.packagist composer https://mirrors.aliyun.com/composer/;
composer require easyswoole/easyswoole=3.x;
php vendor/easyswoole/easyswoole/bin/easyswoole install;
php easyswoole start;
