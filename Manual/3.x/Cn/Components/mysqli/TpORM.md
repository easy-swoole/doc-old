# 示例
假如你的项目的tp的风格，可以继承EasySwoole\Mysqli\TpORM来自定义


```php
<?php

namespace App;

use EasySwoole\Mysqli\DbObject;
use App\Pool\MysqlPool;
use App\Pool\MysqlObject;
use EasySwoole\Mysqli\TpORM;
use EasySwoole\Component\Pool\PoolManager;
use EasySwoole\EasySwoole\Config;

/**
 * Class Model
 * @package ezswoole
 * @method mixed|static where($whereProps, $whereValue = 'DBNULL', $operator = '=', $cond = 'AND')
 * @method mixed|static field($field)
 *
 */
class Model extends TpORM
{
	protected $prefix;
	protected $modelPath = '\\App\\Model';
	protected $fields = [];
	protected $limit;
	protected $throwable;
	protected $createTime = false;
	protected $createTimeName = 'create_time';

	/**
	 * Model constructor.
	 * @param null $data
	 */
	public function __construct( $data = null )
	{
		$this->prefix = Config::getInstance()->getConf( 'MYSQL.prefix' );
		$db           = PoolManager::getInstance()->getPool( MysqlPool::class )->getObj( Config::getInstance()->getConf( 'MYSQL.POOL_TIME_OUT' ) );
		if( $db instanceof MysqlObject ){
			parent::__construct( $data );
			$this->setDb( $db );
		} else{
			// todo log
			return null;
		}
	}

	public function __destruct()
	{
		$db = $this->getDb();
		if( $db instanceof MysqlObject ){
			$db->gc();
			PoolManager::getInstance()->getPool( MysqlPool::class )->recycleObj( $db );
			$this->setDb( null );
		}
	}

	/**
	 * @param null $data
	 * @return bool|int
	 */
	protected function add( $data = null )
	{
		try{
			if( $this->createTime === true ){
				$data[$this->createTimeName] = time();
			}
			return parent::insert( $data );
		} catch( \EasySwoole\Mysqli\Exceptions\ConnectFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \EasySwoole\Mysqli\Exceptions\PrepareQueryFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \Throwable $t ){
			$this->throwable = $t;
			return false;
		}
	}

	/**
	 * @param null $data
	 * @return bool|mixed
	 */
	protected function edit( $data = null )
	{
		try{
			return $this->update( $data );
		} catch( \EasySwoole\Mysqli\Exceptions\ConnectFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \EasySwoole\Mysqli\Exceptions\PrepareQueryFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \Throwable $t ){
			$this->throwable = $t;
			return false;
		}
	}

	/**
	 * @return bool|null
	 */
	public function del()
	{
		try{
			if( $this->softDelete === true ){
				$data[$this->softDeleteTimeName] = time();
				return $this->update( $data );
			} else{
				return parent::delete();
			}
		} catch( \EasySwoole\Mysqli\Exceptions\ConnectFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \EasySwoole\Mysqli\Exceptions\PrepareQueryFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \Throwable $t ){
			$this->throwable = $t;
			return false;
		}
	}

	/**
	 * @return array|bool|false|null
	 */
	public function select()
	{
		try{
			return parent::select();
		} catch( \EasySwoole\Mysqli\Exceptions\ConnectFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \EasySwoole\Mysqli\Exceptions\PrepareQueryFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \Throwable $t ){
			$this->throwable = $t;
			return false;
		}
	}

	/**
	 * @param string $name
	 * @return array|bool
	 */
	public function column( string $name )
	{
		try{
			return parent::column();
		} catch( \EasySwoole\Mysqli\Exceptions\ConnectFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \EasySwoole\Mysqli\Exceptions\PrepareQueryFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \Throwable $t ){
			$this->throwable = $t;
			return false;
		}
	}

	/**
	 * @param string $name
	 * @return array|bool|null
	 */
	public function value( string $name )
	{
		try{
			return parent::value();
		} catch( \EasySwoole\Mysqli\Exceptions\ConnectFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \EasySwoole\Mysqli\Exceptions\PrepareQueryFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \Throwable $t ){
			$this->throwable = $t;
			return false;
		}
	}

	/**
	 * @return array|bool
	 */
	protected function find( $id = null )
	{
		try{
			if( $id ){
				return $this->byId( $id );
			} else{
				return parent::find();
			}
		} catch( \EasySwoole\Mysqli\Exceptions\ConnectFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \EasySwoole\Mysqli\Exceptions\PrepareQueryFail $e ){
			$this->throwable = $e;
			return false;
		} catch( \Throwable $t ){
			$this->throwable = $t;
			return false;
		}
	}
}
```
## 示例

WikiModel.php

```php
<?php

namespace App\Model;

use yourPath\Model;


class Wiki extends Model
{
	protected $softDelete = true;
	protected $softDeleteTimeName = 'delete_time';
	protected $createTime = true;
	protected $createTimeName = 'create_time';
	protected $dbFields
		= [
			'content'     => ['text', 'required'],
			'id'          => ['int'],
			'name'        => ['text'],
			'create_time' => ['int'],
			'delete_time' => ['int'],
		];
}

?>
```

查询多条

```php
WikiModel::where( ['id' => ['>', 5]] )->field( ['id'] )->select();
WikiModel::where( ['id' => ['>', 5]] )->column( 'id' );
WikiModel::where( ['id' => ['>', 5]] )->value( 'id' );
WikiModel::where( ['id' => ['>', 5]] )->field( ['id'] )->select();
```

单条

```php
WikiModel::where( ['id' => ['>', 5]] )->find();
```

添加

```php
WikiModel::add( ['content' => "1111"] );
```

修改

> 注意：对象的主键。'id'是默认值。protected $primaryKey = 'id';
>
> 如果想改为其他，请继承并替换

```php
// 方式1，逻辑是先查询有没有，如果有就实例化出来一个对象，然后调用edit方法
$wiki   = WikiModel::byId( 4 );
$wiki->edit( ['content' => 'xxxxxxxxxxx'] );
// 方式2，不管有没有直接就修改
$wiki->edit( ['id'=>'4','content' => 'xxxxxxxxxxx'] );
// 还可以这么写
WikiModel::where( ['id' => ['>' => 64]] )->edit( ['content' => '我是64'] );
```

删除

```php
// 方式1
WikiModel::byId( 64 )->del();
// 方式2
WikiModel::where( ['id' => ['>=' => 63]] )->del();
```



