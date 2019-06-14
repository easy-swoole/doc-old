# SplFileStream

## Purpose
File Resource Flow Data Operation

## Core Object Method

Core class：EasySwoole\Utility\SplFileStream

### __construct

Initialization of resources and read-write operations

* mixed     $file       file
* mixed     $mode       Read-write operation type

function __construct($file,$mode = 'c+')

### lock

file locking

* mixed     $mode       Lock type

Lock type:

* LOCK_SH Gets Shared Lock (Read Program)
* LOCK_EX Gets Exclusive Locks (Written Programs)
* LOCK_UN Release Lock (Shared or Exclusive)

function lock($mode = LOCK_EX)

### unlock

Release lock

* mixed     $mode       Lock type

function unlock($mode = LOCK_UN)