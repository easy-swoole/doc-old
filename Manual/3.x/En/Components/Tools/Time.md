# Time

## Purpose
Timestamp Assistant

## Core object method

Core class：EasySwoole\Utility\Time

### startTimestamp

Return the timestamp from the beginning of a day

* mixed  $date      String date or timestamp

static function startTimestamp($date = '')

> Example

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 上午10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Time::startTimestamp('2019-4-15'));

/**
 * Output results:
 * int(1555286400)
 */

```

### endTimestamp

Returns a timestamp at the end of a day

* mixed  $date      String date or timestamp

static function endTimestamp($date = '')

> Example

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 上午10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Time::endTimestamp('2019-4-15'));

/**
 * Output results:
 * int(1555372799)
 */

```

### endTimestamp

Create Datetime objects from strings

* mixed  $datetime      Date or timestamp of incoming text

static function createDateTimeClass($datetime = '')

> Example

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 上午10:10
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

### parserDateTime

Get the time and seconds of the year, month, day, and day from the DateTime object

* mixed  $datetime      Date or timestamp of incoming text

static function parserDateTime($dateTime)

> Example

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 上午10:10
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