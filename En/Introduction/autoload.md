## Autoload

Autoload can be configured in composer.json. For example:

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

For more details, please visit composer documentation: https://getcomposer.org/doc/
