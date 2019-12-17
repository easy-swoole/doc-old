---
title: SplStream
meta:
  - name: description
    content: EasySwoole SplStream
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole,SplStream
---
# SplStream

## Use
Resource flow data operation

## How to operate

| Method name       | parameter                            | Description                                       |
|:------------------|:-------------------------------------|:-------------------------------------------|
| __construct       | $resource = '',$mode = 'r+'          | Initialize resources and read and write operations                         |
| __toString        |                                      | Output resource                                    |                    
| close             |                                      | Close an open file pointer                       |                    
| detach            |                                      | Get resources and reset resource objects                       |                       
| getSize           | Get resource size                          | Code conversion                                    |                       
| tell              |                                      | Returns the location of the file pointer read/write                    |                        
| eof               |                                      | Whether the file pointer has reached the end of the file                |                       
| isSeekable        |                                      | Get can be positioned in the current stream                    |                       
| seek              | $offset, $whence = SEEK_SET          | Positioning in the file pointer                             |                       
| rewind            |                                      | Rewind the position of the file pointer                           |                      
| isWritable        |                                      | Is it writable                                    |                       
| write             | $string                              | Write content                                    |                       
| isReadable        |                                      | Readable                                    |                       
| read              | $length                              | Reading content                                    |                       
| length            |                                      | Get the length of the string                              |                       
| getContents       |                                      | Read resource stream to a string                       |                       
| getMetadata       | $key = null                          | Get header/metadata from the package protocol file pointer           |                       
| getStreamResource |                                      | Access to resources                                    |                       
| truncate          | $size = 0                            | Truncate the file to the given length                        |                                                                               


## example

### __construct

Initialize resources and read and write operations

* mixed $resource resource
* mixed $mode read and write operation type
```php
function __construct($resource = '',$mode = 'r+')
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$resource = fopen('./test.txt', 'ab+');
$stream = new \EasySwoole\Spl\SplStream($resource);
var_dump($stream->__toString());

/**
 * The output is over:
 * string(10) "Easyswoole"
 */

```

### __toString

Output resource
```php
public function __toString()
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
var_dump($stream->__toString());

/**
 * The output is over:
 * string(10) "Easyswoole"
 */

```

### close

Close an open file pointer
```php
public function close()
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$stream->close();
var_dump($stream->__toString());

/**
 * The output is over:
 * string(0) ""
 */

```

### detach

Get resources and reset resource objects
```php
public function detach()
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$stream->detach();
var_dump($stream->__toString());

/**
 * The output is over:
 * string(0) ""
 */

```

### getSize

Get resource size
```php
public function getSize()
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$size = $stream->getSize();
var_dump($size);

/**
 * The output is over:
 * int(10)
 */

```

### tell

Returns the location of the file pointer read/write
```php
public function tell()
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$position = $stream->tell();
var_dump($position);

/**
 * The output is over:
 * int(10)
 */

```

### eof

Whether the file pointer has reached the end of the file
```php
public function eof()
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$eof = $stream->eof();
var_dump($eof);
$stream->detach();
$eof = $stream->eof();
var_dump($eof);

/**
 * The output is over:
 * bool(false)
 * bool(true)
 */

```

### isSeekable

Get can be positioned in the current stream
```php
public function isSeekable()
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$seekable = $stream->isSeekable();
var_dump($seekable);

/**
 * The output is over:
 * bool(true)
 */

```

### seek

Positioning in the file pointer

* mixed $offset offset
* mixed $whence specified type
```php
public function seek($offset, $whence = SEEK_SET)
```
Specified type:

* SEEK_SET set position equal to offset byte
* SEEK_CUR sets the position to the current position plus offset
* SEEK_END sets the position to the end of the file plus offset

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$stream->seek(2);
$position = $stream->tell();
var_dump($position);

/**
 * The output is over:
 * int(2)
 */

```

### rewind

Rewind the position of the file pointer
```php
public function rewind()
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$stream->rewind();
$position = $stream->tell();
var_dump($position);

/**
 * The output is over:
 * int(0)
 */

```

### isWritable

Is it writable
```php
public function isWritable()
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$writeAble = $stream->isWritable();
var_dump($writeAble);

/**
 * The output is over:
 * bool(true)
 */

```

### write

Write content

* mixed $string content
```php
public function write($string)
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$stream->write(', 666');
var_dump($stream->__toString());

/**
 * The output is over:
 * string(15) "Easyswoole, 666"
 */

```

### isReadable

Whether to read
```php
public function isReadable()
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$readAble = $stream->isReadable();
var_dump($readAble);

/**
 * The output is over:
 * bool(true)
 */

```

### read

Reading content

* mixed     $length       length
```php
public function read($length)
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$stream->rewind();
$string = $stream->read(4);
var_dump($string);

/**
 * The output is over:
 * string(4) "Easy"
 */

```

### getContents

Read resource stream to a string
```php
public function getContents()
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$stream->rewind();
$string = $stream->getContents();
var_dump($string);

/**
 * The output is over:
 * string(10) "Easyswoole"
 */

```

### getMetadata

Get header/metadata from the package protocol file pointer
```php
public function getMetadata($key = null)
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$meta = $stream->getMetadata();
var_dump($meta['stream_type']);

/**
 * The output is over:
 * string(6) "MEMORY"
 */

```

### getStreamResource

Access to resources
```php
function getStreamResource()
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$resource = $stream->getStreamResource();
fseek($resource, 0, SEEK_SET);
var_dump(stream_get_contents($resource));

/**
 * The output is over:
 * string(10) "Easyswoole"
 */

```

### truncate

Truncate the file to the given length

* mixed     $size       Intercept file size
```php
function truncate($size = 0)
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 10:25 am
 */

require_once 'vendor/autoload.php';

$stream = new \EasySwoole\Spl\SplStream('Easyswoole');
$stream->truncate(4);
var_dump($stream->__toString());

/**
 * The output is over:
 * string(4) "Easy"
 */

```

::: warning 
 Ps: There is a difference between resources and resource flows. The resources mentioned here are data or variables. The resource flow is a file stream.
:::

