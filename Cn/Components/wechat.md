<head>
     <title>EasySwoole Wechat|swoole 微信sdk|swoole 微信</title>
     <meta name="keywords" content="EasySwoole Wechat|swoole 微信sdk|swoole 微信"/>
     <meta name="description" content="基于swoole实现的协程安全的微信sdk"/>
</head>
---<head>---

# 微信SDK
```
composer require easyswoole/wechat
```

# EasySwoole WeChat

[![Latest Stable Version](https://poser.pugx.org/easyswoole/wechat/v/stable)](https://packagist.org/packages/easyswoole/wechat)
[![Total Downloads](https://poser.pugx.org/easyswoole/wechat/downloads)](https://packagist.org/packages/easyswoole/wechat)
[![Latest Unstable Version](https://poser.pugx.org/easyswoole/wechat/v/unstable)](https://packagist.org/packages/easyswoole/wechat)
[![License](https://poser.pugx.org/easyswoole/wechat/license)](https://packagist.org/packages/easyswoole/wechat)
[![Monthly Downloads](https://poser.pugx.org/easyswoole/wechat/d/monthly)](https://packagist.org/packages/easyswoole/wechat)

EasySwoole WeChat 是一个基于 Swoole 4.x 全协程支持的微信SDK库，告别同步阻塞，轻松编写高性能的微信公众号/小程序/开放平台业务接口

## 获取实例

在开始操作之前需要获取一个实例，后续操作均使用该实例进行操作

```php
 
 use EasySwoole\WeChat\WeChat;
 use EasySwoole\WeChat\Config;
 
 $wechat = new WeChat(); // 创建一个实例
 $wechat->config()->setTempDir(EASYSWOOLE_TEMP_DIR); // 指定全局临时目录

```

## 异常捕获

在调用方法时，如果传递了无效的参数或者发生网络异常，将会抛出 ***EasySwoole\WeChat\Exception\RequestError*** 或者 ***EasySwoole\WeChat\Exception\OfficialAccountError*** 类型的异常，开发者需要手工捕获该类异常进行处理，类似这样：

```php

 use EasySwoole\WeChat\Exception\RequestError;
 use EasySwoole\WeChat\Exception\OfficialAccountError;

 try {
     $wechat->officialAccount()->ipList();
 } catch (RequestError $requestError){
    
 } catch (OfficialAccountError $error){
            
 }
 
```


## 微信公众号

微信公众号沙箱: https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login

### 初始化配置
```php
$wechat->officialAccount()->getConfig()->setAppId('your appid')->setAppSecret('your aoo secret')->setToken('your token');
```

### 服务端
```php
use EasySwoole\WeChat\WeChat;
use EasySwoole\WeChat\Bean\OfficialAccount\AccessCheck;
use EasySwoole\WeChat\Bean\OfficialAccount\Message\Text;
use EasySwoole\WeChat\Bean\OfficialAccount\RequestMsg;
use EasySwoole\WeChat\Bean\OfficialAccount\RequestedReplyMsg;
use EasySwoole\WeChat\Bean\OfficialAccount\RequestConst;
$wechat = new WeChat();
$wechat->officialAccount()->getConfig()
    ->setAppId('setAppId')
    ->setAppSecret('setAppSecret')
    ->setToken('setToken');

/*
 * 每个请求到达时将会调用 preCall 方法，这是一个前置操作方法，类似 onRequest 如果你返回false，则表示中断后续流程。
 * 如果你返回一个 RequestedReplyMsg 对象，则会响应微信对象中的消息并中断后续流程
 * 如果你什么都不返回，则会继续执行后续流程
 */
$wechat->officialAccount()->server()->preCall(function (RequestMsg $msg){
//    var_dump($msg->__toString());
});

/*
 * onMessage 方法是 注册每个消息到达时的事件处理，你可以通过set(消息类型, 处理方法) 来注册
 */
$wechat->officialAccount()->server()->onMessage()->set('text',function (RequestMsg $msg){
    $reply = new Text();
    $reply->setMsgType(RequestConst::MSG_TYPE_TEXT);
    $reply->setContent('hello from server');
    return $reply;
});

/*
 * 更为精确和规范的方式则是使用 RequestConst 类中提供的类常量来进行注册
 */
$wechat->officialAccount()->server()->onMessage()->set(RequestConst::DEFAULT_ON_MESSAGE,function (RequestMsg $msg){
    $reply = new RequestedReplyMsg();
    $reply->setMsgType(RequestConst::MSG_TYPE_TEXT);
    $reply->setContent('you say :'.$msg->getContent());
    return $reply;
});

/*
 * 与常规消息不同，事件类的则通过 onEvent 方法来进行注册处理机制，这里是一个用户关注事件
 */
$wechat->officialAccount()->server()->onEvent()->onSubscribe(function (RequestMsg $msg){
    var_dump("{$msg->getFromUserName()} has SUBSCRIBE");
    $reply = new RequestedReplyMsg();
    $reply->setMsgType(RequestConst::MSG_TYPE_TEXT);
    $reply->setContent('Welcome to EasySwoole');
    return $reply;
});

/*
 * 用户取消关注事件
 */
$wechat->officialAccount()->server()->onEvent()->onUnSubscribe(function (RequestMsg $msg){
    var_dump("{$msg->getFromUserName()} has UBSCRIBE");
});

/*
 * 也可以注册默认 和自定义事件处理
 */
$wechat->officialAccount()->server()->onEvent()->set(RequestConst::DEFAULT_ON_EVENT,function (){
    $reply = new RequestedReplyMsg();
    $reply->setMsgType(RequestConst::MSG_TYPE_TEXT);
    $reply->setContent('this is event default reply');
    return $reply;
});

/*
 * 下面是一个简单示例，EasySwoole/Wechat 并不依赖EasySwoole框架本身，即时是原生swoole也可以轻易使用。
 * 如果你框架用户，只需要预先注册事件并正确的将微信请求交给Wechat处理即可
 */
$http = new swoole_http_server("127.0.0.1", 9501);
$http->on("request", function ($request, $response)use($wechat){
    if($request->server['request_method'] == 'GET'){
        $bean = new AccessCheck($request->get);
        $verify = $wechat->officialAccount()->server()->accessCheck($bean);
        if($verify){
            $response->write($bean->getEchostr());
        }
    }else{
        $res = $wechat->officialAccount()->server()->parserRequest($request->rawContent());
        if(is_string($res)){
            $response->write($res);
        }
    }
    $response->end();
});
$http->start();
```

#### Access Token
```php
// 刷新token  如果成功会返回token
$wechat->officialAccount()->accessToken()->refresh();

// 获取token
$wechat->officialAccount()->accessToken()->getToken();
```
****
#### 获取微信公众号服务器 ip 列表
[如果公众号基于安全等考虑，需要获知微信服务器的IP地址列表，以便进行相关限制，可以通过该接口获得微信服务器IP地址列表或者IP网段信息。](https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_the_WeChat_server_IP_address.html)
```php
$wechat->officialAccount()->ipList()
```


#### NetWork Check
[为了帮助开发者排查回调连接失败的问题，提供这个网络检测的API。它可以对开发者URL做域名解析，然后对所有IP进行一次ping操作，得到丢包率和耗时。](https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Network_Detection.html)
```php
use EasySwoole\WeChat\Bean\OfficialAccount\NetCheckRequest;
$req = new NetCheckRequest();
$wechat->officialAccount()->netCheck($req);
```


#### 生成二维码
```php
namespace EasySwoole\WeChat;

use EasySwoole\WeChat\Bean\OfficialAccount\QrCodeRequest;
$qrRequest = new QrCodeRequest;
$qrRequest->setActionName($qrRequest::QR_LIMIT_SCENE);
$qrRequest->setSceneId(1);

$qrCode = $wechat->officialAccount()->qrCode();
$tick = $qrCode->getTick($qrRequest);
$url = $qrCode::tickToImageUrl($tick);
```

#### 微信菜单
```php
$buttons = [
        [
            "type" => "click",
            "name" => "今日歌曲",
            "key"  => "V1001_TODAY_MUSIC"
        ],
        [
            "name"       => "菜单",
            "sub_button" => [
                [
                    "type" => "view",
                    "name" => "搜索",
                    "url"  => "http://www.soso.com/"
                ],
                [
                    "type" => "view",
                    "name" => "视频",
                    "url"  => "http://v.qq.com/"
                ],
                [
                    "type" => "click",
                    "name" => "赞一下我们",
                    "key" => "V1001_GOOD"
                ],
            ],
        ],
    ];

    $matchRule = [
        "tag_id" => "2",
        "sex" => "1",
        "country" => "中国",
        "province" => "广东",
        "city" => "广州",
        "client_platform_type" => "2",
        "language" => "zh_CN"
    ];
    
    // 创建菜单
    $wechat->officialAccount()->menu()->create($buttons);
    // 创建个性化菜单
    $menuId = $wechat->officialAccount()->menu()->create($buttons, $matchRule);
    // 查询现在生效的菜单
    $wechat->officialAccount()->menu()->query();
    // 测试个性化菜单
    $wechat->officialAccount()->menu()->match('openid OR wechat ID');
    // 删除全部菜单
    $wechat->officialAccount()->menu()->delete();
    // 删除指定的个性化菜单
    $wechat->officialAccount()->menu()->delete($menuId);

```

#### JSAPI
```php
    // 获取JsApi对象
    $jsApi = $wechat->officialAccount()->jsApi();

    // 创建微信授权跳转连接
    $jsAuthRequest = new JsAuthRequest;
    // 设置授权后回调地址
    $jsAuthRequest->setRedirectUri('http://m.evalor.cn');
    // 设置 state
    $jsAuthRequest->setState('test');
    // 设置授权类型
    $jsAuthRequest->setType($jsAuthRequest::TYPE_USER_INFO);
    // 返回生成地址 需要开发者自行重定向用户
    $link = $jsApi->auth()->generateURL($jsAuthRequest);
    
    /* 使用微信回调时提供的 code 获取AccessToken
     * 从微信回调时 附带在 url的get参数上 前端或者后端获取都可以
     */
    $code = ''
    $snsAuthBean  = $jsApi->auth()->codeToToken($code);
    $snsAuthBean->getScope();
    $snsAuthBean->getOpenid();
    $snsAuthBean->getAccessToken();
    $snsAuthBean->getRefreshToken();
    
    // 使用上面提供的 AccessToken 获取用户信息
    $user = $jsApi->auth()->tokenToUser($snsAuthBean->getAccessToken());
    $user->getOpenid();
    $user->getHeadimgurl();
    $user->getNickname(); 
    // 更多信息自行阅读源码
    
    // 直接使用 code 获取用户信息，是上述操作的快捷封装
    $user = $jsApi->auth()->codeToUser($code);
    
    // 刷新 AccessToken，refresh token  需要自行存储
    $token = $snsAuthBean->getRefreshToken();
    $snsAuthBean = $jsApi->auth()->refreshToken($token);
    
    // ckeck token (openid and access token is required)
    $snsAuthBean->setOpenid();
    $snsAuthBean->setAccessToken();
    $check = $jsApi->auth()->authCheck($snsAuthBean);
    
    $url = '';  // current request url given by yourself
    // jsApi signature (this is the information wx.config needs)
    $jsApiSignaturePack = $jsApi->jsApi()->sdk()->signature($url);
    $jsApiSignaturePack->getAppId();
    $jsApiSignaturePack->getNonceStr();
    $jsApiSignaturePack->getSignature();
    $jsApiSignaturePack->getTimestamp();
    
```

#### 素材管理(临时)
```php
    use Swoole\Coroutine;
    use EasySwoole\WeChat\Bean\OfficialAccount\MediaRequest;
    use EasySwoole\WeChat\Bean\OfficialAccount\MediaResponse;
    
    // 上传文件路径
    $path = 'image.jpg';
    // 上传文件类型
    $type = MediaRequest::TYPE_IMAGE;
    
    // 你也可以使用new 时候传递关联数组来直接完成创建 new MediaRequest(['path' => $path, 'type' => $type);
    $mediaBean = new MediaRequest(); 
    $mediaBean->setPath($path);
    $mediaBean->setType($type);
    $response = $wechat->officialAccount()->media()->upload($mediaBean);
    
    // 或者也可以直接通过 流来进行上传
    $stream = Coroutine::readFile($path);
    $mediaBean = new MediaRequest();
    $mediaBean->setType($type);
    $mediaBean->setData($stream);
    $response = $wechat->officialAccount()->media()->upload($mediaBean);
    
    // 使用mediaId 获取素材 
    $response = $wechat->officialAccount()->media()->get($mediaId);
    if($response instanceof MediaResponse) {
        // Response对象提供了快捷保存方法 只需要传递存储文件目录地址即可名字会自动通过文件获取
        $response->save($directory); 
        // 如果你想自定义文件名称， 可以使用这个方法
        $response->saveAs($directory, $filename)
    }
    
    // 如果是 video 素材则需要开发者自行下载
    $response = [
        'video_url': $downUrl
    ]
```

#### 素材管理(永久)
```php
    // upload
    use EasySwoole\WeChat\Bean\OfficialAccount\MediaRequest;
    use EasySwoole\WeChat\Bean\OfficialAccount\MediaArticle;
    
    $mediaBean = new MediaRequest();
    $mediaBean->setPath('thumb.jpg');
    $mediaBean->setType(MediaRequest::TYPE_THUMB);
    
    // 如果你的素材类型是 video 必须设置标题和简介
    // $mediaBean->setTitle('title');
    // $mediaBean->setIntroduction('introduction');
        
    $mediaUploadResponse = $wechat->officialAccount()->material()->upload($mediaBean)['media_id'];
    $thumbMediaId = $mediaUploadResponse['media_id'];
        
    // 上传图文消息
    $article = [
        'title' => 'EasySwoole/Wechat！',
        'thumb_media_id' => $thumbMediaId,
        'author' => 'EasySwoole/Wechat',
        'show_cover' => 1,
        'digest' => 'digest',
        'content' => 'content',
        'source_url' => 'https://www.easyswoole.com',
    ];

    $mediaArticle_0 = new MediaArticle($article);
    $mediaArticle_1 = new MediaArticle($article);
    // uploadArticle 方法的参数是一个 可变参数，但是每一个参数都必须是MediaArticle类的实例 [可变参数](https://www.php.net/manual/zh/functions.arguments.php#functions.variable-arg-list)
    $uploadArticleResponse = $wechat->officialAccount()->material()->uploadArticle($mediaArticle_0, $mediaArticle_1);

    // 获取素材
    $materialGetResponse = $wechat->officialAccount()->material()->get($uploadArticleResponse['media_id']);

    // 上传图文素材的图片
    $mediaBean = new MediaRequest();
    $mediaBean->setPath('image.jpg');
    $mediaBean->setType(MediaRequest::TYPE_IMAGE);
    // uploadArticleImage 方法并不会返回 media_id 而是url
    $imageUrl = $wechat->officialAccount()->material()->uploadArticleImage($mediaBean)['url'];

    // 上传图文素材
    $newMediaArticle_0 = new MediaArticle($materialGetResponse['news_item'][0]);
    $newMediaArticle_0->setContent("<img src='{$imageUrl}' alt='image alt'>");
    $updateArticleResponse = $wechat->officialAccount()->material()->updateArticle($uploadArticleResponse['media_id'], $newMediaArticle_0, 0);

    // 删除素材
    $materialDeleteResponse = $wechat->officialAccount()->material()->delete($uploadArticleResponse['media_id']);
```

## 微信小程序

目前版本小程序api支持并不完整，还在持续更新

### 获取小程序对象

```php
$wxa = new \EasySwoole\WeChat\MiniProgram\MiniProgram;
$wxa->getConfig()->setAppId('your appid')->setAppSecret('your appsecret');
```

### 获取小程序session

详细信息请参阅 [微信小程序登陆](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)

```php
$code = '';
$session = $wxa->auth()->session($code);
```

你会返回一个包含下面文档中提到的参数的数组
[code2Session](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html)

### 创建二维码

参阅文档[documentation](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.createQRCode.html)

我们可以使用一下三种方式创建二维码

```php
$response1 = $wxa->qrCode()->getWxaCode('/pages/index/index', 450);
$response2 = $wxa->qrCode()->getWxaCodeUnLimit('/pages/index/index', 'scene');
$response3 = $wxa->qrCode()->createWxaQrCode('/pages/index/index', 450);
```

上述方法也支持更多参数，原型如下

```php
 function getWxaCode($path, $width = 430, $autoColor = false, $lineColor = null, $isHyaline = false){}
 function getWxaCodeUnLimit($path, $scene, $width = 430, $autoColor = false, $lineColor = null, $isHyaline = false);
 function createWxaQrCode($path, $width = 430)