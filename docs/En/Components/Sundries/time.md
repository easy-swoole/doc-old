---
title: Time
meta:
  - name: description
    content: Timestamp assistant
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|Component Library|Miscellaneous Tools|Time
---



# Time


## Use

Timestamp assistant



## Core Object Class

To implement this component function you need to load the core class:

```php
EasySwoole\Utility\Time
```



## Core Object Method



#### StartTimestamp

Return the timestamp starting at a certain day

- mixed $date string date or timestamp

```php
static function startTimestamp($date = '')
```

:::tip

Example

:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Time::startTimestamp('2019-4-15'));

/**
 * Output results:
 * int(1555286400)
 */
```



#### endTimestamp

返Back to the end of the day
 
 - mixed $date string date or timestamp

```php
static function endTimestamp($date = '')
```

:::tip

Example

:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Time::endTimestamp('2019-4-15'));

/**
 * Output results:
 * int(1555372799)
 */
```



#### endTimestamp

Create a Datetime object from a string

- mixed $datetime incoming text date or timestamp

```php
static function createDateTimeClass($datetime = '')
```

:::tip

Example

:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Time::createDateTimeClass('2019-4-15'));

/**
 * Output results:
 * object(DateTime)#3 (3) {
 *   ["date"]=>
 *   string(26) "2019-04-15 00:00:00.000000"
 *   ["timezone_type"]=>
 *   int(1)
 *   ["timezone"]=>
 *   string(6) "+00:00"
 * }
 */
```



#### parserDateTime

Get the year, month, day, hour, minute, and second from the DateTime object

- mixed $datetime incoming text date or timestamp

```php
static function parserDateTime($dateTime)
```

:::tip

Example

:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Time::parserDateTime('2019-4-15'));

/**
 * Output results:
 * array(6) {
 *   [0]=>
 *   string(2) "00"
 *   [1]=>
 *   string(2) "00"
 *   [2]=>
 *   string(2) "00"
 *   [3]=>
 *   string(1) "4"
 *   [4]=>
 *   string(2) "15"
 *   [5]=>
 *   string(4) "2019"
 * }
 */
```

