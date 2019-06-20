# SplStream

## Purpose
Resource Flow Data Operation

## Core Object Method

Core class：EasySwoole\Utility\SplStream

### __construct

Initialization of resources and read-write operations

* mixed     $resource       Resources
* mixed     $mode           Read-write operation type

function __construct($resource = '',$mode = 'r+')

### __toString

Output resources

public function __toString()

### close

Close an open file pointer

public function close()

### detach

Get resources and reset resource objects

public function detach()

### getSize

Get resource size

public function getSize()

### tell

Returns the location where the file pointer reads/writes

public function tell()

### eof

Does the file pointer reach the end of the file?

public function eof()

### isSeekable

Gets whether it can be located in the current stream

public function isSeekable()

### seek

Locate in the file pointer

* mixed     $offset       Offset
* mixed     $whence       Specified type

public function seek($offset, $whence = SEEK_SET)

Specified type：

* SEEK_SET setting position equals offset bytes
* SEEK_CUR is set to the current location plus offset
* SEEK_END sets the location to the end of the file plus offset

### rewind

Back to the location of the file pointer

public function rewind()

### isWritable

Writable or not

public function isWritable()

### write

Write content

* mixed     $string       content

public function write($string)

### isReadable

Readability

public function isReadable()

### read

Read content

* mixed     $length       length

public function read($length)

### getContents

Read resources flow to a string

public function getContents()

### getMetadata

Obtaining header/metadata from the encapsulation protocol file pointer

public function getMetadata($key = null)

### getStreamResource

Access to resources

function getStreamResource()

### truncate

Truncate the file to a given length

* mixed     $size       Intercept file size

function truncate($size = 0)

> ps: Resource and resource flow are different. The resource is data or variable. Resource flow is a kind of file flow.

