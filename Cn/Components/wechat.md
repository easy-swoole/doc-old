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
    /** 二维码 - 永久小程序码 Api: $wxa->qrCode()->getWxaCode()
     * @param $path             扫码进入的小程序页面路径，最大长度 128 字节
     * @param int $width        二维码的宽度
     * @param bool $autoColor   自动配置线条颜色
     * @param null $lineColor   auto_color 为 false 时生效，使用 rgb 设置颜色 例如 {"r":"xxx","g":"xxx","b":"xxx"} 十进制表示
     * @param bool $isHyaline   是否需要透明底色
     */
    function getWxaCode($path, $width = 430, $autoColor = false, $lineColor = null, $isHyaline = false)

     /**
     * 二维码 - 临时小程序码 Api: $wxa->qrCode()->getWxaCodeUnLimit()
     * @param $path             已经发布的小程序存在的页面
     * @param $scene            最大32个可见字符
     * @param int $width        二维码的宽度
     * @param bool $autoColor   自动配置线条颜色
     * @param null $lineColor   auto_color 为 false 时生效，使用 rgb 设置颜色 例如 {"r":"xxx","g":"xxx","b":"xxx"} 十进制表示
     * @param bool $isHyaline   是否需要透明底色
     */
     function getWxaCodeUnLimit($path, $scene, $width = 430, $autoColor = false, $lineColor = null, $isHyaline = false)

     /**
     * 二维码 - 永久二维码 Api:  $wxa->qrCode()->createWxaQrCode()
     * @param $path             扫码进入的小程序页面路径，最大长度 128 字节
     * @param int $width        二维码的宽度
     */
      function createWxaQrCode($path, $width = 430)

```

### 获取帐号下已存在的模板列表

`$wxa->templateMsg()->getTemplateList(int $offset, int $count)`

### 获取模板库某个模板标题下关键词库

`$wxa->templateMsg()->getTemplateLibraryById(string $id)`

### 组合模板并添加至帐号下的个人模板库

`$wxa->templateMsg()->addTemplate(string $id, array $keywordIdList)`

### 删除帐号下的某个模板

`$wxa->templateMsg()->deleteTemplate(string $templateId)`

### 获取小程序模板库标题列表

`$wxa->templateMsg()->getTemplateLibraryList(int $offset, int $count)`

### 发送模板消息

```php
//要传递的参数数组，下面实际方法中是传入Bean
$templateMsg = [
    'touser' => 'user-openid',
    'template_id' => 'template-id',
    'page' => 'index',
    'form_id' => 'form-id',
    'data' => [
        'keyword1' => 'VALUE',
        'keyword2' => 'VALUE2',
    ],
];

$wxa->templateMsg()->send(TemplateMsgBean $templateMsg)

```

### 微信小程序消息解密(获取电话等功能，信息是加密的，需要解密)

`$wxa->encryptor()->decryptData(string $sessionKey, string $iv, string $encryptedData)`

### 检查一段文本是否含有违法违规内容

`$wxa->checkFile()->msgSecCheck(string $content)`


### 校验一张图片是否含有违法违规内容

`$wxa->checkFile()->imgSecCheck(ImgUploadBean $imgUpload)`

### 异步校验图片/音频是否含有违法违规内容

`$wxa->checkFile()->mediaCheckAsync(string $mediaUrl ,int $mediaType)`

### 物流助手(小程序)

```php
/**
 * 绑定、解绑物流账号 Api: $wxa->logisticsProgram()->bindAccount()
 * @param BindAccount $bindAccount
 */
function bindAccount(BindAccount $bindAccount)

//例子
//要传递的参数数组，下面实际方法中是传入Bean
$bindAccount = [
    'type'          => 'bind',  //bind表示绑定，unbind表示解除绑定
    'biz_id'        => '1',     //快递公司客户编码
    'delivery_id'   =>  '1',     //快递公司ID
    'password'      =>  '***',     //快递公司客户密码
    'remark_content'=>  '测试'      //备注内容（提交EMS审核需要）
];

$wxa->logisticsProgram()->bindAccount($bindAccount);

 /**获取所有绑定的物流账号 Api: $wxa->logisticsProgram()->getAllAccount()
  *
  */
 function getAllAccount()


 /**
 * 获取电子面单余额。仅在使用加盟类快递公司时，才可以调用。 Api: $wxa->logisticsProgram()->getQuota()
 * @param string $deliveryId    快递公司ID  
 * @param string $bizId         快递公司客户编码
 */
function getQuota(string $deliveryId ,string $bizId)


/**
 * 生成运单 Api: $wxa->logisticsProgram()->addOrder()
 * @param AddOrder $addOrder
 * 具体参数请参考文档： https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/express/by-business/logistics.addOrder.html
 */
function addOrder(AddOrder $addOrder)


/**
 * 取消运单 Api: $wxa->logisticsProgram()->cancelOrder()
 * @param string $orderId       订单 ID，需保证全局唯一
 * @param string $openid        用户openid，当add_source=2时无需填写（不发送物流服务通知）
 * @param string $deliveryId    快递公司ID
 * @param string $waybillId     运单ID
 */
function cancelOrder(string $orderId ,string $openid ,string $deliveryId ,string $waybillId)

/**
 * 获取支持的快递公司列表 Api: $wxa->logisticsProgram()->getAllDelivery()
 */
function getAllDelivery()


/* 获取运单数据 Api:  $wxa->logisticsProgram()->getOrder()
 * @param string $orderId       订单 ID，需保证全局唯一
 * @param string $openid        用户openid，当add_source=2时无需填写（不发送物流服务通知）
 * @param string $deliveryId    快递公司ID
 * @param string $waybillId     运单ID
 */
function getOrder(string $orderId ,string $openid ,string $deliveryId ,string $waybillId)

/* 查询运单轨迹 Api:  $wxa->logisticsProgram()->getPath()
 * @param string $orderId       订单 ID，需保证全局唯一
 * @param string $openid        用户openid，当add_source=2时无需填写（不发送物流服务通知）
 * @param string $deliveryId    快递公司ID
 * @param string $waybillId     运单ID
 */
 function getPath(string $orderId ,string $openid ,string $deliveryId ,string $waybillId)

//获取打印员。若需要使用微信打单 PC 软件，才需要调用。 Api: $wxa->logisticsProgram()->getPrinter()
 function getPrinter()

 /**
 * 配置面单打印员,若需要使用微信打单 PC 软件，才需要调用。 Api: $wxa->logisticsProgram()->updatePrinter()
 * @param string $openid        打印员 openid
 * @param string $updateType    更新类型
 * @param string $tagidList     用于平台型小程序设置入驻方的打印员面单打印权限，同一打印员最多支持10个tagid，使用逗号分隔，如填写123，456，表示该打印员可以拉取到tagid为123和456的下的单，非平台型小程序无需填写该字段
 */
 function updatePrinter(string $openid ,string $updateType ,string $tagidList)

```

### 物流助手(服务端)

```php
/**
 * 获取面单联系人信息 Api: $wxa->logisticsService()->getContact()
 * @param string $tokens        商户侧下单事件中推送的 Token 字段
 * @param string $waybillId     运单 ID
 */
function getContact(string $tokens ,string $waybillId)

 /**
 * 预览面单模板。用于调试面单模板使用。 Api:  $wxa->logisticsService()->previewTemplate()
 * @param string $waybillId         运单 ID
 * @param string $waybillTemplate   面单 HTML 模板内容（需经 Base64 编码）
 * @param string $waybillData       面单数据
 * @param AddOrder $addOrder        商户下单数据
 * 具体参数文档地址：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/express/by-provider/logistics.previewTemplate.html
 */
  function previewTemplate(string $waybillId ,string $waybillTemplate ,string $waybillData,AddOrder $addOrder)


/**
 * 更新商户审核结果 Api:  $wxa->logisticsService()->updateBusiness()
 * @param string $shopAppId     商户的小程序AppID
 * @param string $bizId         商户账户
 * @param int $resultCode       审核结果，0 表示审核通过，其他表示审核失败
 * @param string $resultMsg     审核错误原因，仅 result_code 不等于 0 时需要设置
 */
function updateBusiness(string $shopAppId ,string $bizId ,int $resultCode ,string $resultMsg)


/**
     * 更新运单轨迹 Api: $wxa->logisticsService()->updatePath()
     * @param UpdatePath $updatePath
     * 具体参数文档地址：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/express/by-provider/logistics.updatePath.html
     */
    function updatePath(UpdatePath $updatePath)


```

### 生物认证

```php
/**
     * SOTER 生物认证秘钥签名验证 Api: $wxa->attest()->verifySignature()
     * @param string $openid        用户 openid
     * @param string $jsonString    通过 wx.startSoterAuthentication 成功回调获得的 resultJSON 字段
     * @param string $jsonSignature 通过 wx.startSoterAuthentication 成功回调获得的 resultJSONSignature 字段
     */
    function verifySignature(string $openid ,string $jsonString ,string $jsonSignature)

```

### 插件管理

```php
/**
 *向插件开发者发起使用插件的申请 Api: $wxa->plugin()->applyPlugin()
 * @param string $action        此接口下填写 "apply"
 * @param string $pluginAppid   插件 appId
 * @param string $reason        申请使用理由
 */
function applyPlugin(string $action = 'apply' ,string $pluginAppid ,string $reason = '')

/**
 * 获取当前所有插件使用方（供插件开发者调用）Api: $wxa->plugin()->getPluginDevApplyList()
 * @param string $action    此接口下填写 "dev_apply_list"
 * @param int $page         要拉取第几页的数据
 * @param int $num          每页的记录数
 */
function getPluginDevApplyList(string $action = 'dev_apply_list' ,int $page = 1 ,int $num = 10)


/**
 * 查询已添加的插件 Api: $wxa->plugin()->getPluginList()
 * @param string $action    此接口下填写 "list"
 */
function getPluginList(string $action = 'list')

/**
 * 修改插件使用申请的状态（供插件开发者调用）Api: $wxa->plugin()->setDevPluginApplyStatus()
 * @param string $action    修改操作
 * @param string $appid     使用者的 appid。同意申请时填写。    
 * @param string $reason    拒绝理由。拒绝申请时填写
 */
function setDevPluginApplyStatus(string $action ,string $appid = '' ,string $reason = '')


/**
 * 删除已添加的插件 Api:  $wxa->plugin()->unbindPlugin()
 * @param string $action        此接口下填写 "unbind"
 * @param string $pluginAppid   插件 appId
 */
function unbindPlugin(string $action = 'unbind' ,string $pluginAppid)


```

### 附近的小程序

```php
/**
 * 添加地点 Api: $wxa->program()->add()
 * @param ProgramBean $program
 * 参数文档： https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/nearby-poi/nearbyPoi.add.html
 */
function add(ProgramBean $program)

//例子

$program = [
    'kf_info' => '{"open_kf":true,"kf_headimg":"http://mmbiz.qpic.cn/mmbiz_jpg/kKMgNtnEfQzDKpLXYhgo3W3Gndl34gITqmP914zSwhajIEJzUPpx40P7R8fRe1QmicneQMhFzpZNhSLjrvU1pIA/0?wx_fmt=jpeg","kf_name":"Harden"}',
    'pic_list' => '{"list":["http://mmbiz.qpic.cn/mmbiz_jpg/kKMgNtnEfQzDKpLXYhgo3W3Gndl34gITqmP914zSwhajIEJzUPpx40P7R8fRe1QmicneQMhFzpZNhSLjrvU1pIA/0?wx_fmt=jpeg","http://mmbiz.qpic.cn/mmbiz_jpg/kKMgNtnEfQzDKpLXYhgo3W3Gndl34gITRneE5FS9uYruXGMmrtmhsBySwddEWUGOibG8Ze2NT5E3Dyt79I0htNg/0?wx_fmt=jpeg"]}',
    'service_infos' => '{"service_infos":[{"id":2,"type":1,"name":"快递","appid":"wx1373169e494e0c39","path":"index"},{"id":0,"type":2,"name":"测试","appid":"wx1373169e494e0c39","path":"index"}]}',
    'store_name' => '测试测试',
    'contract_phone' => '1769360227',
    'hour' => '00:00-11:11',
    'company_name' => '测试数据啊',
    'credential' => '13082741523645',
    'address' => 'xxxxxxxx',
    'qualification_list' => '3LaLzqiTrQcD20DlX_o-OV1-nlYMu7sdVAL7SV2PrxVyjZFZZmB3O6LPGaYXlZWq',
];

$wxa->program()->add($program);
 /**
 * 删除地点 Api: $wxa->program()->delete()
 * @param string $poiId 附近地点 ID
 */
function delete(string  $poiId)



/**
 * 查看地点列表 Api:  $wxa->program()->getList()
 * @param int $page     起始页id（从1开始计数）
 * @param int $pageRows 每页展示个数（最多1000个）
 */
function getList(int $page = 1 ,int $pageRows)


/**
 * 展示/取消展示附近小程序 Api: $wxa->program()->setShowStatus()
 * @param string $poiId 附近地点 ID
 * @param int $status   是否展示 0: 不展示，1：展示
 */
function setShowStatus(string $poiId ,int $status)


```


