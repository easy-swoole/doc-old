# Framework initialize event

## The function prototype
```
public static function initialize(): void
{
}
```
## Work completed
When the framework initialization event is executed, EasySwoole has completed the following tasks：
- Define global variables EASYSWOOLE_ROOT
- Define system default Log/Temp directory

## Processing content
In this event, changes to system constants and global configuration can be made. eg：
- Modify and create the system default Log/Temp directory
- Introducing user-defined configuration
- Register database or redis connection pool
- Register trace chain tracker