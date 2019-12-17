---
title: Annotation
meta:
  - name: description
    content: Easyswoole提供了一个轻量级的注解解析工具
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole|Annotation
---
## Annotation
Easyswoole provides a lightweight annotation resolution tool.

## The installation
```shell
composer require easyswoole/annotation
```

### Implementation principle

- convention
    - Each annotation behavior starts with the @ character and is formatted as
    ```@METHOD(ARGS)```
- The execution process is as follows：
    - Use PHP reflection to get comment information
    - Explode and explode each line with PHP_EOL
    - Parse the data of each line. If the corresponding METHOD AnnotationTagInterface exists, pass the parsed ARGS to the assetValue METHOD in the AnnotationTagInterface.
      The user can perform custom parsing of the parsed values in this method.
    - In strict mode, an error is reported if the correct value cannot be resolved.

## example
```php
<?php
use EasySwoole\Annotation\Annotation;
use EasySwoole\Annotation\AbstractAnnotationTag;

/*
 * Define the param rendering method
 */

class param extends AbstractAnnotationTag
{

    public function tagName(): string
    {
        return 'param';
    }

    public function assetValue(?string $raw)
    {
        $list = explode(',',$raw);
        foreach ($list as $item){
            parse_str($item,$ret);
            foreach ($ret as $key => $value){
                $this->$key = trim($value," \t\n\r\0\x0B\"\'");
            }
        }
    }
}

/*
 * Define the timeout rendering method
 */

class timeout extends AbstractAnnotationTag
{
    public $timeout;

    public function tagName(): string
    {
        return 'timeout';
    }

    public function assetValue(?string $raw)
    {
        $this->timeout = floatval($raw);
    }

    public function aliasMap(): array
    {
        return [
            static::class,
            "timeout_alias"
        ];
    }
}


class A
{
    protected $a;

    /**
     * @param(name=a,type=string,value=2)
     * @param(name=b)
     * @timeout_Alias(0.5)
     * @fuck(easyswoole)
     * 这是我的其他说明啊啊啊啊啊
     */
    function test()
    {

    }
}

/**
 * Instantiate the renderer and register the rendering method to parse
 */
$annotation = new Annotation();
$ref = new \ReflectionClass(A::class);
//Do not register fuck parsing
$annotation->addParserTag(new param());
$annotation->addParserTag(new timeout());

$list = $annotation->getClassMethodAnnotation($ref->getMethod('test'));

foreach ($list['param'] as $item){
    var_dump((array)$item);
}

foreach ($list['timeout'] as $item){
    var_dump((array)$item);
}
```

::: warning  
If @ exists in the first three characters of each comment line, it means that this behavior needs to parse the comment line. By default, it is in non-strict mode. Unregistered tag information will not be parsed.
:::

## Default annotation parsing tool

Easyswoole comes with a string parsing tool called```Easyswoole \Annotation\ValueParser```, which supports unit testing in the following format

The code is shown in：

```php
namespace EasySwoole\Annotation\Tests;


use EasySwoole\Annotation\ValueParser;
use PHPUnit\Framework\TestCase;

class ValueParserTest extends TestCase
{
    function testNormal()
    {
        $str = "int=1";
        $this->assertEquals([
            'int'=>"1"
        ],ValueParser::parser($str));

        $str = "int=1,int2=2";
        $this->assertEquals([
            'int'=>"1",
            'int2'=>"2"
        ],ValueParser::parser($str));

        $str = "int=1,int2='2'";
        $this->assertEquals([
            'int'=>"1",
            'int2'=>"2"
        ],ValueParser::parser($str));
    }

    function testArray()
    {
        $str = "array={1,2,3}";
        $this->assertEquals([
            'array'=>['1','2','3']
        ],ValueParser::parser($str));

        $str = "array={'1','2','3'}";
        $this->assertEquals([
            'array'=>['1','2','3']
        ],ValueParser::parser($str));


        $str = "array={'1','2 , 3'}";
        $this->assertEquals([
            'array'=>['1','2 , 3']
        ],ValueParser::parser($str));

        $str = 'array={"1","2","3"}';
        $this->assertEquals([
            'array'=>['1','2','3']
        ],ValueParser::parser($str));

        $str = "array={1,2,3} ,array2={4,5,6}";
        $this->assertEquals([
            'array'=>['1','2','3'],
            'array2'=>['4','5','6']
        ],ValueParser::parser($str));

    }


    function testEval()
    {
        $str = 'time="eval(time() + 30)"';
        $this->assertEquals([
            'time'=>time() + 30,
        ],ValueParser::parser($str));

        $str = 'time="eval(time() + 30)" , time2="eval(time() + 31)';
        $this->assertEquals([
            'time'=>time() + 30,
            'time2'=>time() + 31
        ],ValueParser::parser($str));

        $str = 'list="eval([1,2,3,4])"';
        $this->assertEquals([
            'list'=>[1,2,3,4]
        ],ValueParser::parser($str));
    }

    function testArrayAndEval()
    {
        $str = 'array="{"1","2",eval(time() + 30)}"';
        $this->assertEquals([
            'array'=>['1','2',time() + 30]
        ],ValueParser::parser($str));

        $str = 'array={"1","2",eval(time() + 30)},str="222"';
        $this->assertEquals([
            'array'=>['1','2',time() + 30],
            "str"=>'222'
        ],ValueParser::parser($str));

        $str = "array={1,2,3},time=eval(time())";
        $this->assertEquals([
            'array'=>['1','2','3'],
            'time'=>time()
        ],ValueParser::parser($str));
    }


    function testStrMulti()
    {
        $str = 'mix="first|{1,2,3}|eval(time() + 3)"';
        $this->assertEquals([
            'mix'=>['first',['1','2','3'],time() + 3]
        ],ValueParser::parser($str));
    }
}
```
## IDE support

PHPStorm needs to install the "PHP Annotation" plug-in to provide Annotation autoprompt capability. The plug-in can be searched and installed directly in PHPStorm or downloaded and installed on Github

::: warning 
 https://github.com/Haehnchen/idea-php-annotation-plugin
:::

Then write one of the following Annotation prompt classes yourself, the focus is to use the @annotation class Annotation, mark this is an Annotation prompt class, PHPStorm index to this file, you can annotate the class name and class members

```php

<?php


namespace EasySwoole\Validate;

/**
 * Annotated document
 * @Annotation
 * You need to use the Annotation tag up here which is an Annotation prompt class
 */
final class ValidateRule
{
    /**
     * These fields are prompted in parentheses
     * @var string
     */
    protected $name;

    /**
     * These fields are prompted in parentheses
     * @var string
     */
    protected $column;

    /**
     * These fields are prompted in parentheses
     * @var string
     */
    protected $alias;
}

```

You can implement the following aaa method automatic annotation prompt

```php
<?php

use EasySwoole\Validate as Validate;

class a
{
    /**
     * @Validate\ValidateRule(column="name",alias="The name of the account")
     */
    function aaa(){

    }
}
```
