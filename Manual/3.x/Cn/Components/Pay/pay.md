# 安装
> composer require easyswoole/pay

# 支付宝

#### 支付方法

支付宝支付目前支持 7 种支付方法，对应的支付 method 如下：

| method   | 说明         | 参数    | 返回值   |
| -------- | ------------ | ------- | -------- |
| web      | 电脑支付     | Request | Response |
| wap      | 手机网站支付 | Request | Response |
| app      | APP 支付     | Request | Response |
| pos      | 刷卡支付     | Request | Response |
| scan     | 扫码支付     | Request | Response |
| transfer | 账户转账     | Request | Response |
| mini     | 小程序支付   | Request | Response |

## 电脑支付

>  统一收单下单并支付页面接口

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::NORMAL);
$aliConfig->setAppId('2017082000295641');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');

$pay = new \EasySwoole\Pay\Pay();

## 对象风格
$order = new \EasySwoole\Pay\AliPay\RequestBean\Web();
$order->setSubject('测试');
$order->setOutTradeNo(time().'123456');
$order->setTotalAmount('0.01');
// 本库只预置了常用的请求参数，没预置的参数使用：$order->addProperty('其他字段','其他字段值');

## 数组风格
$order = new \EasySwoole\Pay\AliPay\RequestBean\App([
    'subject'=>'测试',
    'out_trade_no'=>'123456',
    'total_amount'=>'0.01',
    '额外的字段键值'=>'额外字段值'
],true);

$res = $pay->aliPay($aliConfig)->web($order);
var_dump($res->toArray());

$html = buildPayHtml(\EasySwoole\Pay\AliPay\GateWay::NORMAL,$res->toArray());
file_put_contents('test.html',$html);		
```

#### 订单配置参数

**所有订单配置中，客观参数均不用配置，扩展包已经为大家自动处理了，比如，**`product_code`** 等参数。**

所有订单配置参数和官方无任何差别，兼容所有功能，所有参数请参考[这里](https://docs.open.alipay.com/270/alipay.trade.page.pay)，查看「请求参数」一栏。

参数查询：https://docs.open.alipay.com/api_1/alipay.trade.page.pay

生成支付的跳转html示例

```php
function buildPayHtml($endpoint, $payload)
{
    $sHtml = "<form id='alipaysubmit' name='alipaysubmit' action='".$endpoint."' method='POST'>";
    foreach ($payload as $key => $val) {
        $val = str_replace("'", '&apos;', $val);
        $sHtml .= "<input type='hidden' name='".$key."' value='".$val."'/>";
    }
    $sHtml .= "<input type='submit' value='ok' style='display:none;'></form>";
    $sHtml .= "<script>document.forms['alipaysubmit'].submit();</script>";
    return $sHtml;
}
```



##  手机网站支付接口2.0

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::NORMAL);
$aliConfig->setAppId('2017082000295641');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');

$pay = new \EasySwoole\Pay\Pay();

$order = new \EasySwoole\Pay\AliPay\RequestBean\Wap();
$order->setSubject('测试');
$order->setOutTradeNo(time().'123456');
$order->setTotalAmount('0.01');

$res = $pay->aliPay($aliConfig)->wap($order);
var_dump($res->toArray());

$html = buildPayHtml(\EasySwoole\Pay\AliPay\GateWay::NORMAL,$res->toArray());
file_put_contents('test.html',$html);
```

#### 订单配置参数

**所有订单配置中，客观参数均不用配置，扩展包已经为大家自动处理了，比如，`product_code` 等参数。**

所有订单配置参数和官方无任何差别，兼容所有功能，所有参数请参考[这里](https://docs.open.alipay.com/203/107090/)，查看「请求参数」一栏。

参数查询：https://docs.open.alipay.com/api_1/alipay.trade.wap.pay



## APP支付接口2.0

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');

$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\App();
$order->setSubject('测试');
$order->setOutTradeNo(time().'123456');
$order->setTotalAmount('0.01');
$aliPay = $pay->aliPay($aliConfig);

var_dump($aliPay->app($order)->toArray());
```

#### 订单配置参数

**所有订单配置中，客观参数均不用配置，扩展包已经为大家自动处理了，比如， `product_code` 等参数。**

所有订单配置参数和官方无任何差别，兼容所有功能，所有参数请参考[这里](https://docs.open.alipay.com/204/105465/)，查看「请求参数」一栏。

参数查询：https://docs.open.alipay.com/api_1/alipay.trade.app.pay



## 刷卡支付

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\Pos();
$order->setSubject('测试');
$order->setTotalAmount('0.01');
$order->setOutTradeNo(time());
$order->setAuthCode('289756915257123456');
$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->pos($order)->toArray();
var_dump($data);
```

#### 订单配置参数

**所有订单配置中，客观参数均不用配置，扩展包已经为大家自动处理了，比如，`product_code` 等参数。**

所有订单配置参数和官方无任何差别，兼容所有功能，所有参数请参考[这里](https://docs.open.alipay.com/api_1/alipay.trade.pay)，查看「请求参数」一栏。

参数查询：https://docs.open.alipay.com/api_1/alipay.trade.page.pay



## 扫码支付

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');

$pay = new \EasySwoole\Pay\Pay();

$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\Scan();
$order->setSubject('测试');
$order->setTotalAmount('0.01');
$order->setOutTradeNo(time());

$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->scan($order)->toArray();
$response = $aliPay->preQuest($data);
var_dump($response);
// qr_code 当前预下单请求生成的二维码码串，可以用二维码生成工具根据该码串值生成对应的二维码	 https://qr.alipay.com/bavh4wjlxf12tper3a
```

#### 订单配置参数

**所有订单配置中，客观参数均不用配置，扩展包已经为大家自动处理了，比如，`product_code` 等参数。**

所有订单配置参数和官方无任何差别，兼容所有功能，所有参数请参考[这里](https://docs.open.alipay.com/api_1/alipay.trade.precreate)，查看「请求参数」一栏。

参考参数：https://docs.open.alipay.com/api_1/alipay.trade.precreate



## 单笔转账到支付宝账户接口

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');

$pay = new \EasySwoole\Pay\Pay();

$order = new \EasySwoole\Pay\AliPay\RequestBean\Transfer();
$order->setSubject('测试');
$order->setTotalAmount('0.01');
$order->setPayeeType('ALIPAY_LOGONID');
$order->setPayeeAccount('hcihsn8174@sandbox.com');

$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->transfer($order)->toArray();
$aliPay->preQuest($data);
var_dump($data);
```

#### 订单配置参数

**所有订单配置中，客观参数均不用配置，扩展包已经为大家自动处理了，比如，`product_code` 等参数。**

所有订单配置参数和官方无任何差别，兼容所有功能，所有参数请参考[这里](https://docs.open.alipay.com/api_28/alipay.fund.trans.toaccount.transfer)，查看「请求参数」一栏。

参数查询：https://docs.open.alipay.com/api_28/alipay.fund.trans.toaccount.transfer

## 小程序支付

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');

$pay = new \EasySwoole\Pay\Pay();

$order = new \EasySwoole\Pay\AliPay\RequestBean\MiniProgram();
$order->setSubject('测试');
$order->setOutTradeNo(time().'123456');
$order->setTotalAmount('0.01');
$order->setBuyerId('hcihsn8174@sandbox.com');

$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->miniProgram($order)->toArray();
var_dump($data);
```

#### 订单配置参数

**所有订单配置中，客观参数均不用配置，扩展包已经为大家自动处理了，比如，`product_code` 等参数。**

所有订单配置参数和官方无任何差别，兼容所有功能，所有参数请参考[这里](https://docs.open.alipay.com/api_1/alipay.trade.create/)，查看「请求参数」一栏。

小程序支付接入文档：<https://docs.alipay.com/mini/introduce/pay>。

参数查询：

## 订单查询

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\OrderFind();
$order->setOutTradeNo(time().'123456');
$aliPay = $pay->aliPay($aliConfig);

var_dump($aliPay->orderFind($order)->toArray());
```

官方参数查询：https://docs.open.alipay.com/api_1/alipay.trade.fastpay.refund.query

## 退款查询

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\RefundFind();
$order->setOutTradeNo('20150320010101001');
$order->setOutRequestNo(time().'2014112611001004680073956707');
$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->refundFind($order)->toArray();
var_dump($aliPay->preQuest($data));
```

官方参数查询：https://docs.open.alipay.com/api_1/alipay.trade.refund



## 查询转账订单接口

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\TransferFind();
$order->setOutBizNo('3142321423432');
// 二选一
//	$order->setOrderId('20160627110070001502260006780837');
$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->transferFind($order)->toArray();
var_dump($aliPay->preQuest($data));
```

官方参数查询：https://docs.open.alipay.com/api_28/alipay.fund.trans.order.query



## 交易撤销接口

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\Cancel();
$order->setOutTradeNo('20150320010101001');
$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->cancel($order)->toArray();
var_dump($aliPay->preQuest($data));
```

官方参数查询：https://docs.open.alipay.com/api_1/alipay.trade.cancel

## 交易关闭接口

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\Close();
$order->setOutTradeNo(time().'123456');
$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->close($order)->toArray();
var_dump($aliPay->preQuest($data));
```

官方参数查询：https://docs.open.alipay.com/api_1/alipay.trade.close

## 查询对账单下载地址

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\Download();
$order->setBillType('trade');
$order->setBillDate('2016-04-05');
$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->download($order)->toArray();
var_dump($aliPay->preQuest($data));
```

官方参数查询：https://docs.open.alipay.com/api_15/alipay.data.dataservice.bill.downloadurl.query



## 验证服务器数据

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('阿里公钥');
$aliConfig->setPrivateKey('阿里私钥');
$pay = new \EasySwoole\Pay\Pay();

$param = [];//伪代码,post数据
unset($param['sign_type']);//需要忽略sign_type组装
$order = new \EasySwoole\Pay\AliPay\RequestBean\NotifyRequest($param,true);
$aliPay = $pay->aliPay($aliConfig);
$result = $aliPay->verify($order);
var_dump($result);
```



## 服务器确认收到异步通知字符串获取

```php
\EasySwoole\Pay\AliPay::success();//成功响应
\EasySwoole\Pay\AliPay::fail();//失败响应
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