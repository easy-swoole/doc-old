---
title: 微信支付
meta:
  - name: description
    content: WeChat是一个基于Swoole 4.x全协程支持的SDK库,微信支付组件
  - name: keywords
    content: easyswoole|wxPay|WeChat|微信支付|swoole 微信支付
---
# 协程支付网关
```
composer require easyswoole/pay
```


# 微信支付


微信支付目前支持 3 种支付方法，对应的支付 method 如下：

| method         | 说明         | 参数    | 返回值   |
| --------       | ------------ | ------- | -------- |
| wap            | 手机网站支付 | Request | Response |
| officialAccount| 公众号支付   | Request | Response |
| scan           | 扫码支付     | Request | Response |
| miniProgram    | 小程序支付   | Request | Response |

#### 微信参数配置

```php
$wechatConfig = new Config();
$wechatConfig->setAppId('xxxxxx');      // 除了小程序以外使用该APPID
$wechatConfig->setMiniAppId('xxxxxx');  // 小程序使用该APPID
$wechatConfig->setMchId('xxxxxx');
$wechatConfig->setKey('xxxxxx');
$wechatConfig->setNotifyUrl('xxxxx');
$wechatConfig->setApiClientCert('xxxxxxx');//客户端证书
$wechatConfig->setApiClientKey('xxxxxxx'); //客户端证书秘钥
```

> 由于小程序拥有独立的APPID，只需要在配置里同时配置上AppId和MiniAppId两个配置项，在支付的时候会自动选择对应的APPID来发起支付

## 公众号支付

```php
$officialAccount = new OfficialAccount();
$officialAccount->setOpenid('xxxxxxx');
$officialAccount->setOutTradeNo('CN' . date('YmdHis') . rand(1000, 9999));
$officialAccount->setBody('xxxxx-测试' . $outTradeNo);
$officialAccount->setTotalFee(1);
$officialAccount->setSpbillCreateIp('xxxxx');
$pay = new \EasySwoole\Pay\Pay();
$params = $pay->weChat($wechatConfig)->officialAccount($officialAccount);
```
可以参考demo/wechat/index.php 

> 在使用微信支付时，商品名称中如果出现特殊字符，如 & 请自行使用urlencode在生成签名传参时进行编码

## H5支付

```php
$wap = new \EasySwoole\Pay\WeChat\RequestBean\Wap();
$wap->setOutTradeNo('CN' . date('YmdHis') . rand(1000, 9999));
$wap->setBody('xxxxx-WAP测试' . $outTradeNo);
$wap->setTotalFee(1);
$wap->setSpbillCreateIp('xxxxx');
$pay = new \EasySwoole\Pay\Pay();
$params = $pay->weChat($wechatConfig)->wap($wap);
```
## 小程序支付
```php
$bean = new \EasySwoole\Pay\WeChat\RequestBean\MiniProgram();
$bean->setOpenid('xxxxxxxxx');
$bean->setOutTradeNo('CN' . date('YmdHis') . rand(1000, 9999));
$bean->setBody('xxxx-测试' . $outTradeNo);
$bean->setTotalFee(1);
$bean->setSpbillCreateIp($this->request()->getHeader('x-real-ip')[0]);
$pay = new \EasySwoole\Pay\Pay();
$params = $pay->weChat($this->wechatConfig)->miniProgram($bean);
```

## 扫码支付 

#### 模式一  

生成扫码链接 然后生成二维码 具体请查看demo/wechat/index.php

```php
$biz = new Biz();
$biz->setProductId('123456789');
$biz->setTimeStamp(time());
$biz->setAppId($wechatConfig->getAppId());
$biz->setMchId($wechatConfig->getMchid());
$data = $biz->toArray();
$u = new Utility($wechatConfig);
$sign = $u->generateSign($data);
$biz->setSign($sign);
$url1 = "weixin://wxpay/bizpayurl?" . $this->ToUrlParams($biz->toArray());
```

扫码回调地址（ps:公众号平台设置）

```php
 $xml = $this->request()->getBody()->__toString();
$pay = new Pay();
$data = $pay->weChat($this->wechatConfig)->verify($xml);
$bean = new \EasySwoole\Pay\WeChat\RequestBean\Scan();
$bean->setOutTradeNo('CN' . date('YmdHis') . rand(1000, 9999));
$bean->setOpenid('xxxxxx');
$bean->setProductId($data['product_id']);
$bean->setBody('xxxxxx-SCAN测试' . $outTradeNo);
$bean->setTotalFee(1);
$bean->setSpbillCreateIp($this->request()->getHeader('x-real-ip')[0]);
$response = $pay->weChat($this->wechatConfig)->scan($bean);
$nativeResponse = new NativeResponse([
    'appid' => $this->wechatConfig->getAppId(),
    'mch_id' => $this->wechatConfig->getMchId(),
    'prepay_id' => $response->getPrepayId(),
    'nonce_str' => $response->getNonceStr()]);
$u = new Utility($this->wechatConfig);
$nativeResponse->setSign($u->generateSign($nativeResponse->toArray()));
$xml = (new SplArray($nativeResponse->toArray()))->toXML();
$this->response()->write($xml);
```
#### 模式二

```php
$bean = new \EasySwoole\Pay\WeChat\RequestBean\Scan();
$bean->setOutTradeNo($outTradeNo);
$bean->setProductId('123456789');
$bean->setBody('xxxx-SCAN2测试' . $outTradeNo);
$bean->setTotalFee(1);
$bean->setSpbillCreateIp($this->request()->getHeader('x-real-ip')[0]);
$pay = new Pay();
$data = $pay->weChat($this->wechatConfig)->scan($bean);
$url2 = $data->getCodeUrl();
```

## 订单查询

```php
go(function () use ($wechatConfig) {
    $orderFind = new \EasySwoole\Pay\WeChat\RequestBean\OrderFind();
    $orderFind->setOutTradeNo('CN201903181044383609');
    $pay = new \EasySwoole\Pay\Pay();
    $info = $pay->weChat($wechatConfig)->orderFind($orderFind);
    print_r((array)$info);
});
```

## 申请退款

```php
go(function () use ($wechatConfig) {
    $refund = new \EasySwoole\Pay\WeChat\RequestBean\Refund();
    $refund->setOutTradeNo('CN201903181111275823');
    $refund->setOutRefundNo('TK' . date('YmdHis') . rand(1000, 9999));
    $refund->setTotalFee(1);
    $refund->setRefundFee(1);
    $refund->setNotifyUrl('xxxxx');
    $pay = new \EasySwoole\Pay\Pay();
    $info = $pay->weChat($wechatConfig)->refund($refund);
    print_r($info);
});
```

## 退款查询

```php
go(function () use ($wechatConfig) {
    $refundFind = new \EasySwoole\Pay\WeChat\RequestBean\RefundFind();
    $refundFind->setOutTradeNo('CN201903181044383609');
    $pay = new \EasySwoole\Pay\Pay();
    $info = $pay->weChat($wechatConfig)->refundFind($refundFind);
    print_r((array)$info);
});
```

## 关闭订单

```php
go(function () use ($wechatConfig) {
    $close = new \EasySwoole\Pay\WeChat\RequestBean\Close();
    $close->setOutTradeNo('CN201903151343107239');
    $pay = new \EasySwoole\Pay\Pay();
    $info = $pay->weChat($wechatConfig)->close($close);
    print_r((array)$info);
});
```

## 下载对账单

```php
go(function () use ($wechatConfig) {
    $download = new \EasySwoole\Pay\WeChat\RequestBean\Download();
    $download->setBillDate('20190312');
    $download->setBillType('ALL');//这个参数必传
    $pay = new \EasySwoole\Pay\Pay();
    $info = $pay->weChat($wechatConfig)->download($download);
    echo htmlspecialchars($info, ENT_QUOTES);
});
```

## 下载资金对账单

```php
go(function () use ($wechatConfig) {
    $download = new \EasySwoole\Pay\WeChat\RequestBean\DownloadFundFlow();
    $download->setBillDate('20190312');
    $download->setAccountType('Basic');
    $pay = new \EasySwoole\Pay\Pay();
    $info = $pay->weChat($wechatConfig)->downloadFundFlow($download);
    echo htmlspecialchars($info, ENT_QUOTES);
});
```

## 验证签名

```php
$pay = new \EasySwoole\Pay\Pay();
$content = '';//content为xml原始数据,在easyswoole中可通过$this->request()->getBody()->__toString()取出
$data = $pay->weChat($wechatConfig)->verify($content  )
```

## 服务器确认收到异步通知字符串获取

```php
\EasySwoole\Pay\WeChat\WeChat::success();//成功响应
\EasySwoole\Pay\WeChat\WeChat::fail();//失败响应
```
