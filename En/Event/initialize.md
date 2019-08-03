# Framework initialization events
## Function prototype
```
public static function initialize(): void
{
}
```
## Work completed
When the framework initialization event is executed, EasySwoole has completed the following tasks：
- Definition of Global Constant EASYSWOOLE_ROOT
- Definition of System Default Log/Temp Directory



## Processing content
In this event, changes to system constants and global configurations can be made, such as:
- Modify and create the system default Log/Temp directory.
- Introducing user-defined configuration
- Register database, redis connection pool
- Trace Chain Tracker Registration