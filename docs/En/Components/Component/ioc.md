---
title: IOC dependency injection
meta:
  - name: description
    content: PHP uses IOC container to realize injection decoupling in the framework development of swoole
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|IOC|swoole IOC|Di injection
---


# Dependency Injection

Dependency Injection  

EasySwooleA simple version of IOC is implemented，Using an IOC container makes it easy to store/retrieve resources and decouple them。

One of the most important benefits of using dependency injection is that it effectively separates the object from the external resources it needs, making them loosely coupled, facilitating functional reuse, and more importantly, making the overall architecture of the program very flexible。

In our daily development, the creation of objects is so common that it is very familiar and tedious at the same time. Every time we need an object, we need to new it by ourselves. In some cases, the object cannot be recycled due to bad programming habits, which is quite bad。

But what's more serious is that the principle of loose coupling and less intrusion, which we have been advocating, becomes useless in this case. So the predecessors began to seek to change this programming habit, and consider how to use coding to be more decoupled. The solution was interface oriented programming.

::: tip
 Note: after the service starts, the fetch/injection to the IOC container is only valid for the current process. It does not affect other worker processes.
:::

## Methods list

### getInstance

```php
$di = Di::getInstance();
```

### set

The function prototype：set($key, $obj,...$arg)

- key：Key name

- obj:   To inject content. Support injection object name, object instance, closure, resource, string and other common variables。

- $arg:  If the injected content is is_callable, you can set this parameter to be passed in when the callable executes。

```php
$di->set('test',new TestClass());
$di->set('test',TestClass::class);

// Set stores an array of [class name, method name]，You need to manually call call_user_func() execution yourself (Do not misunderstand that the error and exception section demo will be executed automatically)
$di->set('test', [TestClass::class,'testFunction']);

// Set passes the class name，Go to the new object when it is get，The variable is passed into the constructor and returns the instantiated object
$di->set('test', TestClass::class, $arg_one, $arg_tow);
```

::: warning 
Di's set method is lazy load mode, and if an object name or closure is set, the object is not immediately created.
:::

### get

```php
$val = $di->get('test');
```

### delete

```php
$di->delete('test');
```

### clear

Empty the IoC container of all contents.





