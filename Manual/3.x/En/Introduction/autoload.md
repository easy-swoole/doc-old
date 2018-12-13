## Autoload

Can be configured in composer.json. Such as:

```json
{
    "autoload": {
        "psr-4": {
            "App\\" : "App/",
            "EasySwoole\\" : "Conf/",
            "YourTest\\":"tests/"
        },
        "files":["lib/ClassTest.php"]
    }
}
```

composer doc: https://getcomposer.org/doc/
