---
title: CURL SSL error
meta:
  - name: description
    content: Easyswoole, CURL SSL error
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|CURL SSL error
---
## CURL SSL error
In the lower version of CURL, if the CURL is executed before the service is started, an ssl connection is executed. Then, after executing the curl again in the callback function, an error will be reported:
 `A PKCS #11 module returned CKR_DEVICE_ERROR, indicating that a problem has occurred with the token or slot.`
 If the CURL SSL connection is not executed before the service is started, no error is reported.
## Related code
```php
$a = function (){
    $ch = curl_init("https://www.baidu.com");
    $curlOPt = array(
        CURLOPT_CONNECTTIMEOUT=>3,
        CURLOPT_TIMEOUT=>10,
        CURLOPT_AUTOREFERER=>true,
        CURLOPT_USERAGENT=>"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)",
        CURLOPT_FOLLOWLOCATION=>true,
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_SSL_VERIFYPEER=>false,
        CURLOPT_SSL_VERIFYHOST=>false,
        CURLOPT_HEADER=>true,
    );
    curl_setopt_array($ch,$curlOPt);
    $result = curl_exec($ch);
    var_dump(curl_error($ch));
    curl_close($ch);
};

$a();

if(pcntl_fork()){
    $a();
}else{
    $a();
}

```
::: warning 
The same is true in swoole.
:::


## solution
Update libcurl to the latest 7.5.x and recompile php curl extension.
View the expanded version:
```
php --ri curl
```

