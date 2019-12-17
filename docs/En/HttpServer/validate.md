---
title: EasySwoole Verifier
meta:
  - name: description
    content: EasySwoole Validator|swoole Parameter validator
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole Validator|swoole Parameter validator
---


## Validate

EasySwoole provides a built-in validation class. By default, there is a validate method in the controller. If you want to use other methods or tools to do the verification, you can override this method in the subclass controller to implement other methods. Tool for verification

::: warning
  Validator class: EasySwoole\Validate\Validate
:::

### Basic use

```php
<?php
use EasySwoole\Validate\Validate;

$data = [
    'name' => 'blank',
    'age'  => 25
];

$valitor = new Validate();
$valitor->addColumn('name', 'The name is not empty')->required('The name is not empty')->lengthMin(10,'Minimum length is not less than 10 digits');
$bool = $valitor->validate($data);
var_dump($bool?"true":$valitor->getError()->__toString());

/* result:
     String(26) "Minimum length is not less than 10 digits"
*/
```
### Package use in the controller
```php
namespace App\HttpController;
use EasySwoole\Http\Message\Status;
use EasySwoole\Validate\Validate;
use EasySwoole\Http\AbstractInterface\Controller;

class BaseController extends Controller
{

    protected function onRequest(?string $action): ?bool
    {
        $ret =  parent::onRequest($action);
        if($ret === false){
            return false;
        }
        $v = $this->validateRule($action);
        if($v){
            $ret = $this->validate($v);
            if($ret == false){
                $this->writeJson(Status::CODE_BAD_REQUEST,null,"{$v->getError()->getField()}@{$v->getError()->getFieldAlias()}:{$v->getError()->getErrorRuleMsg()}");
                return false;
            }
        }   
        return true;
    }

    protected function validateRule(?string $action):?Validate
    {

    }
}

```


::: warning 
 We define a base controller with the validateRule method.。
:::

```php
namespace App\HttpController;


use App\HttpController\Api\BaseController;
use EasySwoole\Validate\Validate;

class Common extends BaseController
{
   
    function sms()
    {
        $phone = $this->request()->getRequestParam('phone');
      
    }

    protected function validateRule(?string $action): ?Validate
    {
        $v = new Validate();
        switch ($action){
            case 'sms':{
                $v->addColumn('phone','phone number')->required('Can not be empty')->length(11,'Wrong length');
                $v->addColumn('verifyCode','Verification code')->required('Can not be empty')->length(4,'Wrong length');
                break;
            }
        }
        return $v;
    }
}
```


::: warning 
 In the controller method that needs to be verified, we can add the corresponding verification rule to the corresponding action, so that the automatic verification can be realized, so that the controller method can realize the logic with peace of mind.
:::

### Method list
    
Get Error:

```php
function getError():?EasySwoole\Validate\Error
```

Add a rule to the field:

Version 1.1.9 to the present

- string `name` field key
- string `alias` alias
- string `reset` reset rule

```php
public function addColumn(string $name, ?string $alias = null,bool $reset = false):EasySwoole\Validate\Rule
```

Version 1.1.0 to 1.1.8

- string `name` field key
- string `alias` alias

```php
public function addColumn(string $name, ?string $alias = null):EasySwoole\Validate\Rule
```

Version 1.0.1

- string `name` field key
- string `errorMsg` error message
- string `alias` alias

```php
public function addColumn(string $name,?string $errorMsg = null,?string $alias = null):EasySwoole\Validate\Rule
```

Version 1.0.0

- string `name` field key
- string `alias` alias
- string `errorMsg` error message

```php
public function addColumn(string $name,?string $alias = null,?string $errorMsg = null):EasySwoole\Validate\Rule
```

Return a Rule object to add a custom rule.

data verification:

- array `data` data

```php
Function validate(array $data)
```

#### Validation rule class
Currently the rules supported by the validator are as follows
````php
namespace EasySwoole\Validate;

/**
 * Verification rule
 * Please sort the verification method in alphabetical order for post maintenance
 * Class Rule
 * @package EasySwoole\Validate
 */
class Rule
{
    protected $ruleMap = [];

    function getRuleMap(): array
    {
        return $this->ruleMap;
    }

    /**
     * Whether the given URL can communicate successfully
     * @param null|string $msg
     * @return $this
     */
    function activeUrl($msg = null)
    {
        $this->ruleMap['activeUrl'] = [
            'arg' => null,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Whether the given parameter is a letter, ie [a-zA-Z]
     * @param null|string $msg
     * @return $this
     */
    function alpha($msg = null)
    {
        $this->ruleMap['alpha'] = [
            'arg' => null,
            'msg' => $msg
        ];
        return $this;
    }

    function alphaNum($msg = null)
    {
        $this->ruleMap['alphaNum'] = [
            'arg' => null,
            'msg' => $msg
        ];
        return $this;
    }

    function alphaDash($msg = null)
    {
        $this->ruleMap['alphaDash'] = [
            'arg' => null,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Whether the given parameter is between $min $max
     * @param integer $min minimum does not contain this value
     * @param integer $max maximum does not contain this value
     * @param null|string $msg
     * @return $this
     */
    function between($min, $max, $msg = null)
    {
        $this->ruleMap['between'] = [
            'msg' => $msg,
            'arg' => [
                $min, $max
            ]
        ];
        return $this;
    }

    /**
     * Whether the given parameter is a boolean
     * @param null|string $msg
     * @return $this
     */
    function bool($msg = null)
    {
        $this->ruleMap['bool'] = [
            'msg' => $msg,
            'arg' => null
        ];
        return $this;
    }

    /**
     * Whether the given parameter is in decimal format
     * @param null|integer $precision specifies the number of decimal places null is not specified
     * @param null $msg
     * @return $this
     */
    function decimal(?int $precision = null, $msg = null)
    {
        $this->ruleMap['decimal'] = [
            'msg' => $msg,
            'arg' => $precision
        ];
        return $this;
    }

    /**
     * Whether the given parameter is before a certain date
     * @param null|string $date
     * @param null|string $msg
     * @return $this
     */
    function dateBefore(?string $date = null, $msg = null)
    {
        $this->ruleMap['dateBefore'] = [
            'msg' => $msg,
            'arg' => $date
        ];
        return $this;
    }

    /**
     * Whether the given parameter is after a certain date
     * @param null|string $date
     * @param null|string $msg
     * @return $this
     */
    function dateAfter(?string $date = null, $msg = null)
    {
        $this->ruleMap['dateAfter'] = [
            'msg' => $msg,
            'arg' => $date
        ];
        return $this;
    }

    /**
     * Verify that the values are equal
     * @param $compare
     * @param null|string $msg
     * @return $this
     */
    function equal($compare, $msg = null)
    {
        $this->ruleMap['equal'] = [
            'msg' => $msg,
            'arg' => $compare
        ];
        return $this;
    }

    /**
     * Verify that the value is a floating point number
     * @param null|string $msg
     * @return $this
     */
    function float($msg = null)
    {
        $this->ruleMap['float'] = [
            'arg' => null,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Call custom closure validation
     * @param callable $func
     * @param null|string $msg
     * @return $this
     */
    function func(callable $func, $msg = null)
    {
        $this->ruleMap['func'] = [
            'arg' => $func,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Whether the value is in the array
     * @param array $array
     * @param bool $isStrict
     * @param null|string $msg
     * @return $this
     */
    function inArray(array $array, $isStrict = false, $msg = null)
    {
        $this->ruleMap['inArray'] = [
            'arg' => [ $array, $isStrict ],
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Is it an integer value
     * @param null|string $msg
     * @return $this
     */
    function integer($msg = null)
    {
        $this->ruleMap['integer'] = [
            'arg' => null,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Is it a valid IP?
     * @param array $array
     * @param null $msg
     * @return $this
     */
    function isIp($msg = null)
    {
        $this->ruleMap['isIp'] = [
            'arg' => null,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Is it not empty
     * @param null $msg
     * @return $this
     */
    function notEmpty($msg = null)
    {
        $this->ruleMap['notEmpty'] = [
            'arg' => null,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Whether a numeric value
     * @param null $msg
     * @return $this
     */
    function numeric($msg = null)
    {
        $this->ruleMap['numeric'] = [
            'arg' => null,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Not in the array
     * @param array $array
     * @param bool $isStrict
     * @param null $msg
     * @return $this
     */
    function notInArray(array $array, $isStrict = false, $msg = null)
    {
        $this->ruleMap['notInArray'] = [
            'arg' => [ $array, $isStrict ],
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Verify the length of an array or string
     * @param int $len
     * @param null $msg
     * @return $this
     */
    function length(int $len, $msg = null)
    {
        $this->ruleMap['length'] = [
            'msg' => $msg,
            'arg' => $len
        ];
        return $this;
    }

    /**
     * Verify the length of an array or string...
     * @param int $lengthMax
     * @param null $msg
     * @return $this
     */
    function lengthMax(int $lengthMax, $msg = null)
    {
        $this->ruleMap['lengthMax'] = [
            'msg' => $msg,
            'arg' => $lengthMax
        ];
        return $this;
    }

    /**
     * Verify that the length of the array or string is reached
     * @param int $lengthMin
     * @param null $msg
     * @return $this
     */
    function lengthMin(int $lengthMin, $msg = null)
    {
        $this->ruleMap['lengthMin'] = [
            'msg' => $msg,
            'arg' => $lengthMin
        ];
        return $this;
    }

    /**
     * Verify that the length of the array or string is within a range
     * @param null $msg
     * @return $this
     */
    function betweenLen(int $min, int $max, $msg = null)
    {
        $this->ruleMap['betweenLen'] = [
            'msg' => $msg,
            'arg' => [
                $min,
                $max
            ]
        ];
        return $this;
    }

    /**
     * Verification value is not greater than (equal is considered not passed)
     * @param int $max
     * @param null|string $msg
     * @return Rule
     */
    function max(int $max, ?string $msg = null): Rule
    {
        $this->ruleMap['max'] = [
            'arg' => $max,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * The verification value is not less than (equal is considered not passed)
     * @param int $min
     * @param null|string $msg
     * @return Rule
     */
    function min(int $min, ?string $msg = null): Rule
    {
        $this->ruleMap['min'] = [
            'arg' => $min,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * The verification value is a legal amount
     * 100 | 100.1 | 100.01
     * @param integer|null $precision Decimal point
     * @param string|null  $msg
     * @return Rule
     */
    function money(?int $precision = null, string $msg = null): Rule
    {
        $this->ruleMap['money'] = [
            'arg' => $precision,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Setting value is optional
     * @return $this
     */
    function optional()
    {
        $this->ruleMap['optional'] = [
            'arg' => null,
            'msg' => null
        ];
        return $this;
    }

    /**
     * Regular expression verification
     * @param $reg
     * @param null $msg
     * @return $this
     */
    function regex($reg, $msg = null)
    {
        $this->ruleMap['regex'] = [
            'arg' => $reg,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Must have a value
     * @param null $msg
     * @return $this
     */
    function required($msg = null)
    {
        $this->ruleMap['required'] = [
            'arg' => null,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Value is a legal timestamp
     * @param null $msg
     * @return $this
     */
    function timestamp($msg = null)
    {
        $this->ruleMap['timestamp'] = [
            'arg' => null,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Timestamp before a specified date
     * @param string $date Pass in any string that can be parsed by strtotime
     * @param null $msg
     * @return $this
     */
    function timestampBeforeDate($date, $msg = null)
    {
        $this->ruleMap['timestampBeforeDate'] = [
            'arg' => $date,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Timestamp after a specified date
     * @param string $date Pass in any string that can be parsed by strtotime
     * @param null $msg
     * @return $this
     */
    function timestampAfterDate($date, $msg = null)
    {
        $this->ruleMap['timestampAfterDate'] = [
            'arg' => $date,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Specify a timestamp before a timestamp
     * @param string|integer $beforeTimestamp before this timestamp
     * @param null $msg
     * @return $this
     */
    function timestampBefore($beforeTimestamp, $msg = null)
    {
        $this->ruleMap['timestampBefore'] = [
            'arg' => $beforeTimestamp,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Specify the timestamp after a timestamp
     * @param string|integer $afterTimestamp after this timestamp
     * @param null $msg
     * @return $this
     */
    function timestampAfter($afterTimestamp, $msg = null)
    {
        $this->ruleMap['timestampAfter'] = [
            'arg' => $afterTimestamp,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Value is a legal link
     * @param null $msg
     * @return $this
     */
    function url($msg = null)
    {
        $this->ruleMap['url'] = [
            'arg' => null,
            'msg' => $msg
        ];
        return $this;
    }

    /**
     * Value is a legal link
     * @param null $msg
     * @return $this
     */
    function allDigital($msg = null)
    {
        $this->ruleMap['allDigital'] = [
            'arg' => null,
            'msg' => $msg
        ];
        return $this;
    }
}
````
