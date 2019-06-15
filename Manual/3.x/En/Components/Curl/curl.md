## Curl

> Warehouse Address: [Curl](https://github.com/easy-swoole/curl)

> Namespace: EasySwoole\Curl\Request

#### Method List

Initialization：

- string `url` Request address

```php
function __construct(string $url = null)
```

Setting Request Address：

- string `url` Request address

```php
public function setUrl(string $url):Request
```

Add cookie：

- EasySwoole\Curl\Cookie `cookie`

```php
public function addCookie(Cookie $cookie):EasySwoole\Curl\Request
```

Add POST parameters：

- EasySwoole\Curl\Field `field`
- bool `isFile ` Is it a document?

```php
public function addPost(Field $field,$isFile = false):EasySwoole\Curl\Request
```

Add GET parameters：

- EasySwoole\Curl\Field `field`

```php
public function addGet(Field $field):EasySwoole\Curl\Request
```

Adding user information：

- array `opt` User Information
- bool `isMerge` Whether to merge or not

> For example: opt can set header information

```php
public function setUserOpt(array $opt,$isMerge = true):EasySwoole\Curl\Request
```

Execution of requests：

```php
public function exec():EasySwoole\Curl\Response
```

Getting User Information：

```php
public function getOpt():array
```



## Custom Packaging Example

To make it easier for you to get used to encapsulating your favorite routines, here's just the sample code：

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-10-16
 * Time: 下午2:16
 */

namespace App\Utility;


use EasySwoole\Curl\Field;
use EasySwoole\Curl\Request;
use EasySwoole\Curl\Response;

class Curl
{
    public function __construct()
    {

    }

    /**
     * @param string $method
     * @param string $url
     * @param array|null $params
     * @return Response
     */
    public function request(string $method, string $url, array $params = null): Response
    {
        $request = new Request( $url );


        switch( $method ){
            case 'GET' :
                if( $params && isset( $params['query'] ) ){
                    foreach( $params['query'] as $key => $value ){
                        $request->addGet( new Field( $key, $value ) );
                    }
                }
                break;
            case 'POST' :
                if( $params && isset( $params['form_params'] ) ){
                    foreach( $params['form_params'] as $key => $value ){
                        $request->addPost( new Field( $key, $value ) );
                    }
                }elseif($params && isset( $params['body'] )){
                    if(!isset($params['header']['Content-Type']) ){
                        $params['header']['Content-Type'] = 'application/json; charset=utf-8';
                    }
                    $request->setUserOpt( [CURLOPT_POSTFIELDS => $params['body']] );
                }
                break;
            default:
                throw new \InvalidArgumentException( "method error" );
                break;
        }

        if( isset( $params['header'] ) && !empty( $params['header'] ) && is_array( $params['header'] ) ){
            foreach( $params['header'] as $key => $value ){
                $string   = "{$key}:$value";
                $header[] = $string;
            }

            $request->setUserOpt( [CURLOPT_HTTPHEADER => $header] );
        }

        if( isset( $params['opt'] ) && !empty( $params['opt'] ) && is_array( $params['opt'] ) ){

            $request->setUserOpt($params['opt']);
        }
        return $request->exec();
    }

}
```

Initiation of requests：

```php
<<?php
 /**
  * Created by PhpStorm.
  * User: root
  * Date: 18-10-12
  * Time: 上午11:07
  */

 namespace App\HttpController;


 use App\Utility\Curl;
 use EasySwoole\Http\AbstractInterface\REST;
 use EasySwoole\Spl\SplString;

 class User extends REST
 {

     function GETTest()
     {
         $request = new Curl();
         $params = [
             'query' => [
                 'nobase64' => 1,
                 'musicid' => '109332150',
                 'inCharset' => 'utf8',
                 'outCharset' => 'utf-8'
             ],
             'opt' => [
                 CURLOPT_REFERER => 'https://y.qq.com/n/yqq/song/001xiJdl0t4NgO.html'
             ]
         ];
         $content = $request->request('GET','https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg', $params);
         $string = new SplString($content);
         $content = $string->regex('/\{.*\}/');
         $json = json_decode($content, true);
         $lyric = $json['lyric'];
         $this->response()->write(html_entity_decode($lyric));
     }
 }
```
