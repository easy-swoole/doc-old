# Example
If your project's TP style, you can inherit EasySwoole\Mysqli\TpORM from the definition

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
## Example

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

Query multiple entries

```php
WikiModel::where( ['id' => ['>', 5]] )->field( ['id'] )->select();
WikiModel::where( ['id' => ['>', 5]] )->column( 'id' );
WikiModel::where( ['id' => ['>', 5]] )->value( 'id' );
WikiModel::where( ['id' => ['>', 5]] )->field( ['id'] )->select();
```

Single strip

```php
WikiModel::where( ['id' => ['>', 5]] )->find();
```

Add

```php
WikiModel::add( ['content' => "1111"] );
```

Update

> Note: The primary key of the object. 'id'is the default value.protected $primaryKey = 'id';
>
> If you want to change to something else, please inherit and replace it.

```php
// Mode 1, the logic is to first query whether there is an object, if there is one, instantiate an object, and then call the edit method.
$wiki   = WikiModel::byId( 4 );
$wiki->edit( ['content' => 'xxxxxxxxxxx'] );
// Mode 2: Modify it directly or not
$wiki->edit( ['id'=>'4','content' => 'xxxxxxxxxxx'] );
// It can also be written like this.
WikiModel::where( ['id' => ['>' => 64]] )->edit( ['content' => 'I'm 64.'] );
```

Delete

```php
// Mode 1
WikiModel::byId( 64 )->del();
// Mode 2
WikiModel::where( ['id' => ['>=' => 63]] )->del();
```



