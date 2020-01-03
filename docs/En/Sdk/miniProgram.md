---
title: 微信小程序
meta:
  - name: description
    content: WeChat是一个基于Swoole 4.x全协程支持的微信SDK库
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|wechat|miniProgram
---


## 微信小程序


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

```php
$wxa->templateMsg()->getTemplateList(int $offset, int $count)
```

### 获取模板库某个模板标题下关键词库

```php
$wxa->templateMsg()->getTemplateLibraryById(string $id)
```

### 组合模板并添加至帐号下的个人模板库

```php
$wxa->templateMsg()->addTemplate(string $id, array $keywordIdList)
```

### 删除帐号下的某个模板

```php
$wxa->templateMsg()->deleteTemplate(string $templateId)
```

### 获取小程序模板库标题列表

```php
$wxa->templateMsg()->getTemplateLibraryList(int $offset, int $count)
```

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

```php
$wxa->encryptor()->decryptData(string $sessionKey, string $iv, string $encryptedData)
```

### 检查一段文本是否含有违法违规内容

```php
$wxa->checkFile()->msgSecCheck(string $content)
```


### 校验一张图片是否含有违法违规内容

```php
$wxa->checkFile()->imgSecCheck(ImgUploadBean $imgUpload)
```

### 异步校验图片/音频是否含有违法违规内容

```php
$wxa->checkFile()->mediaCheckAsync(string $mediaUrl ,int $mediaType)
```

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
