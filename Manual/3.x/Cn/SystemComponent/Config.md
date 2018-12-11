# Config

Config 它是一个单例类(use EasySwoole\Component\Singleton),完整的命名空间如下：

```
EasySwoole\EasySwoole\Config
```

### 方法列表如下：

创建[swoole_table](https://wiki.swoole.com/wiki/page/p-table.html)：

```php
public function __construct()
{
    $this->conf = new SplArray();
    /*
     * 用于存储动态配置,不适合存储大量\大长度的的配置下，仅仅建议用于开关存储
     */
    $this->swooleTable = new \swoole_table(1024);
    $this->swooleTable->column('value',Table::TYPE_STRING,512);
    $this->swooleTable->create();
}
```

设置动态配置信息：

- string  `key`
- mixed   `val`

```php
function setDynamicConf($key,$val)
```

获取动态配置信息：

- string  `key`

```php
function getDynamicConf($key)
```

删除动态配置信息：

- string  `key`

```php
function delDynamicConf($key)
```

获取配置信息：
 
- string  `keyPath`  配置项名称 支持点语法

```php
public function getConf($keyPath = '')
```

设置配置信息：

- string  `keyPath`  配置项名称 支持点语法
- mixed   `data`      配置项数据

```php
public function setConf($keyPath, $data): void
```

获取全部配置信息：

```php
public function toArray(): array
```

覆盖配置项：

- array  `conf`  配置项数组

```php
public function load(array $conf): void
```

载入一个文件的配置项：

- string  `filePath`  文件路径
- bool    `merge`     是否合并

```php
public function loadFile($filePath, $merge = false)
```

载入一个env文件的配置项：

- string  `filePath`  文件路径

```php
public function loadEnv(string $file)
```

清除配置项：

```php
function clear()
```