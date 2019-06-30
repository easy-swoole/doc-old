# Dependency injection
  
Dependency Injection

EasySwoole implements a simple version of IOC, using IOC containers can easily store/access resources, and achieve decoupling.
The most important advantage of using dependency injection is that it effectively separates the object from the external resources it needs, makes them loosely coupled, facilitates functional reuse, and more importantly, makes the whole architecture of the program very flexible.
In our daily development, the operation of creating objects is so ubiquitous that it is very familiar with them at the same time it feels very tedious. Every time an object is needed, it needs to be new by hand. Even in some cases, because of bad programming habits, the object can not be recycled, which is quite bad. But what is more serious is that the principle of loose coupling and less intrusion, which we have been advocating, becomes worthless in this case. So the predecessors began to seek to change this programming habit and consider how to use coding to decouple more. The resulting solution is Interface-oriented programming.

> Note: After service startup, the access/injection of IOC containers is only valid for the current process. No impact on other worker processes

## Method list
   
### getInstance

```php
$di = Di::getInstance();
```

### set

Function prototype：set($key, $obj,...$arg)

- key：Key name

- obj:To inject content. Support injection of common variables such as object name, object instance, closure, resource, string, etc.

- $arg:If the content injected is_callable, this parameter can be set for incoming callable execution.

```php
$di->set('test',new TestClass());
$di->set('test',TestClass::class);

// Set stores an array of [class name, method name] and needs to be executed manually by calling call_user_func(). (Don't misunderstand the demo of the error and exception chapters to execute automatically.)
$di->set('test', [TestClass::class,'testFunction']);

// The class name is passed when set, the new object is removed when get, and the variable is passed into the constructor to return the instantiated object.
$di->set('test', TestClass::class, $arg_one, $arg_tow);
```

> Di's set method is lazy loading mode. If set an object name or closure, the object will not be created immediately.

### get

```php
$db = $db->get('test');
```

### delete

```php
$di->delete('test');
```

### clear

Empty all contents of IoC container.
