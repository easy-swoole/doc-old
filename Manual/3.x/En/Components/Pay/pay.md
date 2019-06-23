# Install
> composer require easyswoole/pay

# Alipay

#### Method of payment

Alipay payment currently supports 7 payment methods. The corresponding payment method is as follows:

| method   | Explain         | Parameter    | Return value   |
| -------- | ------------ | ------- | -------- |
| web      | Computer Payment     | Request | Response |
| wap      | Mobile Website Payment | Request | Response |
| app      | APP payment     | Request | Response |
| pos      | Payment by credit card     | Request | Response |
| scan     | Sweep Payment     | Request | Response |
| transfer | Account Transfer     | Request | Response |
| mini     | Small Procedure Payment   | Request | Response |

## Computer Payment

>  Unified Receiving Order and Payment Page Interface

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::NORMAL);
$aliConfig->setAppId('2017082000295641');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');

$pay = new \EasySwoole\Pay\Pay();

## Object Style
$order = new \EasySwoole\Pay\AliPay\RequestBean\Web();
$order->setSubject('test');
$order->setOutTradeNo(time().'123456');
$order->setTotalAmount('0.01');
// This library only presets common request parameters, and no preset parameters use ：$order->addProperty('其他字段','其他字段值');

## Array Style
$order = new \EasySwoole\Pay\AliPay\RequestBean\App([
    'subject'=>'test',
    'out_trade_no'=>'123456',
    'total_amount'=>'0.01',
    'Additional field key values'=>'Additional field values'
],true);

$res = $pay->aliPay($aliConfig)->web($order);
var_dump($res->toArray());

$html = buildPayHtml(\EasySwoole\Pay\AliPay\GateWay::NORMAL,$res->toArray());
file_put_contents('test.html',$html);		
```

#### Order configuration parameters

**In all order configurations, objective parameters are not configurable. Extension packages have been automatically processed for everyone, such as，**`product_code`** etc **

All order configuration parameters and official no difference, compatible with all functions, all parameters refer to[Here](https://docs.open.alipay.com/270/alipay.trade.page.pay)，See the "Request Parameters" column.

Parameter query：https://docs.open.alipay.com/api_1/alipay.trade.page.pay

Generate a skip HTML example of payment

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



##  Mobile Web Payment Interface 2.0

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::NORMAL);
$aliConfig->setAppId('2017082000295641');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');

$pay = new \EasySwoole\Pay\Pay();

$order = new \EasySwoole\Pay\AliPay\RequestBean\Wap();
$order->setSubject('test');
$order->setOutTradeNo(time().'123456');
$order->setTotalAmount('0.01');

$res = $pay->aliPay($aliConfig)->wap($order);
var_dump($res->toArray());

$html = buildPayHtml(\EasySwoole\Pay\AliPay\GateWay::NORMAL,$res->toArray());
file_put_contents('test.html',$html);
```

#### Order configuration parameters

**In all order configurations, objective parameters are not configurable. Extension packages have been automatically processed for everyone, such as，`product_code` etc. **

All order configuration parameters and official no difference, compatible with all functions, all parameters refer to[Here](https://docs.open.alipay.com/203/107090/)，See the "Request Parameters" column.

Parameter query：https://docs.open.alipay.com/api_1/alipay.trade.wap.pay



## APP Payment Interface 2.0

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');

$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\App();
$order->setSubject('test');
$order->setOutTradeNo(time().'123456');
$order->setTotalAmount('0.01');
$aliPay = $pay->aliPay($aliConfig);

var_dump($aliPay->app($order)->toArray());
```

#### Order configuration parameters

**In all order configurations, objective parameters are not configurable. Extension packages have been automatically processed for everyone, such as， `product_code` etc. **

All order configuration parameters are official and compatible with all functions. Please refer to [here](https://docs.open.alipay.com/204/105465/)，See the "Request Parameters" column.

Parameter query：https://docs.open.alipay.com/api_1/alipay.trade.app.pay



## Payment by credit card

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\Pos();
$order->setSubject('test');
$order->setTotalAmount('0.01');
$order->setOutTradeNo(time());
$order->setAuthCode('289756915257123456');
$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->pos($order)->toArray();
var_dump($data);
```

#### Order configuration parameters

**In all order configurations, objective parameters are not configurable. Extension packages have been automatically processed for everyone, such as:`product_code` etc. **

All order configuration parameters are official and compatible with all functions. Please refer to [here](https://docs.open.alipay.com/api_1/alipay.trade.pay)，See the "Request Parameters" column.

Parameter query：https://docs.open.alipay.com/api_1/alipay.trade.page.pay



## Sweep Payment

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');

$pay = new \EasySwoole\Pay\Pay();

$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\Scan();
$order->setSubject('test');
$order->setTotalAmount('0.01');
$order->setOutTradeNo(time());

$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->scan($order)->toArray();
$response = $aliPay->preQuest($data);
var_dump($response);
// qr_code At present, the two-dimensional code string generated by pre-ordering a single request can be generated by the two-dimensional code generation tool according to the value of the code string to generate the corresponding two-dimensional code. https://qr.alipay.com/bavh4wjlxf12tper3a
```

#### Order configuration parameters

**In all order configurations, objective parameters are not configurable. Extension packages have been automatically processed for everyone, such as:`product_code` etc. **

All order configuration parameters are official and compatible with all functions. Please refer to [here](https://docs.open.alipay.com/api_1/alipay.trade.precreate)，See the "Request Parameters" column.

Reference parameters：https://docs.open.alipay.com/api_1/alipay.trade.precreate



## Single transfer to Alipay account interface

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');

$pay = new \EasySwoole\Pay\Pay();

$order = new \EasySwoole\Pay\AliPay\RequestBean\Transfer();
$order->setSubject('test');
$order->setTotalAmount('0.01');
$order->setPayeeType('ALIPAY_LOGONID');
$order->setPayeeAccount('hcihsn8174@sandbox.com');

$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->transfer($order)->toArray();
$aliPay->preQuest($data);
var_dump($data);
```

#### Order configuration parameters

**In all order configurations, objective parameters are not configurable. Extension packages have been automatically processed for everyone, such as:`product_code` etc. **

All order configuration parameters are official and compatible with all functions. Please refer to [here](https://docs.open.alipay.com/api_28/alipay.fund.trans.toaccount.transfer)，See the "Request Parameters" column.

Parameter query：https://docs.open.alipay.com/api_28/alipay.fund.trans.toaccount.transfer

## Small Procedure Payment

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');

$pay = new \EasySwoole\Pay\Pay();

$order = new \EasySwoole\Pay\AliPay\RequestBean\MiniProgram();
$order->setSubject('test');
$order->setOutTradeNo(time().'123456');
$order->setTotalAmount('0.01');
$order->setBuyerId('hcihsn8174@sandbox.com');

$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->miniProgram($order)->toArray();
var_dump($data);
```

#### Order configuration parameters

**In all order configurations, objective parameters are not configurable. Extension packages have been automatically processed for everyone, such as:`product_code` etc **

All order configuration parameters are official and compatible with all functions. Please refer to [here](https://docs.open.alipay.com/api_1/alipay.trade.create/)，See the "Request Parameters" column.

Widget Payment Access Document：<https://docs.alipay.com/mini/introduce/pay>。

Parameter query：

## Order query

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\OrderFind();
$order->setOutTradeNo(time().'123456');
$aliPay = $pay->aliPay($aliConfig);

var_dump($aliPay->orderFind($order)->toArray());
```

Official parameter query：https://docs.open.alipay.com/api_1/alipay.trade.fastpay.refund.query

## Refund query

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\RefundFind();
$order->setOutTradeNo('20150320010101001');
$order->setOutRequestNo(time().'2014112611001004680073956707');
$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->refundFind($order)->toArray();
var_dump($aliPay->preQuest($data));
```

Official parameter query：https://docs.open.alipay.com/api_1/alipay.trade.refund



## Inquiry Transfer Order Interface

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\TransferFind();
$order->setOutBizNo('3142321423432');
// Either-or
//	$order->setOrderId('20160627110070001502260006780837');
$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->transferFind($order)->toArray();
var_dump($aliPay->preQuest($data));
```

Official parameter query：https://docs.open.alipay.com/api_28/alipay.fund.trans.order.query



## Transaction revocation interface

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\Cancel();
$order->setOutTradeNo('20150320010101001');
$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->cancel($order)->toArray();
var_dump($aliPay->preQuest($data));
```

Official parameter query：https://docs.open.alipay.com/api_1/alipay.trade.cancel

## Transaction Closure Interface

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\Close();
$order->setOutTradeNo(time().'123456');
$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->close($order)->toArray();
var_dump($aliPay->preQuest($data));
```

Official parameter query：https://docs.open.alipay.com/api_1/alipay.trade.close

## Search for Bill Download Address

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');
$pay = new \EasySwoole\Pay\Pay();
$order = new \EasySwoole\Pay\AliPay\RequestBean\Download();
$order->setBillType('trade');
$order->setBillDate('2016-04-05');
$aliPay = $pay->aliPay($aliConfig);
$data = $aliPay->download($order)->toArray();
var_dump($aliPay->preQuest($data));
```

Official parameter query：https://docs.open.alipay.com/api_15/alipay.data.dataservice.bill.downloadurl.query



## Verify server data

```php
$aliConfig = new \EasySwoole\Pay\AliPay\Config();
$aliConfig->setGateWay(\EasySwoole\Pay\AliPay\GateWay::SANDBOX);
$aliConfig->setAppId('2016091800538339');
$aliConfig->setPublicKey('Ali public key');
$aliConfig->setPrivateKey('Ali private key');
$pay = new \EasySwoole\Pay\Pay();

$param = [];//Pseudo-code, post data
unset($param['sign_type']);//Need to ignore sign_type assembly
$order = new \EasySwoole\Pay\AliPay\RequestBean\NotifyRequest($param,true);
$aliPay = $pay->aliPay($aliConfig);
$result = $aliPay->verify($order);
var_dump($result);
```



## Server acknowledges receipt of asynchronous notification string acquisition

```php
\EasySwoole\Pay\AliPay::success();//Successful response
\EasySwoole\Pay\AliPay::fail();//Failure response
```

# Wechat Payment


Wechat currently supports three payment methods, and the corresponding payment methods are as follows:

| method         | Explain         | Parameter    | Return value   |
| --------       | ------------ | ------- | -------- |
| wap            | Mobile Website Payment | Request | Response |
| officialAccount| Public Number Payment   | Request | Response |
| scan           | Sweep Payment     | Request | Response |
| miniProgram    | Small Procedure Payment   | Request | Response |

#### Wechat parameter configuration

```php
$wechatConfig = new Config();
$wechatConfig->setAppId('xxxxxx');      // Use this APPID in addition to widgets
$wechatConfig->setMiniAppId('xxxxxx');  // The applet uses this APPID
$wechatConfig->setMchId('xxxxxx');
$wechatConfig->setKey('xxxxxx');
$wechatConfig->setNotifyUrl('xxxxx');
$wechatConfig->setApiClientCert('xxxxxxx');//Client Certificate
$wechatConfig->setApiClientKey('xxxxxxx'); //Client Certificate Key
```

> Because the applet has an independent APPID, only two configuration items, AppId and MinAppId, need to be configured in the configuration at the same time. When paying, the corresponding APPID will be automatically selected to initiate payment.

## Public Number Payment

```php
$officialAccount = new OfficialAccount();
$officialAccount->setOpenid('xxxxxxx');
$officialAccount->setOutTradeNo('CN' . date('YmdHis') . rand(1000, 9999));
$officialAccount->setBody('xxxxx-test' . $outTradeNo);
$officialAccount->setTotalFee(1);
$officialAccount->setSpbillCreateIp('xxxxx');
$pay = new \EasySwoole\Pay\Pay();
$params = $pay->weChat($wechatConfig)->officialAccount($officialAccount);
```
You can refer to demo/wechat/index.php 

## H5 Payment

```php
$wap = new \EasySwoole\Pay\WeChat\RequestBean\Wap();
$wap->setOutTradeNo('CN' . date('YmdHis') . rand(1000, 9999));
$wap->setBody('xxxxx-WAPtest' . $outTradeNo);
$wap->setTotalFee(1);
$wap->setSpbillCreateIp('xxxxx');
$pay = new \EasySwoole\Pay\Pay();
$params = $pay->weChat($wechatConfig)->wap($wap);
```
## Small Procedure Payment
```php
$bean = new \EasySwoole\Pay\WeChat\RequestBean\MiniProgram();
$bean->setOpenid('xxxxxxxxx');
$bean->setOutTradeNo('CN' . date('YmdHis') . rand(1000, 9999));
$bean->setBody('xxxx-test' . $outTradeNo);
$bean->setTotalFee(1);
$bean->setSpbillCreateIp($this->request()->getHeader('x-real-ip')[0]);
$pay = new \EasySwoole\Pay\Pay();
$params = $pay->weChat($this->wechatConfig)->miniProgram($bean);
```

## Sweep Payment 

#### Mode 1  

Generate scanned links and generate two-dimensional codes. See demo/wechat/index.php

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

Scanning Callback Address (ps: Public Number Platform Settings)

```php
 $xml = $this->request()->getBody()->__toString();
$pay = new Pay();
$data = $pay->weChat($this->wechatConfig)->verify($xml);
$bean = new \EasySwoole\Pay\WeChat\RequestBean\Scan();
$bean->setOutTradeNo('CN' . date('YmdHis') . rand(1000, 9999));
$bean->setOpenid('xxxxxx');
$bean->setProductId($data['product_id']);
$bean->setBody('xxxxxx-SCANtest' . $outTradeNo);
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
#### Mode 2

```php
$bean = new \EasySwoole\Pay\WeChat\RequestBean\Scan();
$bean->setOutTradeNo($outTradeNo);
$bean->setProductId('123456789');
$bean->setBody('xxxx-SCAN2test' . $outTradeNo);
$bean->setTotalFee(1);
$bean->setSpbillCreateIp($this->request()->getHeader('x-real-ip')[0]);
$pay = new Pay();
$data = $pay->weChat($this->wechatConfig)->scan($bean);
$url2 = $data->getCodeUrl();
```

## Order query

```php
go(function () use ($wechatConfig) {
    $orderFind = new \EasySwoole\Pay\WeChat\RequestBean\OrderFind();
    $orderFind->setOutTradeNo('CN201903181044383609');
    $pay = new \EasySwoole\Pay\Pay();
    $info = $pay->weChat($wechatConfig)->orderFind($orderFind);
    print_r((array)$info);
});
```

## Application for refund

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

## Refund query

```php
go(function () use ($wechatConfig) {
    $refundFind = new \EasySwoole\Pay\WeChat\RequestBean\RefundFind();
    $refundFind->setOutTradeNo('CN201903181044383609');
    $pay = new \EasySwoole\Pay\Pay();
    $info = $pay->weChat($wechatConfig)->refundFind($refundFind);
    print_r((array)$info);
});
```

## Close the order

```php
go(function () use ($wechatConfig) {
    $close = new \EasySwoole\Pay\WeChat\RequestBean\Close();
    $close->setOutTradeNo('CN201903151343107239');
    $pay = new \EasySwoole\Pay\Pay();
    $info = $pay->weChat($wechatConfig)->close($close);
    print_r((array)$info);
});
```

## Download the statement

```php
go(function () use ($wechatConfig) {
    $download = new \EasySwoole\Pay\WeChat\RequestBean\Download();
    $download->setBillDate('20190312');
    $download->setBillType('ALL');//This parameter must be passed on
    $pay = new \EasySwoole\Pay\Pay();
    $info = $pay->weChat($wechatConfig)->download($download);
    echo htmlspecialchars($info, ENT_QUOTES);
});
```

## Download the statement of funds

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

## Verify signature

```php
$pay = new \EasySwoole\Pay\Pay();
$content = '';//Content is XML raw data,In easyswoole, it can be removed by $this->request()->getBody()->__toString()
$data = $pay->weChat($wechatConfig)->verify($content  )
```

## Server acknowledges receipt of asynchronous notification string acquisition

```php
\EasySwoole\Pay\WeChat\WeChat::success();//Successful response
\EasySwoole\Pay\WeChat\WeChat::fail();//Failure response
```