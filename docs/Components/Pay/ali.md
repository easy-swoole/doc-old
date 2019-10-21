---
title: 支付宝SDK
meta:
  - name: description
    content: 支付宝SDK是封装的协程支付宝支付组件库,
  - name: keywords
    content: easyswoole|AliPay|支付宝支付组件|swoole 支付宝
---

# 协程支付网关
```
composer require easyswoole/pay
```

## 支付宝

#### 支付方法

支付宝支付目前支持 7 种支付方法，对应的支付 method 如下：

| method   | 说明        | 参数    | 返回值    |
|:---------|:-----------|:--------|:----------|
| web      | 电脑支付    | Request | Response  |
| wap      | 手机网站支付 | Request | Response  |
| app      | APP 支付    | Request | Response  |
| pos      | 刷卡支付    | Request | Response  |
| scan     | 扫码支付    | Request | Response  |
| transfer | 账户转账    | Request | Response  |
| mini     | 小程序支付  | Request | Response  |

## 电脑支付

::: tip
统一收单下单并支付页面接口
:::

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








