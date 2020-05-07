### title: 微信公众号
meta:
  - name: description
    content: WeChat是一个基于Swoole 4.x全协程支持的微信SDK库
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole|wechat|openPlatform

## 微信公众号

微信公众号沙箱: https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login

<span style="color:red;">注：本公众号文档类目对应腾讯微信公众号-测试号管理中的“体验接口权限表”</span>

体验接口权限表： https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index#msg_tpl_main

## 开始开发



### 初始化相关配置

在EasySwooleEvent.php的mainServerCreate方法下：
```php
    use EasySwoole\WeChat\WeChat;

		// 获取WeChat配置实例
    $weChatConfig = new \EasySwoole\WeChat\Config();
    // 设置全局缓存目录
    $weChatConfig->setTempDir(Config::getInstance()->getConf('TEMP_DIR'));
    
    // 设置相关公众号配置信息(两种配置方式)
    // 方式一
    $weChatConfig->officialAccount()->setAppId('you appId');
    $weChatConfig->officialAccount()->setAppSecret('you appSecret');
    $weChatConfig->officialAccount()->setToken('you token');
    $weChatConfig->officialAccount()->setAesKey('you AesKey');    
    
    // 设置相关公众号配置信息(两种配置方式)
    // 方式二
    $configArray = [
        'appId'     => 'you appId',
        'appSecret' => 'you appSecret',
        'token'     => 'you token',
        'AesKey'    => 'you AesKey',
    ];
    $weChatConfig->officialAccount($configArray);
    
    // 获取WeChat实例，后续相关操作需要依靠该实例
    $weChat = new WeChat($weChatConfig);

```



### 基础支持

------

#### 获取AccessToken

```php
    // 获取微信AccessToken
    $weChat->officialAccount()->accessToken()->getToken();
```



#### 刷新AccessToken

```php
    // 获取微信AccessToken
    $weChat->officialAccount()->accessToken()->refresh();
```



#### 验证消息真实性(AccessCheck)

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\AccessCheck;

    // 获取AccessCheck Bean实例传入请求参数
    $accessCheckBean = new AccessCheck($this->request()->getRequestParam());

    // 使用accessCheck方法验证，返回bool值
    $verify = $weChat->officialAccount()->server()->accessCheck($accessCheckBean);
```



#### 获取微信服务器IP地址

[公众号文档](https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_the_WeChat_server_IP_address.html)

```php
    use EasySwoole\WeChat\WeChat;

		$wechat->officialAccount()->ipList()
```



#### 微信网络检测

[公众号文档](https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Network_Detection.html)

```php
    use EasySwoole\WeChat\WeChat;   
		use EasySwoole\WeChat\Bean\OfficialAccount\NetCheckRequest;

    // 获取NetCheckRequest Bean实例
    $req = new NetCheckRequest();
    // 使用netCheck方法传入NetCheckRequest Bean实例检测
    $wechat->officialAccount()->netCheck($req);
```



## 自定义菜单

请注意：

1.  自定义菜单最多包括3个一级菜单，每个一级菜单最多包含5个二级菜单。
2.  一级菜单最多4个汉字，二级菜单最多7个汉字，多出来的部分将会以“...”代替。
3.  创建自定义菜单后，菜单的刷新策略是，在用户进入公众号会话页或公众号profile页时，如果发现上一次拉取菜单的请求在5分钟以前，就会拉取一下菜单，如果菜单有更新，就会刷新客户端的菜单。测试时可以尝试取消关注公众账号后再次关注，则可以看到创建后的效果。

------



### 创建接口

```php
    use EasySwoole\WeChat\WeChat;  

		// 构建菜单数据结构
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
            "key"  => "V1001_GOOD"
          ],
        ],
      ],
    ];

		// 传入数据创建菜单
		$weChat->officialAccount()->menu()->create($buttons);
```



### 查询接口

本接口将会提供公众号当前使用的自定义菜单的配置，如果公众号是通过API调用设置的菜单，则返回菜单的开发配置，而如果公众号是在公众平台官网通过网站功能发布菜单，则本接口返回运营者设置的菜单配置。

```php
use EasySwoole\WeChat\WeChat;  

$weChat->officialAccount()->menu()->queryConfig();
```



### 删除接口

使用接口创建自定义菜单后，开发者还可使用接口删除当前使用的自定义菜单。另请注意，在个性化菜单时，调用此接口会删除默认菜单及全部个性化菜单。

```php
use EasySwoole\WeChat\WeChat;  

$weChat->officialAccount()->menu()->delete();
```



### 个性化菜单接口

为了帮助公众号实现灵活的业务运营，微信公众平台新增了个性化菜单接口，开发者可以通过该接口，让公众号的不同用户群体看到不一样的自定义菜单。该接口开放给已认证订阅号和已认证服务号。

#### 创建个性化菜单

```php
   use EasySwoole\WeChat\WeChat;  

		// 构建菜单数据结构
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
            "key"  => "V1001_GOOD"
          ],
        ],
      ],
    ];
		// 构建菜单匹配规则
    $matchRule = [
        "tag_id"               => "2",
        "sex"                  => "1",
        "country"              => "中国",
        "province"             => "广东",
        "city"                 => "广州",
        "client_platform_type" => "2",
        "language"             => "zh_CN"
    ];

		// 传入数据创建个性化菜单
		$weChat->officialAccount()->menu()->create($buttons, $matchRule);

```



#### 删除个性化菜单

<span style='color:red'>注：如果不传入menuid则为删除全部</span>

```php
    use EasySwoole\WeChat\WeChat;  
    // 传入menuid删除，menuid为菜单id，可以通过自定义菜单查询接口获取。
    $weChat->officialAccount()->menu()->delete(208379533);
```



#### 测试个性化菜单

```php
    use EasySwoole\WeChat\WeChat;  
		// 可以传入粉丝的OpenID，也可以是粉丝的微信号。
    $weChat->officialAccount()->menu()->match('openid OR wechat ID');
```



#### 获取自定义菜单配置

使用接口创建自定义菜单后，开发者还可使用接口查询自定义菜单的结构。另外请注意，在设置了个性化菜单后，使用本自定义菜单查询接口可以获取默认菜单和全部个性化菜单信息。

注：menu为默认菜单，conditionalmenu为个性化菜单列表。字段说明请见个性化菜单接口页的说明。

```php
    use EasySwoole\WeChat\WeChat;  		
		$weChat->officialAccount()->menu()->query();
```





## 消息管理

​	当普通微信用户向公众账号发消息时，微信服务器将POST消息的XML数据包到开发者填写的URL上。

请注意：

1.  关于重试的消息排重，推荐使用msgid排重。
2.  微信服务器在五秒内收不到响应会断掉连接，并且重新发起请求，总共重试三次。假如服务器无法保证在五秒内处理并回复，可以直接回复空串，微信服务器不会对此作任何处理，并且不会发起重试。详情请见“发送消息-被动回复消息”。
3.  如果开发者需要对用户消息在5秒内立即做出回应，即使用“发送消息-被动回复消息”接口向用户被动回复消息时，可以在		

------



### 接收普通消息

在EasySwooleEvent.php的mainServerCreate方法里注册

**查看所支持的[RequestConst预定义常量查看请点我](#RequestConst预定义常量查看)**

```php
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
```



### 接收事件推送

在EasySwooleEvent.php的mainServerCreate方法里注册事件

**查看所支持的事件[查看支持事件请点我](#RequestConst预定义常量查看)**

```php
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
```



### 接收语音识别结果

1，注册voice类型的普通消息事件，在EasySwooleEvent.php的mainServerCreate方法里：

```php
    use EasySwoole\WeChat\WeChat;
		use EasySwoole\WeChat\Bean\OfficialAccount\RequestConst;
		use EasySwoole\WeChat\Bean\OfficialAccount\RequestMsg;
    use EasySwoole\WeChat\Bean\OfficialAccount\Message\Text;

		// onMessage 方法是注册每个消息到达时的事件处理，你可以通过set(消息类型, 处理方法) 来注册。 (RequestConst类中提供预定义的类常量来进行注册多种消息类型)
		// 语音消息
    $weChat->officialAccount()->server()->onMessage()->set(RequestConst::MSG_TYPE_VOICE, function (RequestMsg $requestMsg) {
      	/*
      	* 使用$requestMsg实例可获取微信事件推送过来的内容例：$requestMsg->getToUserName();
      	*/
        var_dump('MSG_TYPE_VOICE 消息事件');
				      
      	// 获取Text Bean实例
        $text = new Text();
        // 设置回复内容
        $text->setContent('这里是EasySwoole，您的语音消息收到！);

        return $text;
    });
```



2，微信访问URL后接收且回复

```php
    /** @var string 微信发送的Body体 $rawContent */
    $rawContent = $this->request()->getBody();

    // 将请求转发给WeChat接管 会返回 XML string 或者 null
    try {
        // parserRequest会根据所响应的不同事件类型，自动解析并拼装内容完成回复
        $XML = $weChat->officialAccount()->server()->parserRequest($rawContent);
    } catch (\Throwable $throwable) {
        // 这里我建议开发者 catch 住异常 无论如何给用户响应友好的提示 防止出现公众号异常的问题
        // TODO: 这里实现一个异常记录 和发送服务器异常通知给开发者的代码
    }
    $this->response()->withStatus(Status::CODE_OK);
    $this->response()->write($XML ?? 'success');
```



### 被动回复消息

​			当用户发送消息给公众号时（或某些特定的用户操作引发的事件推送时），会产生一个POST请求，开发者可以在响应包（Get）中返回特定XML结构，来对该消息进行响应（现支持回复文本、图片、图文、语音、视频、音乐）。

#### 自动回复

下面是一个例子：回复何种消息取决于你在注册的事件中所写的内容

```php
    /** @var string 微信发送的Body体 $rawContent */
    $rawContent = $this->request()->getBody();


    // 将请求转发给名为 'default' WeChat接管 会返回 XML string 或者 null
    try {
      	// 这里会根据微信的事件推送类型自己触发所注册的相应事件
        $XML = WeChatManager::getInstance()->weChat('default')->officialAccount()->server()->parserRequest($rawContent);
    } catch (\Throwable $throwable) {
        // 这里我建议开发者 catch 住异常 无论如何给用户响应友好的提示 防止出现公众号异常的问题
        // TODO: 这里实现一个异常记录 和发送服务器异常通知给开发者的代码
    }

    $this->response()->withStatus(Status::CODE_OK);
    $this->response()->write($XML ?? 'success');
```



------

<span style="color:red">注：本篇章只写需要回复的内容如何设置，如何接收微信发过来的消息看"[接收消息章节](#接收事件推送) ，MediaId是指素材库中的媒体文件"</span>



#### 回复文本消息 

```php
    use EasySwoole\WeChat\Bean\OfficialAccount\Message\Text;

    // 获取Text Bean实例
    $text = new Text();
    // 设置回复内容
    $text->setContent('这里是EasySwoole，您发送的消息为'.$content);

    return $text;

```



#### 回复图片消息 

```php
    use EasySwoole\WeChat\Bean\OfficialAccount\Message\Image;

    // 获取Image Bean实例
    $image = new Image();
    // 设置通过素材管理中的接口上传多媒体文件，得到的id。
    $image->setMediaId(932625047);

    return $image;

```



#### 回复语音消息  

```php
    use EasySwoole\WeChat\Bean\OfficialAccount\Message\Voice;

    // 获取Voice Bean实例
    $voice = new Voice();
    // 设置通过素材管理中的接口上传多媒体文件，得到的id。
    $voice->setMediaId(932625047);

    return $voice;

```



#### 回复视频消息  

```php
    use EasySwoole\WeChat\Bean\OfficialAccount\Message\Video;

    // 获取Video Bean实例
    $video = new Video();
    // 设置通过素材管理中的接口上传多媒体文件，得到的id。
    $video->setMediaId(932625047);
    // 设置视频消息的标题
    $video->setTitle('EasySwoole教学视频');
    // 视频消息的描述
    $video->setDescription('EasySwoole轻轻松松学技术');

    return $video;

```



#### 回复音乐消息 

```php
    use EasySwoole\WeChat\Bean\OfficialAccount\Message\Music;

    // 获取Music Bean实例
    $music = new Music();
    // 音乐消息的标题
    $music->setTitle('EasySwoole教学视频');
    // 音乐消息的描述
    $music->setDescription('EasySwoole轻轻松松学技术');
    // 音乐消息的链接
    $music->setMusicURL('https://www.easyswoole.com/hai.mp3');
    // 高质量音乐链接，WIFI环境优先使用该链接播放音乐
    $music->setHQMusicUrl('https://www.easyswoole.com/hai.mp3');
    // 缩略图的媒体id，通过素材管理中的接口上传多媒体文件，得到的id
    $music->setThumbMediaId(932625047);

    return $music;

```



#### 回复图文消息 

```php
    use EasySwoole\WeChat\Bean\OfficialAccount\Message\News;


    // 获取News Bean实例
    $news = new News();
    /**
    * 图文消息；
    * 当用户发送文本、图片、视频、图文、地理位置这五种消息时开发者只能回复1条图文消息；
    * 其余场景最多可回复8条图文消息；
    */
    $news->setNews([
      [
        'Title'=>'EasySwoole官方一群',
        'Description'=>'633921431(已满,但可以试试挤挤)',
        'PicUrl'=>'https://www.easyswoole.com/Images/docNavLogo.png',
        'Url'=>'https://www.easyswoole.com',
      ],
      [
        'Title'=>'EasySwoole官方二群',
        'Description'=>'709134628(已满,但可以试试挤挤)',
        'PicUrl'=>'https://www.easyswoole.com/Images/docNavLogo.png',
        'Url'=>'https://www.easyswoole.com',
      ],
      [
        'Title'=>'EasySwoole官方三群',
        'Description'=>'932625047',
        'PicUrl'=>'https://www.easyswoole.com/Images/docNavLogo.png',
        'Url'=>'https://www.easyswoole.com',
      ]
    ]);

    return $news;

```



### 客服消息

​		当用户和公众号产生特定动作的交互时（具体动作列表请见下方说明），微信将会把消息数据推送给开发者，开发者可以在一段时间内（目前修改为48小时）调用客服接口，通过POST一个JSON数据包来发送消息给普通用户。

<span style="color:red">请注意，必须先在公众平台官网为公众号设置微信号后才能使用该能力，MediaId是指素材库中的媒体文件。</span>

#### 添加客服帐号

```php
   	use EasySwoole\WeChat\WeChat;
		use EasySwoole\WeChat\Bean\OfficialAccount\CustomerService;

    // 获取CustomerService实例
    $customerService = new CustomerService();
    // 设置客服账户，自定义名称@您的公众号的微信号
    $customerService->setKfAccount('chunze5@beijingchunze');
    // 设置昵称
    $customerService->setNickname('客服服务号004');
    // 使用service获取实例，调用addServiceAccount发送设置消息,成功返回bool值true

```



#### 修改客服账号

```php
   	use EasySwoole\WeChat\WeChat;
		use EasySwoole\WeChat\Bean\OfficialAccount\CustomerService;

    // 获取CustomerService实例
    $customerService = new CustomerService();
    // 设置客服账户，自定义名称@您的公众号的微信号
    $customerService->setKfAccount('chunze5@beijingchunze');
    // 设置昵称
    $customerService->setNickname('客服服务号05');
    // 使用service获取实例，调用update传入CustomerService实例
    $weChat->officialAccount()->service()->update($customerService);

```



#### 删除客服账号

```php
   	use EasySwoole\WeChat\WeChat;
		use EasySwoole\WeChat\Bean\OfficialAccount\CustomerService;

    // 使用service获取实例，调用delete传入客服账号
    $weChat->officialAccount()->service()->delete('EasySwoole1@EasySwoole3');
```



#### 设置客服账号头像

```php
   	use EasySwoole\WeChat\WeChat;
		use EasySwoole\WeChat\Bean\PostFile;

    // 获取PostFile实例
    $postFile = new PostFile();
    // 设置文件路径
    $postFile->setPath($path);
    // 使用service获取实例，调用setAvatar传入客服账号和PostFile实例
    $weChat->officialAccount()->service()->setAvatar('chunze3@beijingchunze', $postFile);
```



#### 获取所有客服账号列表

```php
   	use EasySwoole\WeChat\WeChat;

    // 使用service获取实例，调用getAllServiceList来请求获取所有客服账户列表
    $list = $weChat->officialAccount()->service()->getAllServiceList();
        
```



#### 客服接口-发消息

##### 发送文本消息

```php
   	use EasySwoole\WeChat\WeChat;
		use \EasySwoole\WeChat\Bean\OfficialAccount\ServiceMessage\Text;

    // 获取Text Bean消息实例
    $text = new Text();
    // 设置OPENID
    $text->setTouser('oofFl0_HuZ');
    /**
    * 设置消息内容，发送文本消息时，支持插入跳小程序的文字链例：
    * 文本内容<a href="http://www.qq.com" data-miniprogram-appid="appid" data-miniprogram-path="pages/index/index">点击跳小程序</a>
    */
    $text->setContent('快到EasySwoole碗里来！');
    // 使用service获取实例，调用sendServiceMsg传入Text Bean实例发送消息
    $weChat->officialAccount()->service()->sendServiceMsg($text);

```



##### 发送图片消息

```php
   	use EasySwoole\WeChat\WeChat;
		use \EasySwoole\WeChat\Bean\OfficialAccount\ServiceMessage\Image;

    // 获取Image Bean消息实例
    $image = new Image();
    // 设置OPENID
    $image->setTouser('oofFl0_HuZ');
    // 发送的图片/语音/视频/图文消息（点击跳转到图文消息页）的媒体ID
    $image->setMediaId('932625047');
    // 使用service获取实例，调用sendServiceMsg传入Image Bean实例发送消息
    $weChat->officialAccount()->service()->sendServiceMsg($image);

```



##### 发送语音消息

```php
   	use EasySwoole\WeChat\WeChat;
		use \EasySwoole\WeChat\Bean\OfficialAccount\ServiceMessage\Voice;

    // 获取Voice Bean消息实例
    $voice = new Voice();
    // 设置OPENID
    $voice->setTouser('oofFl0_HuZ3');
    // 发送的图片/语音/视频/图文消息（点击跳转到图文消息页）的媒体ID
    $voice->setMediaId(932625047);
    // 使用service获取实例，调用sendServiceMsg传入Voice Bean实例发送消息
    $weChat->officialAccount()->service()->sendServiceMsg($voice);

```



##### 发送视频消息

```php
  	use EasySwoole\WeChat\WeChat;
		use \EasySwoole\WeChat\Bean\OfficialAccount\ServiceMessage\Video;

    // 获取Video Bean消息实例
    $video = new Video();
    // OPENID
    $video->setTouser('oofFl0_HuZ3');
    // 发送的图片/语音/视频/图文消息（点击跳转到图文消息页）的媒体ID
    $video->setMediaId('932625047');
    // 缩略图/小程序卡片图片的媒体ID，小程序卡片图片建议大小为520*416
    $video->setThumbMediaId('932625047');
    // 标题
    $video->setTitle('’快到EasySwoole碗里来！');
    // 描述
    $video->setDescription('快到EasySwoole碗里来！');
    // 使用service获取实例，调用sendServiceMsg传入Video Bean实例发送消息
    $weChat->officialAccount()->service()->sendServiceMsg($video);

```



##### 发送音乐消息

```php
  	use EasySwoole\WeChat\WeChat;
		use \EasySwoole\WeChat\Bean\OfficialAccount\ServiceMessage\Music;

    // 获取Music Bean消息实例
    $music = new Music();
    // OPENID
    $music->setTouser('oofFl0_HuZ3');
    // 标题
    $music->setTitle('音乐标题');
    // 描述
    $music->setDescription('oofFl0_HuZ3');
    // 音乐链接
    $music->setMusicUrl('https://www.easyswoole.com');
    // 高品质音乐链接，wifi环境优先使用该链接播放音乐
    $music->setHqMusicUrl('https://www.easyswoole.com');
    // 缩略图/小程序卡片图片的媒体ID，小程序卡片图片建议大小为520*416
    $music->setThumbMediaId('666666666');
    // 使用service获取实例，调用sendServiceMsg传入Music Bean实例发送消息
    $weChat->officialAccount()->service()->sendServiceMsg($music);

```



##### 发送图文消息

```php
  	use EasySwoole\WeChat\WeChat;
		use \EasySwoole\WeChat\Bean\OfficialAccount\ServiceMessage\News;

    // 获取News Bean消息实例
    $news = new News();
    // 设置OPENID
    $news->setTouser('oofFl0_HuZ3');
    /**
    * 设置相关数据（news方式的数据设置）
    */
    $news->setTitle('音乐标题');
    $news->setDescription('我是EasySwoole的描述君。');
    $news->setUrl('https://www.easyswoole.com');
    $news->setPicUrl('https://www.easyswoole.com/Images/docNavLogo.png');
    /**
    * 设置MediaId值将以mpnews方式发送数据，news的设置则失效
    */
    // $news->setMediaId('666666666');

    // 使用service获取实例，调用sendServiceMsg传入Video Bean实例发送消息
    $weChat->officialAccount()->service()->sendServiceMsg($news);

```



##### 发送菜单消息

```php
  	use EasySwoole\WeChat\WeChat;
		use \EasySwoole\WeChat\Bean\OfficialAccount\ServiceMessage\MsgMenu;

    // 获取MsgMenu Bean消息实例
    $msgMenu = new MsgMenu();
    /**
    * 设置相关数据（news方式的数据设置）
    */
    // OPENID
    $msgMenu->setTouser('oofFl0_HuZ3');
    // 菜单头部内容
    $msgMenu->setHeadContent('您对本次服务是否满意呢');
    // 菜单选项
    $msgMenu->setList([
      ['id'=>101, "content"=>'满意'],
      ['id'=>102, "content"=>'不满意'],
    ]);
    // 菜单底部内容
    $msgMenu->setTailContent('欢迎再次光临EasySwoole');

    // 使用service获取实例，调用sendServiceMsg传入MsgMenu Bean实例发送消息
    $weChat->officialAccount()->service()->sendServiceMsg($msgMenu);

```

按照上述例子，用户会看到这样的菜单消息：

“您对本次服务是否满意呢？

满意

不满意

欢迎再次光临EasySwoole”



其中，“满意”和“不满意”是可点击的，当用户点击后，微信会发送一条XML消息到开发者服务器，格式如下：

```xml
<xml>
<ToUserName><![CDATA[ToUser]]></ToUserName>
<FromUserName><![CDATA[FromUser]]></FromUserName>
<CreateTime>1500000000</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[满意]]></Content>
<MsgId>1234567890123456</MsgId>
<bizmsgmenuid>101</bizmsgmenuid>
</xml>
```

XML参数说明：

| 参数         | 说明                 |
| :----------- | :------------------- |
| ToUserName   | 开发者帐号           |
| FromUserName | 接收方帐号（OpenID） |
| CreateTime   | 消息创建时间戳       |
| MsgType      | Text                 |
| Content      | 点击的菜单名         |
| MsgId        | 消息ID               |
| bizmsgmenuid | 点击的菜单ID         |

收到XML推送之后，开发者可以根据提取出来的bizmsgmenuid和Content识别出微信用户点击的是哪个菜单。



##### 发送卡卷消息

```php
  	use EasySwoole\WeChat\WeChat;
		use \EasySwoole\WeChat\Bean\OfficialAccount\ServiceMessage\WxCard;

    // 获取WxCard Bean消息实例
    $wxCard = new WxCard();
    // 设置OPENID
    $wxCard->setTouser('oofFl0_HuZ3');
    // 设置卡卷ID
    $wxCard->setCardId('66666666666');
    // 使用service获取实例，调用sendServiceMsg传入WxCard Bean实例发送消息
    $weChat->officialAccount()->service()->sendServiceMsg($wxCard);
```



##### 发送小程序卡片消息

```php
  	use EasySwoole\WeChat\WeChat;
		use \EasySwoole\WeChat\Bean\OfficialAccount\ServiceMessage\MiniProgramPage;

    // 获取MiniProgramPage Bean消息实例
    $miniprogrampage = new MiniProgramPage();
    // 设置OPENID
    $miniprogrampage->setTouser('oofFl0_HuZ3');
    // 标题
    $miniprogrampage->setTitle('我是标题');
    // 小程序APPID
    $miniprogrampage->setAppid('wx9c04');
    // 小程序页面
    $miniprogrampage->setPagepath('index/index');
    // 缩略图/小程序卡片图片的媒体ID，小程序卡片图片建议大小为520*416
    $miniprogrampage->setThumbMediaId('66666666');
    // 设置以哪个客服账号发送小程序卡片，不设置以公众号发送
    $miniprogrampage->setKfAccount('EasySwoole1@EasySwoole');
    // 使用service获取实例，调用sendServiceMsg传入MiniProgramPage Bean实例发送消息
    $weChat->officialAccount()->service()->sendServiceMsg($miniprogrampage);

```



#### 客服接口-客服输入状态

```php
  	use EasySwoole\WeChat\WeChat;
		use \EasySwoole\WeChat\Bean\OfficialAccount\ServiceMessage\Command;

    // 获取Command Bean实例
    $command = new Command();
    // 设置OPENID
    $command->setTouser('oofFl0_HuZ3');
    // 调用此方法即下发"正在输入"状态，不调用则取消下发的状态
    $command->setCommand();
    // 使用service获取实例，调用sendServiceCommand传入Command Bean实例发送消息
    $weChat->officialAccount()->service()->sendServiceCommand($command);

```



### 群发接口

在公众平台网站上，为订阅号提供了每天一条的群发权限，为服务号提供每月（自然月）4条的群发权限。而对于某些具备开发能力的公众号运营者，可以通过高级群发接口，实现更灵活的群发能力。

<span style='color:red'>注：need_open_comment 和 only_fans_can_comment 的设置需要公众号具备留言功能的权限</span>

<span style='color:red'>注：群发接口 clientmsgid 参数，调用群发接口时可以主动设置 clientmsgid 参数，避免重复推送。</span>



#### 上传图文消息内的图片获取URL

【订阅号与服务号认证后均可用】

请注意，本接口所上传的图片不占用公众号的素材库中图片数量的5000个的限制。图片仅支持jpg/png格式，大小必须在1MB以下。

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\MediaRequest;

    // 图片路径
    $path = '/Volumes/Web Server/easyswoole/123.jpg';
    // 获取 MediaRequest 媒体实例
    $mediaRequest = new MediaRequest();
    // 设置文件路径
    $mediaRequest->setPath($path);
    // 使用material获取该实例，调用uploadArticleImage传入MediaRequest实例
    $weChat->officialAccount()->material()->uploadArticleImage($mediaRequest);
```

返回说明 正常情况下的返回结果为：

```json
{
   "url":"http://mmbiz.qpic.cn/mmbiz/gLO17UPS6FS2xsypf378iaNhWacZ1G1UplZYWEYfwvuU6Ont96b1roYs CNFwaRrSaKTPCUdBK9DgEHicsKwWCBRQ/0"
}
```

其中url就是上传图片的URL，可用于后续群发中，放置到图文消息中。

错误时微信会返回错误码等信息，请根据错误码查询错误信息



#### 上传图文消息素材（临时素材）

【订阅号与服务号认证后均可用】

<span style="color:red">注：根据微信规定，该接口中的 “thumb_media_id” 只允许使用临时素材的id，使用永久素材会报错，且使用该接口上传成功后的图文消息是临时素材，在素材库中查询不到。 </span>

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\MediaArticle;

		// 构建图文数据1
    $articleOne = [
      'title'                 => 'EasySwoole，Wechat！',
      'thumb_media_id'        => 'Qk6KMVRN7vWHPjr9hwfluiguE8CZVlU0rOPSFHfD7jk',
      'author'                => 'EasySwoole/Wechat',
      'show_cover_pic'        => 1,
      'digest'                => 'digest',
      'content'               => 'content',
      'content_source_url'    => 'https://www.easyswoole.com',
      'need_open_comment'     => 1,
      'only_fans_can_comment' => 1
    ];
    // 构建图文数据2
    $articleTwo = [
      'title'                 => 'Wechat，EasySwoole！',
      'thumb_media_id'        => 'Qk6KMVRN7vWHPjr9hwfluiguE8CZVlU0rOPSFHfD7jk',
      'author'                => 'EasySwoole/WeChat',
      'show_cover_pic'        => 1,
      'digest'                => 'digest',
      'content'               => 'content',
      'content_source_url'    => 'https://www.easyswoole.com',
      'need_open_comment'     => 1,
      'only_fans_can_comment' => 0
    ];
    // 获取MediaArticle Bean实例时传入构建数据1
    $mediaArticle1 = new MediaArticle($articleOne);
    // 获取MediaArticle Bean实例时传入构建数据2
    $mediaArticle2 = new MediaArticle($articleTwo);
    // 使用media获取实例调用uploadNew方法传入构建的数据即可
    $weChat->officialAccount()->media()->uploadNews($mediaArticle1, $mediaArticle2);
```

**如果需要在群发图文中插入小程序，则在调用上传图文消息素材接口时，需在content字段中添加小程序跳转链接，有以下三种样式的可供选择。**

**小程序卡片跳转小程序，代码示例：**

```html
<mp-miniprogram data-miniprogram-appid="wx123123123" data-miniprogram-path="pages/index/index" data-miniprogram-title="小程序示例" data-progarm-imageurl="http://mmbizqbic.cn/demo.jpg"></mp-miniprogram>
```

**文字跳转小程序，代码示例：**

```html
<p><a data-miniprogram-appid="wx123123123" data-miniprogram-path="pages/index" href="">点击文字跳转小程序</a></p>
```

**图片跳转小程序，代码示例：**

```html
<p><a data-miniprogram-appid="wx123123123" data-miniprogram-path="pages/index" href=""><img src="http://mmbiz.qpic.cn/mmbiz_jpg/demo/0?wx_fmt=jpg" alt="" data-width="null" data-ratio="NaN"></a></p>
```



#### 根据标签进行群发

##### 图文消息

```php
		use EasySwoole\WeChat\WeChat;
		use EasySwoole\WeChat\Bean\OfficialAccount\GroupSendingMessage\News;

    // 获取News Bean实例
    $news = new News();
    // 设定是否向全部用户发送，选择true该消息群发给所有用户，选择false可根据tag_id发送给指定群组的用户
    $news->setIsToAll(false);
		// 设定群发到的标签的tag_id
    $news->setTagId(100);
		// 用于群发的消息的media_id
    $news->setMediaId('Qk6KMVRN7vWHPjr9hwflutq。。。');
		// 图文消息被判定为转载时，是否继续群发。 1为继续群发（转载），0为停止群发。 该参数默认为0。
    $news->setSendIgnoreReprint(1);
    // 避免重复推送
    $news->setClientMsgID('send_tag_2');
    // 使用groupSending获取实例并调用sendAllTag方法传入News Bean实例进行发送
    $weChat->officialAccount()->groupSending()->sendAllTag($news);
```



##### 文本消息

```php
		use EasySwoole\WeChat\WeChat;
		use EasySwoole\WeChat\Bean\OfficialAccount\GroupSendingMessage\Text;

    // 获取Text Bean实例
    $text = new Text();
    // 设定是否向全部用户发送，选择true该消息群发给所有用户，选择false可根据tag_id发送给指定群组的用户
    $text->setIsToAll(false);
		// 设定群发到的标签的tag_id
    $text->setTagId(100);
		// 设定群发的内容
    $text->setContent('EaswSwoole群发提醒您！');
    // 避免重复推送
    $text->setClientMsgID('send_tag_2');
    // 使用groupSending获取实例并调用sendAllTag方法传入Text Bean实例进行发送
    $weChat->officialAccount()->groupSending()->sendAllTag($text);
```



语音音频

```php
		use EasySwoole\WeChat\WeChat;
		use EasySwoole\WeChat\Bean\OfficialAccount\GroupSendingMessage\Voice;

    // 获取Voice Bean实例
    $voice = new Voice();
    // 设定是否向全部用户发送，选择true该消息群发给所有用户，选择false可根据tag_id发送给指定群组的用户
    $voice->setIsToAll(false);
    // 设定群发到的标签的tag_id
    $voice->setTagId(100);
    // 用于群发的消息的media_id
    $voice->setMediaId('Qk6KMVRN7vWHPjr9hw。。。');
    // 避免重复推送
    $voice->setClientMsgID('send_tag_2');
    // 使用groupSending获取实例并调用sendAllTag方法传入Voice Bean实例进行发送
    $weChat->officialAccount()->groupSending()->sendAllTag($voice);
```



##### 图片消息

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\GroupSendingMessage\Image;

    // 获取Image Bean实例
    $image = new Image();
    // 设定是否向全部用户发送，选择true该消息群发给所有用户，选择false可根据tag_id发送给指定群组的用户
    $image->setIsToAll(false);
    // 设定群发到的标签的tag_id
    $image->setTagId(100);
    // 用于群发的消息的media_id是数组
    $image->setMediaIds([
      'Qk6KMVRN7vWHPjr9hwfluv。。。1',
      'Qk6KMVRN7vWHPjr9hwfluv。。。2'
    ]);
    // 推荐语，不填则默认为“分享图片”
    $image->setRecommend('精彩图片');
    //  是否打开评论，0不打开，1打开
    $image->setNeedOpenComment(1);
    // 是否粉丝才可评论，0所有人可评论，1粉丝才可评论
    $image->setOnlyFansCanComment(1);
    // 避免重复推送
    $image->setClientMsgID('send_tag_2');
    // 使用groupSending获取实例并调用sendAllTag方法传入Image Bean实例进行发送
    $weChat->officialAccount()->groupSending()->sendAllOpenID($image);
```



##### 视频消息

<span style='color:red'>注：视频消息的media_id如果是临时素材需要进行转换</span>

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\GroupSendingMessage\Video;

    // 获取Video Bean实例
    $video = new Video();
    // 设定是否向全部用户发送，选择true该消息群发给所有用户，选择false可根据tag_id发送给指定群组的用户
    $video->setIsToAll(false);
    // 设定群发到的标签的tag_id
    $video->setTagId(100);
    // 用于群发的消息的media_id
    $video->setMediaId('Qk6KMVRN7vWHPjr9hwf。。。');
    // 避免重复推送
    $video->setClientMsgID('send_tag_2');
    // 如果是发送临时视频素材需要设置以下三个数据

		// // true为启用临时素材的media_id转换，默认false为永久素材，不需要转换
    // $video->setIsTemporary(true); 
    // $video->setTitle("标题");
    // $video->setDescription("描述");

    // 使用groupSending获取实例并调用sendAllTag方法传入Video Bean实例进行发送
    $weChat->officialAccount()->groupSending()->sendAllTag($video);
```



##### 卡卷消息

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\GroupSendingMessage\WxCard;

    // 获取WxCard Bean实例
    $wxCard = new WxCard();
    // 设置相关信息
    // 设定是否向全部用户发送，选择true该消息群发给所有用户，选择false可根据tag_id发送给指定群组的用户
    $video->setIsToAll(false);
    // 设定群发到的标签的tag_id
    $video->setTagId(100);
    // 用于群发的消息的卡卷card_id
    $wxCard->setCardId('Qk6KMVRN7vWHPjr9hwfluuBErNV7。。。');
    // 避免重复推送
    $wxCard->setClientMsgID('send_tag_2');
    // 使用groupSending获取实例并调用sendAllTag方法传入WxCard Bean实例进行发送
    $weChat->officialAccount()->groupSending()->sendAllTag($wxCard);
```



#### 根据OpenID列表群发

【订阅号不可用，服务号认证后可用】

##### 使用方法

”OpenID群发“与”标签群发“ 的内容设定方式一样只有发送对象的方式设定不一样

唯一不同地方，示例：

```php

    // 标签群发使用setIsToAll和setTagId来指定群发范围
    $text->setIsToAll(false);
    $text->setTagId(101);

    // OpenID群发使用setTouser传入一个数组来指定接收群发的用户，最少2个最多10000个
    $text->setTouser([
      'oofFl07U3fwsg。。。1',
      'oofFl07U3fwsg。。。2'
    ]);

```



#### 删除群发

```php
// 使用groupSending获取实例并调用delete方法传入消息ID（msg_id）和条目位置（article_idx），默认全部
$weChat->officialAccount()->groupSending()->delete(3147483663); // 删除全部
$weChat->officialAccount()->groupSending()->delete(3147483663，2); // 删除的文章在图文消息中的位置（第二篇）
```



#### 预览接口

##### 文本预览

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\GroupSendingMessage\Text;

    // 获取Text Bean实例
    $text = new Text();
    /*
    * 接收消息用户对应该公众号的openid，该字段也可以改为towxname，以实现对微信号的预览
    * $text->setToWxName('微信号');
    */
    $text->setTouser('oofFl0_HuZ3Xa。。。g');
    // 设定预览内容
    $text->setContent('EaswSwoole群发提醒您！');
    // 使用groupSending获取实例并调用sendPreview方法传入Text Bean实例进行发送
    $weChat->officialAccount()->groupSending()->sendPreview($text);
```


##### 卡卷预览

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\GroupSendingMessage\WxCard;

    // 获取WxCard Bean实例
    $wxCard = new WxCard();
    /*
    * 接收消息用户对应该公众号的openid，该字段也可以改为towxname，以实现对微信号的预览
    * $text->setToWxName('微信号');
    */
    $wxCard->setTouser('oofFl0_HuZ3Xa。。。g');
    // 设定卡卷ID
    $wxCard->setCardId('Qk6KMVRN7vWHPjr9hw...');
    // 使用groupSending获取实例并调用sendPreview方法传入WxCard Bean实例进行发送
    $weChat->officialAccount()->groupSending()->sendPreview($wxCard);
```


##### 其他类型预览

其他类型信息的预览使用方式一样，根据想要预览的类型不同获取不同的类型实例即可。

```php
    use EasySwoole\WeChat\WeChat;  
    use EasySwoole\WeChat\Bean\OfficialAccount\GroupSendingMessage\News;
    use EasySwoole\WeChat\Bean\OfficialAccount\GroupSendingMessage\Voice;
    use EasySwoole\WeChat\Bean\OfficialAccount\GroupSendingMessage\Image;
    use EasySwoole\WeChat\Bean\OfficialAccount\GroupSendingMessage\Video;

		/*
		* 根据自己的预览需求 new不同的类型即可
		*/
    $bean = new News();  // 图文
    $bean = new Voice(); // 音频
    $bean = new Image(); // 图片
    $bean = new Video(); // 视频

    /*
    * 接收消息用户对应该公众号的openid，该字段也可以改为towxname，以实现对微信号的预览
    * $bean->setToWxName('微信号');
    */
    $bean->setTouser('oofFl0_HuZ3Xa。。。g');
    $bean->setMediaId('Qk6KMVRN7vWHPjr9hwf......');

    // 使用groupSending获取实例并调用sendPreview方法传入Bean实例进行发送
    $weChat->officialAccount()->groupSending()->sendPreview($bean);
```

### 



#### 查询群发消息发送状态

```php
    // 使用groupSending获取实例并调用queryState方法传入msg_id即可
    $weChat->officialAccount()->groupSending()->queryState(3147483663);
```



#### 控制群发速度

##### 获取群发速度

```php
$weChat->officialAccount()->groupSending()->getSendingSpeed();
```



##### 设置群发速度

```php
// 传入0~4的int型数字
$weChat->officialAccount()->groupSending()->setSendingSpeed(3);
```



### 模板消息接口

关于使用规则，请注意：

1.  所有服务号都可以在功能->添加功能插件处看到申请模板消息功能的入口，但只有认证后的服务号才可以申请模板消息的使用权限并获得该权限；
2.  需要选择公众账号服务所处的2个行业，每月可更改1次所选行业；
3.  在所选择行业的模板库中选用已有的模板进行调用；
4.  每个账号可以同时使用25个模板。
5.  当前每个账号的模板消息的日调用上限为10万次，单个模板没有特殊限制。【2014年11月18日将接口调用频率从默认的日1万次提升为日10万次，可在MP登录后的开发者中心查看】。当账号粉丝数超过10W/100W/1000W时，模板消息的日调用上限会相应提升，以公众号MP后台开发者中心页面中标明的数字为准。

关于接口文档，请注意：

1.  模板消息调用时主要需要模板ID和模板中各参数的赋值内容；

2.  模板中参数内容必须以".DATA"结尾，否则视为保留字；

3.  模板保留符号""。

    

#### 设置所属行业

```php
    use EasySwoole\WeChat\WeChat;

    // 设置所属行业(传入参数为mixed类型，返回bool)
    $weChat->officialAccount()->templateMsg()->setIndustry(1,2,3,4,5);
```


#### 获取设置的行业信息

```php
    use EasySwoole\WeChat\WeChat;

    // 设置所属行业(传入参数为mixed类型，返回bool)
    $weChat->officialAccount()->templateMsg()->setIndustry(1,2,3,4,5);
```



#### 获得模板ID

```php
    use EasySwoole\WeChat\WeChat;

    // 获得模板id (传入模板库编号)
    $tempID = $weChat->officialAccount()->templateMsg()->addTemplate('OPENTM405653850');
```



#### 获取模板列表

```php
    use EasySwoole\WeChat\WeChat;

    // 获取模板消息列表
    $tempMsgList = $weChat->officialAccount()->templateMsg()->getPrivateTemplates();
```



#### 删除模板

```php
    use EasySwoole\WeChat\WeChat;

    // 删除模板消息(传入模板id)
    $weChat->officialAccount()->templateMsg()->deletePrivateTemplate('defKN5rpMMhwky9...');
```



#### 发送模板消息

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\TemplateMsg;
  /**
  * 发送模板消息例如以下模板消息
  * 
  array(6) {
        ["template_id"]=>
        string(43) "JfZ-AIkdeftPafZKN5rpMMhwky9r1DzflOZKw_QHDiU"
        ["title"]=>
        string(18) "下单成功通知"
        ["primary_industry"]=>
        string(8) "IT科技"
        ["deputy_industry"]=>
        string(22) "互联网|电子商务"
        ["content"]=>
        string(96) "{{first.DATA}}
        服务内容：{{keyword1.DATA}}
        预约时间：{{keyword2.DATA}}
        {{remark.DATA}}"
        ["example"]=>
        string(215) "感谢您选择神工007，您的订单[D234254433]正在分配工人，请稍候。
        服务内容：吊灯安装等
        预约时间：2016-05-15 上午
        如有疑问，请联系神工007客服电话：400-007-1515。"
   }
   */

    // 获取TemplateMsg Bean 实例
    $templateMsg = new TemplateMsg();
    // 设置openID
    $templateMsg->setTouser('oE4W1t7_CfmqeG2D....');
    // 设置所需跳转到的小程序appid
    $templateMsg->setAppid('xiaochengxuappid12345');
    // 设置所需跳转到的小程序路径
    $templateMsg->setPagepath('index?foo=bar');
    // 设置模板template_id
    $templateMsg->setTemplateId('JfZ-AIkdeftPafZKN5rpMMhw....');
    // 设置模板发送数据
    $tempData = [
      'first'    => '恭喜你购买成功',
      'keyword1' => 'EasySwoole手把屌教学服务',
      'keyword2' => date('Y-m-d H:i:s', time()),
      'remark'   => '往后的日子大佬将带你飞飞飞飞飞飞飞飞飞飞',
    ];
    $templateMsg->setData($tempData);
    // 发送
		$weChat->officialAccount()->templateMsg()->send($templateMsg);

```



### 一次性订阅消息

开发者可以通过一次性订阅消息授权让微信用户授权第三方移动应用（[接入说明](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1500434436_aWfqW&token=&lang=zh_CN)）或公众号，获得发送一次订阅消息给到授权微信用户的机会。

授权微信用户可以不需要关注公众号。微信用户每授权一次，开发者可获得一次下发消息的权限。（注意：同一用户在同一scene场景值下的多次授权不累积下发权限，只能下发一条。若要订阅多条，需要不同scene场景值）



#### 第一步：用户授权

需要用户同意授权，获取一次给用户推送一条订阅模板消息的机会

在确保微信公众帐号拥有订阅消息授权的权限的前提下（已认证的公众号即有权限，可登录公众平台在接口权限列表处查看），引导用户在微信客户端打开如下链接：

>   https://mp.weixin.qq.com/mp/subscribemsg?action=get_confirm&appid=wxaba38c7f163da69b&scene=1000&template_id=1uDxHNXwYQfBmXOfPJcjAS3FynHArD8aWMEFNRGSbCc&redirect_url=http%3a%2f%2fsupport.qq.com&reserved=test#wechat_redirect

**参数说明**

| 参数             | 是否必须 | 说明                                                         |
| :--------------- | :------- | :----------------------------------------------------------- |
| action           | 是       | 直接填get_confirm即可                                        |
| appid            | 是       | 公众号的唯一标识                                             |
| scene            | 是       | 重定向后会带上scene参数，开发者可以填0-10000的整形值，用来标识订阅场景值 |
| template_id      | 是       | 订阅消息模板ID，登录公众平台后台，在接口权限列表处可查看订阅模板ID |
| redirect_url     | 是       | 授权后重定向的回调地址，请使用UrlEncode对链接进行处理。 注：要求redirect_url的域名要跟登记的业务域名一致，且业务域名不能带路径。 业务域名需登录公众号，在设置-公众号设置-功能设置里面对业务域名设置。 |
| reserved         | 否       | 用于保持请求和回调的状态，授权请后原样带回给第三方。该参数可用于防止csrf攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加session进行校验，开发者可以填写a-zA-Z0-9的参数值，最多128字节，要求做urlencode |
| #wechat_redirect | 是       | 无论直接打开还是做页面302重定向时，必须带此参数              |

**用户同意或取消授权后会返回相关信息**

如果用户点击同意或取消授权，页面将跳转至：

>   redirect_url/?openid=OPENID&template_id=TEMPLATE_ID&action=ACTION&scene=SCENE

**参数说明**

| 参数        | 说明                                                         |
| :---------- | :----------------------------------------------------------- |
| openid      | 用户唯一标识，只在用户确认授权时才会带上                     |
| template_id | 订阅消息模板ID                                               |
| action      | 用户点击动作，"confirm"代表用户确认授权，"cancel"代表用户取消授权 |
| scene       | 订阅场景值                                                   |
| reserved    | 请求带入原样返回                                             |



#### 第二步：发送信息

通过API推送订阅模板消息给到授权微信用户

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\TemplateMsg;

		// 获取TemplateMsg Bean实例
    $template = new TemplateMsg();
		// 设定openid
    $template->setTouser('oofFl0_HuZ3Xa9....');
		// 设定订阅消息模板ID，登录公众平台后台，在接口权限列表处可查看订阅模板ID
    $template->setTemplateId('eMuG4etIdo5amBf3bcWBT...');
		// 设定点击消息跳转的链接，需要有ICP备案
    $template->setUrl('http://w.cqchunze.com/');
		// 设定跳转到的小程序appid（appid必须与公众号是绑定关系，并且小程序要求是已发布的）
    $template->setAppid('wx9c041483abd8a693');
		// 设定跳转到小程序的具体页面路径，支持带参数,（示例index?foo=bar）
    $template->setPagepath('pages/info/info?id=88');
		// 设定订阅场景值，该值必须与第一步的scene值相同不然会发送失败
    $template->setScene(99);
		// 消息标题
    $template->setTitle('骑着小摩托');
		/*
		* 消息正文，value为消息内容文本（200字以内），没有固定格式，可用\n换行.
		* color为整段消息内容的字体颜色（目前仅支持整段消息为一种颜色）
		*/
    $template->setData([
      'content' => [
        'value' => '骑着我心爱的小摩托~~~嘟嘟嘟嘟！',
        'color' => '#bf9f28'
      ]
    ]);
		// 传入TemplateMsg Bean实例发送
    $weChat->officialAccount()->templateMsg()->sendSubscription($template);
```



## 微信网页开发



### 网页授权

#### **第一步：用户同意授权，获取code**

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\JsAuthRequest;

    // 获取JsApi对象
    $jsApi = $weChat->officialAccount()->jsApi();

    // 创建微信授权跳转连接
    $jsAuthRequest = new JsAuthRequest();
    // 设置授权后回调地址
    $jsAuthRequest->setRedirectUri('http://m.evalor.cn');
    // 设置 state
    $jsAuthRequest->setState('test');
    // 设置授权类型
    $jsAuthRequest->setType($jsAuthRequest::TYPE_USER_INFO);
    // 返回生成地址 需要开发者自行重定向用户
    $link = $jsApi->auth()->generateURL($jsAuthRequest);
```

#### **第二步：通过code换取网页授权access_token**

使用微信回调时提供的 code 获取AccessToken 

从微信回调时附带在 url的get参数上 前端或者后端获取都可以

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\JsAuthRequest;

    $code = '这是回调获取到的code';
    // code换去授权
    $snsAuthBean  = $jsApi->auth()->codeToToken($code);
    // 用户授权的作用域，使用逗号（,）分隔
    $snsAuthBean->getScope();
    // 用户唯一标识，请注意，在未关注公众号时，用户访问公众号的网页，也会产生一个用户和公众号唯一的OpenID
    $snsAuthBean->getOpenid();
    // 网页授权接口调用凭证,注意：此access_token与基础支持的access_token不同
    $snsAuthBean->getAccessToken();
    // 用户刷新access_token用的
    $snsAuthBean->getRefreshToken();
    // 用户刷新access_token
    $snsAuthBean->getExpiresIn();

```



#### **第三步：刷新access_token（如果需要）**

```php
    // 获取第二步的refresh_token
    $token = $snsAuthBean->getRefreshToken();
    // 传入token
    $snsAuthBean = $jsApi->auth()->refreshToken($token);
```



#### **第四步：拉取用户信息(需scope为 snsapi_userinfo)**

```php
    // 使用上面提供的 $snsAuthBean对象 获取用户信息
    $user = $jsApi->auth()->tokenToUser($snsAuthBean);
    $user->getOpenid();
    $user->getHeadimgurl();
    $user->getNickname();
    // 更多信息自行阅读源码
```

#### 附：快速获取

是上述的封装

```php
    // 直接使用 code 获取用户信息，是上述操作的快捷封装
    $user = $jsApi->auth()->codeToUser($code);
```

#### **附：检验授权凭证（access_token）是否有效**

```php
    $snsAuthBean->setOpenid();
    $snsAuthBean->setAccessToken();
    $check = $jsApi->auth()->authCheck($snsAuthBean);
```



### 服务JS-SDK

```php
$url = '这里是URL地址';  
// 获取前端注册wx.config使用的签名包
$jsApiSignaturePack = $jsApi->sdk()->signature($url);
// 获取相关信息
$jsApiSignaturePack->getAppId();
$jsApiSignaturePack->getNonceStr();
$jsApiSignaturePack->getSignature();
$jsApiSignaturePack->getTimestamp();
```



## 素材管理

新增参数 ：

need_open_comment —— 是否打开评论，0不打开，1打开 

 only_fans_can_comment —— 是否粉丝才可评论，0所有人可评论，1粉丝才可评论。

注意，这两个参数只有在具有留言功能的公众号上能使用，但是目前新注册微信公众号不开放该功能，只有以前注册的公众号具有该功能。

------



### 新增临时素材

<span style='color:red'>注：临时的图文素材去这里  --> [上传图文消息素材（临时素材）请点我](#上传图文消息素材（临时素材）) </span>

1、临时素材media_id是可复用的。

2、**媒体文件在微信后台保存时间为3天，即3天后media_id失效。**

3、上传临时素材的格式、大小限制与公众平台官网一致。 

图片（image）: 2M，支持PNG\JPEG\JPG\GIF格式

语音（voice）：2M，播放长度不超过60s，支持AMR\MP3格式

视频（video）：10MB，支持MP4格式

缩略图（thumb）：64KB，支持JPG格式

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\MediaRequest;

    if (!$path) {
      // 上传文件路径
      $path = '/Volumes/Web Server/easyswoole/img/3.jpg';
    }
    // 获取MediaRequest Bean实例
    $media = new MediaRequest();
    // 设定素材类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
    $media->setType($media::TYPE_THUMB);
    // 设定素材的本地路径
    $media->setPath($path);
    // 传入MediaRequest Bean实例即可
    $weChat->officialAccount()->media()->upload($media);
```



### 获取临时素材

#### 获取素材

```php
    use EasySwoole\WeChat\WeChat;

    // 传入临时素材的media_id;
    $mediaResponse = $weChat->officialAccount()->media()->get('Ki4ucYa5lj071...');

    // 使用save方法传入保存地址,成功返回文件名。save(地址,自定义名称=null,超时时间=15),超时仅获取视频时有效
    $fileName = $mediaResponse->save('/Volumes/Web Server/easyswoole/img/');
    // 也可使用saveAs方法传入保存地址和文件名
    $mediaResponse->saveAs('/Volumes/Web Server/easyswoole/img/', 'newFileName');
```



#### 获取高清语音素材

获取从JSSDK的uploadVoice接口上传的临时语音素材(高清16K采样率)

```php
    use EasySwoole\WeChat\WeChat;

    // 传入临时素材的media_id;
    $mediaResponse = $weChat->officialAccount()->media()->getHdVoice('Ki4ucYa5lj071...');

    // 使用save方法传入保存地址,成功返回文件名。save(地址,自定义名称=null,超时时间=15),超时仅获取视频时有效
    $fileName = $mediaResponse->save('/Volumes/Web Server/easyswoole/img/');
    // 也可使用saveAs方法传入保存地址和文件名
    $mediaResponse->saveAs('/Volumes/Web Server/easyswoole/img/', 'newFileName');
```



### 新增永久素材

#### 新增永久图文素材

若新增的是多图文素材，则设定多个articles结构

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\MediaArticle;

    // 构建图文数据1
    $articleOne = [
      'title'              => 'EasySwoole，Wechat！',
      'thumb_media_id'     => 'Qk6KMVRN7vWHPjr9hwfluummlx7....',
      'author'             => 'EasySwoole/Wechat',
      'show_cover_pic'     => 1,
      'digest'             => 'digest',
      'content'            => 'content',
      'content_source_url' => 'https://www.easyswoole.com',
    ];
    // 构建图文数据2
    $articleTwo = [
      'title'              => 'Wechat，EasySwoole！',
      'thumb_media_id'     => 'Qk6KMVRN7vWHPjr9hwfl....',
      'author'             => 'EasySwoole/WeChat',
      'show_cover_pic'     => 1,
      'digest'             => 'digest',
      'content'            => 'content',
      'content_source_url' => 'https://www.easyswoole.com',
    ];
    // 获取MediaArticle Bean实例时传入构建数据1
    $mediaArticle1 = new MediaArticle($articleOne);
    // 获取MediaArticle Bean实例时传入构建数据2
    $mediaArticle2 = new MediaArticle($articleTwo);
		// 传入两个实例即可！
    $weChat->officialAccount()->material()->uploadArticle($mediaArticle1, $mediaArticle2);
```



#### 新增其他类型永久素材

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\MediaRequest;

    // 上传文件路径
    $path = '/Volumes/Web Server/easyswoole/image/2.jpg';
    // 获取MediaRequest Bean实例
    $mediaRequest = new MediaRequest();
    // 设定素材类型
    $mediaRequest->setType($mediaRequest::TYPE_IMAGE);
    // 设定素材路径
    $mediaRequest->setPath($path);

    // 传入MediaRequest Bean实例
    $weChat->officialAccount()->material()->upload($mediaRequest);
```

注：新增”视频类型“永久素材时还需设定以下两项

```php
    $mediaRequest->setTitle('关键时刻怎么能掉链子?');
    $mediaRequest->setIntroduction('别让你的电脑影响了你的业务！');
```



#### [点我查看上传图文消息内的图片获取URL](#上传图文消息内的图片获取URL)

请注意，本接口所上传的图片不占用公众号的素材库中图片数量的5000个的限制。图片仅支持jpg/png格式，大小必须在1MB以下。



### 获取永久素材

```php
    use EasySwoole\WeChat\WeChat;

    // 传入临时素材的media_id;
    $mediaResponse = $weChat->officialAccount()->material()->get('Ki4ucYa5lj071...');
    // 使用save方法传入保存地址,成功返回文件名。save(地址,自定义名称=null,超时时间=15),超时仅获取视频时有效
    $fileName = $mediaResponse->save('/Volumes/Web Server/easyswoole/img/');
    // 也可使用saveAs方法传入保存地址和文件名
    $mediaResponse->saveAs('/Volumes/Web Server/easyswoole/img/', 'newFileName');
```


### 删除永久素材

```php
    use EasySwoole\WeChat\WeChat;

    // 传入media_id即可删除
    $weChat->officialAccount()->material()->delete('Qk6KMVRN7vWHPjr9hwf...');
```



### 修改永久图文素材

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\MediaRequest;

    // 设置修改内容
    $articles = [
      'title'              => 'Hi！ EasySwoole!',
      'thumb_media_id'     => 'Qk6KMVRN7vWHPjr9hwf...',
      'author'             => 'Hi！ EasySwoole!',
      'show_cover_pic'     => 1,
      'digest'             => 'digest',
      'content'            => 'content',
      'content_source_url' => 'https://www.easyswoole.com',
    ];
    // 传入内容，获取MediaArticle Bean实例
    $mediaArticle = new MediaArticle($articles);

    /*
    * 传入响应参数执行修改
    * updateArticle('media_id', MediaArticle Bean实例, '文章在图文消息中的位置');
    * 要更新的文章在图文消息中的位置（多图文消息时，此字段才有意义），第一篇为0
    */
    $weChat->officialAccount()->material()->updateArticle('Qk6KM7P...', $mediaArticle, 0);
```



### 获取素材总数

```php
    use EasySwoole\WeChat\WeChat;

    // 获取素材总数
    $weChat->officialAccount()->material()->stats();
```



### 获取素材列表

```php
    use EasySwoole\WeChat\WeChat;
    /*
    * list(素材类型，开始位置，获取数量)
    * 素材的类型，图片（image）、视频（video）、语音 （voice）、图文（news）
    * 从全部素材的该偏移位置开始返回，0表示从第一个素材 返回
    * 返回素材的数量，取值在1到20之间
    */
    $weChat->officialAccount()->material()->list('news', 0, 20);
```



## 图文消息留言管理



### 打开已群发文章的评论功能

```php
    use EasySwoole\WeChat\WeChat;

    // close（群发返回的msg_data_id，指定第几篇从0开始默认第一篇）
    $weChat->officialAccount()->comment()->open(2649279340, 0);
```



### 关闭已群发文章的评论功能

```php
    use EasySwoole\WeChat\WeChat;

    // open（群发返回的msg_data_id，指定第几篇从0开始默认第一篇）
    $weChat->officialAccount()->comment()->close(2649279340, 0);
```



### **查看指定文章的评论数据**

```php
    use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，群发返回的msg_data_id
    * 2，起始位置
    * 3，获取数目（>=50会被拒绝）
    * 4，type=0 普通评论&精选评论 type=1 普通评论 type=2 精选评论
    * 5，多图文时，用来指定第几篇图文，从0开始，不带默认返回该msg_data_id的第一篇图文
    */
    $weChat->officialAccount()->comment()->view(1, 2, 3, 4, 5);
```



### **将评论标记精选**

```php
    use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，群发返回的msg_data_id
    * 2，评论id
    * 3，多图文时，用来指定第几篇图文，从0开始，不带默认返回该msg_data_id的第一篇图文
    */
    $weChat->officialAccount()->comment()->markelect(1, 2, 3);
```



### **将评论取消精选**

```php
    use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，群发返回的msg_data_id
    * 2，评论id
    * 3，多图文时，用来指定第几篇图文，从0开始，不带默认返回该msg_data_id的第一篇图文
    */
    $weChat->officialAccount()->comment()->unMarkelect(1, 2, 3);
```



### **删除评论**

```php
    use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，群发返回的msg_data_id
    * 2，评论id
    * 3，多图文时，用来指定第几篇图文，从0开始，不带默认返回该msg_data_id的第一篇图文
    */
    $weChat->officialAccount()->comment()->delete(1, 2, 3);
```



### 回复评论

```php
    use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，群发返回的msg_data_id
    * 2，评论id
    * 3，回复内容
    * 4，多图文时，用来指定第几篇图文，从0开始，不带默认返回该msg_data_id的第一篇图文
    */
    $weChat->officialAccount()->comment()->reply(1, 2, 3, 4);
```



### 删除回复

```php
    use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，群发返回的msg_data_id
    * 2，评论id
    * 3，多图文时，用来指定第几篇图文，从0开始，不带默认返回该msg_data_id的第一篇图文
    */
    $weChat->officialAccount()->comment()->deleteReply(1, 2, 3, 4);
```



## 用户管理

开发者可以使用用户标签管理的相关接口，实现对公众号的标签进行创建、查询、修改、删除等操作，也可以对用户进行打标签、取消标签等操作。

------



### 用户标签管理

#### 标签管理

##### 创建标签

```php
    use EasySwoole\WeChat\WeChat;

    /*
    * 传入标签名称
    */
    $weChat->officialAccount()->user()->tagCreate('测试C');
```



##### **获取公众号已创建的标签**

```php
    use EasySwoole\WeChat\WeChat;

    $weChat->officialAccount()->user()->tagList();
```



##### **编辑标签**

```php
    use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，标签id
    * 2，标签名
    */
    $weChat->officialAccount()->user()->tagUpdate(116, '测试测试c');
```



#####  **删除标签**

```php
    use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，标签id
    */
    $weChat->officialAccount()->user()->tagDelete(116);
```



#####  **获取标签下粉丝列表**

```php
    use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，标签id
    */
    $weChat->officialAccount()->user()->usersOfTag(116);
```



#### 用户管理

##### **批量为用户打标签**

```php
    use EasySwoole\WeChat\WeChat;

    $openid = [
      'ov3tQwtq3faIn...',
      'ov3tQwkHO_wc2egq...'
    ];

    /*
    * 传入参数
    * 1，openid数组
    * 2，标签ID
    */
    $weChat->officialAccount()->user()->tagUsers($openid, 104);
```



##### **批量为用户取消标签**

```php
    use EasySwoole\WeChat\WeChat;

    $openid = [
      'ov3tQwtq3faIn...',
      'ov3tQwkHO_wc2egq...'
    ];
    /*
    * 传入参数
    * 1，openid数组
    * 2，标签ID
    */
    $weChat->officialAccount()->user()->untagUsers($openid, 104);
```



##### **获取用户身上的标签列表**

```php
    use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，openid
    */
    $weChat->officialAccount()->user()->userTags('ov3tQwkHO_wc2egq...');
```



### 设置用户备注名

```php
    use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，openid
    * 2，需要备注的名称
    */
    $weChat->officialAccount()->user()->remark('ov3tQwkHO_wc2egquwbPzwxAOawU','备注名');
```



### 获取用户基本信息

#### **获取用户基本信息（包括UnionID机制）**

```php
    use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，openid
    * 2，返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
    */
    $weChat->officialAccount()->user()->get('ov3tQwkHO_wc2egquwbPzwxAOawU','zh_CN');
```



#### 批量获取用户基本信息

返回内容中字段subscribe_scene是用户关注的渠道来源：

1.  ADD_SCENE_SEARCH 公众号搜索，
2.  ADD_SCENE_ACCOUNT_MIGRATION 公众号迁移，
3.  ADD_SCENE_PROFILE_CARD 名片分享，ADD_SCENE_QR_CODE 扫描二维码，
4.  ADD_SCENE_PROFILE_LINK 图文页内名称点击，
5.  ADD_SCENE_PROFILE_ITEM 图文页右上角菜单，
6.  ADD_SCENE_PAID 支付后关注，
7.  ADD_SCENE_OTHERS 其他

```php
    use EasySwoole\WeChat\WeChat;

    $openid = [
      'ov3tQwtq3faIn...',
      'ov3tQwkHO_wc2egq...'
    ];

    /*
    * 传入参数
    * 1，openid数组
    * 2，返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
    */
    $weChat->officialAccount()->user()->select($openid,'zh_CN');
```



### 获取用户列表

```php
 		use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，第一个拉取的OPENID，不填默认从头开始拉取
    */
		$weChat->officialAccount()->user()->list('ov3tQwtq3faInMKywZYtoMynLUxs');
```



### 获取用户地理位置

这是一个事件推送

在EasySwooleEvent.php的mainServerCreate方法里注册事件

**查看所支持的事件[查看支持事件请点我 ](#RequestConst预定义常量查看)**  相关参考 [查看接收事件推送请点我](#接收事件推送)

```php
/*
 * 通过 onEvent 方法来进行注册处理机制
 */
$wechat->officialAccount()->server()->onEvent()->onLocation(function (RequestMsg $msg){
});
```



### 黑名单管理

#### **获取公众号的黑名单列表**

```php
 		use EasySwoole\WeChat\WeChat;

    /*
    * 传入参数
    * 1，第一个拉取的OPENID，不填默认从头开始拉取
    */
		$weChat->officialAccount()->user()->blacklist('ov3tQwtq3faInMKywZYtoMynLUxs');
```



#### **拉黑用户**

```php
 		use EasySwoole\WeChat\WeChat;

    $openid = [
        'ov3tQwkHO_wc2egquwbPzwxAOawU'
    ];

    /*
    * 传入参数
    * 1，需要拉入黑名单的用户的openid，一次拉黑最多允许20个
    */
		$weChat->officialAccount()->user()->black($openid);
```



#### 取消拉黑用户

```php
 		use EasySwoole\WeChat\WeChat;

    $openid = [
        'ov3tQwkHO_wc2egquwbPzwxAOawU'
    ];

    /*
    * 传入参数
    * 1，需要拉入黑名单的用户的openid，一次拉黑最多允许20个
    */
		$weChat->officialAccount()->user()->unblack($openid);
```



## 账号管理



### 生成带参数的二维码

#### **创建二维码ticket**

```php
    use EasySwoole\WeChat\WeChat;
    use EasySwoole\WeChat\Bean\OfficialAccount\QrCodeRequest;

		// 获取QrCodeRequest Bean实例
    $qrCodeRequest = new QrCodeRequest();

    /*
    * 当二维码类型为临时的时候该设定生效
    * 二维码有效时间，以秒为单位。 最大不超过2592000（即30天），此字段如果不填，则默认有效期为30秒。
    */
    $qrCodeRequest->setExpireSeconds(30);

    /*
    * 二维码类型
    * QR_SCENE为临时的整型参数值，QR_STR_SCENE为临时的字符串参数值
    * QR_LIMIT_SCENE为永久的整型参数值，QR_LIMIT_STR_SCENE为永久的字符串参数值
    */
    $qrCodeRequest->setActionName($qrCodeRequest::QR_SCENE);

    // 二维码详细信息(数组形式)
    $scene = [
      "scene" => [
        "scene_id"  => 555,
        "scene_str" => "test"
      ]
    ];
    $qrCodeRequest->setActionInfo($scene);

		/*
		* 二维码详细信息不用数组形式设定
		*
		* 场景值ID，临时二维码时为32位非0整型，永久二维码时最大值为100000（目前参数只支持1--100000）
    * $qrCodeRequest->setSceneId(666);
    *
		* 场景值ID（字符串形式的ID），字符串类型，长度限制为1到64
		* $qrCodeRequest->setSceneStr('EasySwoole');
		*/
		
		// 获取qrCode实例
    $qrCode = $weChat->officialAccount()->qrCode();

		// 获取ticket
    $tick = $qrCode->getTick($qrCodeRequest);

		// 通过ticket换取二维码
    $qrCode::tickToImageUrl($tick);
```



#### **通过ticket换取二维码**

就是上文中最后一步

```php
	// 通过ticket换取二维码
$qrCode::tickToImageUrl($ss);
```


### 长链接转短链接接口

```php
    use EasySwoole\WeChat\WeChat;

    $url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQFB8DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyekJaZW9LX1';
		// 传入url返回字符串地址
    $$weChat->officialAccount()->qrCode()->shorturl($url);
```





## RequestConst预定义常量查看

```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018-12-30
 * Time: 17:14
 */

namespace EasySwoole\WeChat\Bean\OfficialAccount;


class RequestConst
{
    /*
    * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140453
    */
    const DEFAULT_ON_MESSAGE = '__DEFAULT_ON_MESSAGE__';
    const DEFAULT_ON_EVENT   = '__DEFAULT_ON_EVENT__';

    const MSG_TYPE_TEXT        = 'text';
    const MSG_TYPE_EVENT       = 'event';
    const MSG_TYPE_IMAGE       = 'image';
    const MSG_TYPE_MUSIC       = 'music';
    const MSG_TYPE_VOICE       = 'voice';
    const MSG_TYPE_VIDEO       = 'video';
    const MSG_TYPE_SHORT_VIDEO = 'shortvideo';
    const MSG_TYPE_LOCATION    = 'location';
    const MSG_TYPE_LINK        = 'link';
    const MSG_TYPE_NEWS        = 'news';

    /**
     * 客服发送消息中出现
     */
    const MSG_TYPE_MPNEWS          = 'mpnews';
    const MSG_TYPE_MSGMENU         = 'msgmenu';
    const MSG_TYPE_WXCARD          = 'wxcard';
    const MSG_TYPE_MINIPROGRAMPAGE = 'miniprogrampage';

    /**
     * 群发消息中出现
     */
    const MSG_TYPE_MPVIDEO = 'mpvideo';


    /*
     * 事件大小写不同，主要是微信自己本身事件大小写就不一样，不规范
     */
    // 用户关注事件
    const EVENT_SUBSCRIBE = 'subscribe';
    // 用户取消关注事件
    const EVENT_UNSUBSCRIBE = 'unsubscribe';
    // 用户已关注事件
    const EVENT_SCAN = 'SCAN';
    // 上报地理位置事件
    const EVENT_LOCATION = 'LOCATION';
    // 点击自定义菜单拉取消息事件
    const EVENT_CLICK = 'CLICK';
    // 点击自定义菜单跳转事件
    const EVENT_VIEW = 'VIEW';
    // 发送模板消息通知事件
    const EVENT_TEMPLATE_SEND_JOB_FINISH = 'TEMPLATESENDJOBFINISH';
    // 群发结果事件
    const EVENT_MASS_SEND_JOB_FINISH           = 'MASSSENDJOBFINISH';
    //扫码推事件的事件推送
    const EVENT_SCANCODE_PUSH = 'scancode_push';
    //扫码推事件且弹出“消息接收中”提示框的事件推送
    const EVENT_SCANCODE_WAITMSG = 'scancode_waitmsg';
    //弹出系统拍照发图的事件推送
    const EVENT_PIC_SYSPHOTO = 'pic_sysphoto';
    //弹出拍照或者相册发图的事件推送
    const EVENT_PIC_PHOTO_OR_ALBUM = 'pic_photo_or_album';
    //弹出微信相册发图器的事件推送
    const EVENT_PIC_WEIXIN = 'pic_weixin';
    //弹出地理位置选择器的事件推送
    const EVENT_LOCATION_SELECT = 'location_select';
    //点击菜单跳转小程序的事件推送
    const EVENT_VIEW_MINIPROGRAM = 'view_miniprogram';

}
```
