# Validate

> Validator class: EasySwoole\Validate\Validate

#### Example

```php

<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-10-11
 * Time: 10:26 am
 */

Require_once 'vendor/autoload.php';

$data = [
    'name' => 'blank',
    'age' => 25
];

$valitor = new \EasySwoole\Validate\Validate();
$valitor->addColumn('name', 'name is not empty')->required('name is not empty')->lengthMin(10, 'minimum length is not less than 10');
$bool = $valitor->validate($data);
Var_dump($valitor->getError()->getErrorRuleMsg()?:$valitor->getError()->getColumnErrorMsg());

/* Result:
 String(26) "Minimum length is not less than 10 digits"
*/
```

#### How to use the verification example in the controller ([demo](https://github.com/tioncico/demo/tree/3.x-validate))

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-11-14
 * Time: 2:33 PM
 */

Namespace App\HttpController\Validate;


Use App\HttpController\Base;
Use EasySwoole\Http\Message\Status;
Use EasySwoole\Validate\Validate;

Class Index extends Base
{
    Function index() {
        $validate = new Validate();
        $validate->addColumn('name')->required('name is required');
        $validate->addColumn('age')->required('age required')->between(20, 30, 'young can only be between 20 and 30 years old');
        If ($this->validate($validate)) {
            $this->writeJson(Status::CODE_OK, null, 'success');
        } else {
            $this->writeJson(Status::CODE_BAD_REQUEST, $validate->getError()->__toString(), 'fail');
        }
    }
}
```

Start the service.

Visit <http://localhost:9501/validate> and the response is as follows:

```
{"code":400,"result":"name is required", "msg":"fail"}
```

Visit <http://localhost:9501/validate?name=blank> and the response is as follows:

```
{"code":400,"result":"age age required", "msg":"fail"}
```

Visit <http://localhost:9501/validate?name=blank&age=12> and the response is as follows:

```
{"code":400,"result":"age age can only be before the age of 20 to 30", "msg": "fail"}
```

Visit <http://localhost:9501/validate?name=blank&age=22> and the response is as follows:

```
{"code":400,"result":"age age can only be before the age of 20 to 30", "msg": "fail"}
```


#### Method list

Get Error:

```php
Function getError():?EasySwoole\Validate\Error
```

Add a rule to the field:

- string `name` field key
- string `errorMsg` error message
    - string `alias` alias

```php
Public function addColumn(string $name,?string $errorMsg = null,?string $alias = null):EasySwoole\Validate\Rule
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
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/7/6
 * Time: 12:41 AM
 */

Namespace EasySwoole\Validate;

/**
 * Verification rules
 * Please sort the verification method in alphabetical order for post maintenance
 * Class Rule
 * @package EasySwoole\Validate
 */
Class Rule
{
    Protected $ruleMap = [];

    Function getRuleMap(): array
    {
        Return $this->ruleMap;
    }

    /**
     * Can the given URL be successfully communicated?
     * @param null|string $msg
     * @return $this
     */
    Function activeUrl($msg = null)
    {
        $this->ruleMap['activeUrl'] = [
            'arg' => null,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Whether the given parameter is a letter or [a-zA-Z]
     * @param null|string $msg
     * @return $this
     */
    Function alpha($msg = null)
    {
        $this->ruleMap['alpha'] = [
            'arg' => null,
            'msg' => $msg
        ];
        Return $this;
    }

    Function alphaNum($msg = null)
    {
        $this->ruleMap['alphaNum'] = [
            'arg' => null,
            'msg' => $msg
        ];
        Return $this;
    }

    Function alphaDash($msg = null)
    {
        $this->ruleMap['alphaDash'] = [
            'arg' => null,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Whether the given parameter is between $min $max
     * @param integer $min minimum does not contain this value
     * @param integer $max maximum does not contain this value
     * @param null|string $msg
     * @return $this
     */
    Function between($min, $max, $msg = null)
    {
        $this->ruleMap['between'] = [
            'msg' => $msg,
            'arg' => [
                $min, $max
            ]
        ];
        Return $this;
    }

    /**
     * Whether the given parameter is a Boolean value
     * @param null|string $msg
     * @return $this
     */
    Function bool($msg = null)
    {
        $this->ruleMap['bool'] = [
            'msg' => $msg,
            'arg' => null
        ];
        Return $this;
    }

    /**
     * Whether the given parameter is in decimal format
     * @param null|integer $precision specifies the number of decimal places null is not specified
     * @param null $msg
     * @return $this
     */
    Function decimal(?int $precision = null, $msg = null)
    {
        $this->ruleMap['decimal'] = [
            'msg' => $msg,
            'arg' => $precision
        ];
        Return $this;
    }

    /**
     * Is the given parameter before a certain date?
     * @param null|string $date
     * @param null|string $msg
     * @return $this
     */
    Function dateBefore(?string $date = null, $msg = null)
    {
        $this->ruleMap['dateBefore'] = [
            'msg' => $msg,
            'arg' => $date
        ];
        Return $this;
    }

    /**
     * Is the given parameter after a certain date?
     * @param null|string $date
     * @param null|string $msg
     * @return $this
     */
Function dateAfter(?string $date = null, $msg = null)
    {
        $this->ruleMap['dateAfter'] = [
            'msg' => $msg,
            'arg' => $date
        ];
        Return $this;
    }

    /**
     * Verify that the values ​​are equal
     * @param $compare
     * @param null|string $msg
     * @return $this
     */
    Function equal($compare, $msg = null)
    {
        $this->ruleMap['equal'] = [
            'msg' => $msg,
            'arg' => $compare
        ];
        Return $this;
    }

    /**
     * Verify that the value is a floating point number
     * @param null|string $msg
     * @return $this
     */
    Function float($msg = null)
    {
        $this->ruleMap['float'] = [
            'arg' => null,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Call custom closure validation
     * @param callable $func
     * @param null|string $msg
     * @return $this
     */
    Function func(callable $func, $msg = null)
    {
        $this->ruleMap['func'] = [
            'arg' => $func,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Is the value in the array
     * @param array $array
     * @param bool $isStrict
     * @param null|string $msg
     * @return $this
     */
    Function inArray(array $array, $isStrict = false, $msg = null)
    {
        $this->ruleMap['inArray'] = [
            'arg' => [ $array, $isStrict ],
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Is it an integer value?
     * @param null|string $msg
     * @return $this
     */
    Function integer($msg = null)
    {
        $this->ruleMap['integer'] = [
            'arg' => null,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Is it a valid IP?
     * @param array $array
     * @param null $msg
     * @return $this
     */
    Function isIp($msg = null)
    {
        $this->ruleMap['isIp'] = [
            'arg' => null,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Is it not empty?
     * @param null $msg
     * @return $this
     */
    Function notEmpty($msg = null)
    {
        $this->ruleMap['notEmpty'] = [
            'arg' => null,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Is it a numeric value?
     * @param null $msg
     * @return $this
     */
    Function numeric($msg = null)
    {
        $this->ruleMap['numeric'] = [
            'arg' => null,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * not in the array
     * @param array $array
     * @param bool $isStrict
     * @param null $msg
     * @return $this
     */
    Function notInArray(array $array, $isStrict = false, $msg = null)
    {
        $this->ruleMap['notInArray'] = [
            'arg' => [ $array, $isStrict ],
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Verify the length of an array or string
     * @param int $len
     * @param null $msg
     * @return $this
     */
    Function length(int $len, $msg = null)
    {
        $this->ruleMap['length'] = [
            'msg' => $msg,
            'arg' => $len
        ];
        Return $this;
    }

    /**
     * Verify that the length of the array or string is exceeded
     * @param int $lengthMax
     * @param null $msg
     * @return $this
     */
    Function lengthMax(int ​​$lengthMax, $msg = null)
    {
        $this->ruleMap['lengthMax'] = [
            'msg' => $msg,
            'arg' => $lengthMax
        ];
        Return $this;
    }

    /**
     * Verify that the length of the array or string is up to
     * @param int $lengthMin
     * @param null $msg
     * @return $this
     */
    Function lengthMin(int $lengthMin, $msg = null)
    {
        $this->ruleMap['lengthMin'] = [
            'msg' => $msg,
            'arg' => $lengthMin
        ];
        Return $this;
    }

    /**
     * Verify that the length of the array or string is within a range
     * @param null $msg
     * @return $this
     */
    Function betweenLen(int $min, int $max, $msg = null)
    {
        $this->ruleMap['betweenLen'] = [
            'msg' => $msg,
            'arg' => [
                $min,
                $max
            ]
        ];
        Return $this;
    }

    /**
     * Verification value is not greater than (equal is considered not passed)
     * @param int $max
     * @param null|string $msg
     * @return Rule
     */
    Function max(int ​​$max, ?string $msg = null): Rule
    {
        $this->ruleMap['max'] = [
            'arg' => $max,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * The verification value is not less than (equal is considered not passed)
     * @param int $min
     * @param null|string $msg
     * @return Rule
     */
    Function min(int $min, ?string $msg = null): Rule
    {
        $this->ruleMap['min'] = [
            'arg' => $min,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Verification value is a legal amount
     * 100 | 100.1 | 100.01
     * @param integer|null $precision decimal point
     * @param string|null $msg
     * @return Rule
     */
    Function money(?int $precision = null, string $msg = null): Rule
    {
        $this->ruleMap['money'] = [
            'arg' => $precision,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Set value is optional
     * @return $this
     */
    Functional optional()
    {
        $this->ruleMap['optional'] = [
            'arg' => null,
            'msg' => null
        ];
        Return $this;
    }

    /**
     * Regular expression verification
     * @param $reg
     * @param null $msg
     * @return $this
     */
    Function regex($reg, $msg = null)
    {
        $this->ruleMap['regex'] = [
            'arg' => $reg,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Must have a value
     * @param null $msg
     * @return $this
     */
    Function required($msg = null)
    {
        $this->ruleMap['required'] = [
            'arg' => null,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * value is a legal timestamp
     * @param null $msg
     * @return $this
     */
    Function timestamp($msg = null)
    {
        $this->ruleMap['timestamp'] = [
            'arg' => null,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * The timestamp is before a specified date
     * @Param string $ date can be passed in any strtotime parse strings
     * @param null $msg
     * @return $this
     */
    Function timestampBeforeDate($date, $msg = null)
    {
        $this->ruleMap['timestampBeforeDate'] = [
            'arg' => $date,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * The timestamp is after a specified date
     * @Param string $ date can be passed in any strtotime parse strings
     * @param null $msg
     * @return $this
     */
    function timestampAfterDate ($ date, $ msg = null)
    {
        $this->ruleMap['timestampAfterDate'] = [
            'arg' => $date,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Specify a timestamp before a timestamp
     * @Param string | integer $ beforeTimestamp before the time stamp
     * @param null $msg
     * @return $this
     */
    function timestampBefore ($ beforeTimestamp, $ msg = null)
    {
        $this->ruleMap['timestampBefore'] = [
            'arg' => $beforeTimestamp,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * Specify the timestamp after a timestamp
     * @Param string | integer $ afterTimestamp after the timestamp
     * @param null $msg
     * @return $this
     */
    Function timestampAfter($afterTimestamp, $msg = null)
    {
        $this->ruleMap['timestampAfter'] = [
            'arg' => $afterTimestamp,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * value is a legal link
     * @param null $msg
     * @return $this
     */
    Function url($msg = null)
    {
        $this->ruleMap['url'] = [
            'arg' => null,
            'msg' => $msg
        ];
        Return $this;
    }

    /**
     * value is a legal link
     * @param null $msg
     * @return $this
     */
    Function allDigital($msg = null)
    {
        $this->ruleMap['allDigital'] = [
            'arg' => null,
            'msg' => $msg
        ];
        Return $this;
    }
}
````
