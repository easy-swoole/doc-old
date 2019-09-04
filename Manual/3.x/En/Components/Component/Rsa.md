## RSA
here is a components which include encryption ,decrypt, attestation signature functions

### example
```php
<?php
/**
 * Created by IntelliJ IDEA.
 * User: yongnan_wong
 * Date: 2019-09-04
 * Time: 15:29
 */

require_once './src/RSA.php';

$pub = '-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDpoODVtnSztGyb//p+g/Ob36jb
3jzWzS2qovOjpY/rrTjwlVcQpB2m1nZDQNpTFsG8ZBl7uPw3M81lr7NRRn6tY7Om
8tbOOsRgY6u0xwbgdRStFFvwPzZ1HehiQ6WB8za8cucCyvuqmBRp7HOjO4Aa9t0r
IvZ/hoWMeSvjnAVbMwIDAQAB
-----END PUBLIC KEY-----';

$pri = '-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDpoODVtnSztGyb//p+g/Ob36jb3jzWzS2qovOjpY/rrTjwlVcQ
pB2m1nZDQNpTFsG8ZBl7uPw3M81lr7NRRn6tY7Om8tbOOsRgY6u0xwbgdRStFFvw
PzZ1HehiQ6WB8za8cucCyvuqmBRp7HOjO4Aa9t0rIvZ/hoWMeSvjnAVbMwIDAQAB
AoGBAOEHsaiIDs6NKdP08r1rsXjhLI9i92zawnLKdCybKw4RknfBENSZj2oExnKv
A9vmXoNsU1NlcaJmRh/85ZaSdS4L+Zx8iz18uwXAjCPpfMd7nG4FD55713Lszhua
DQIxK06w2mI0ytwEf4cqQmct2/BWchBXZIlz9O0Q70CF2brpAkEA/3NtHrQNxbF0
KRvrrTw4c9Y76PyeESEmKuF8ZKQu6v1qSb/V3aZsiGPTH+vUf0oAmoJoGx1AtRuk
DAe9uQ5efQJBAOohcXTh7vgm5ujlyJEi85jGp2BnHxmNAHN6n1q44Hs1wbvICujH
SEaHhVt6hSf7/NXnGOtJXve0JIt5glvCX28CQCa1jASKDkg10r9j/ruak4diIGP2
29EGr+zxjFMH2iA71H5mdncHAA1O6zA8IVBEm4DOYA4zyZloHdzA04wWVFUCQQDY
9+cJVvq6smpYN+E3RrmRwb6IYuf6KKXbXi5gx2UYKQgA+e/KKis7WQlnbdIJ7MYw
f7mjCVpdmG4pZpA8cpM3AkAFRUXYKlxLusKBRDZSDCyCUzP/Y3ql/qWXOqcA5Brj
pj+cofEWd/jZqD3drFjDGvccFmTfEAVmXWxCnJAZU2cW
-----END RSA PRIVATE KEY-----';

$data = json_encode(['code'=>200,'data'=>'example'],JSON_UNESCAPED_UNICODE);

$rsa = new \EasySwoole\Crypto\RSA($pub,$pri);

$str = $rsa->encrypt($data);
var_dump($str);

$str = $rsa->decrypt($str);
var_dump($str);

$sign = $rsa->sign($data,OPENSSL_ALGO_MD5);
var_dump($sign);

$rs = $rsa->isValid($data,$sign,OPENSSL_ALGO_MD5);
var_dump($rs);

```
echo:
````
☁  crypto [master] ⚡   php test.php
string(172) "xPQoc183kZXfkWgSnAjQvxpZ4GqMIbUY2URNAYqKktK8yJbRpCacQ1wTNAZEHWMvhFzZi1fgWzOPXESPqX0DhbhAmVvqZUYp0elmYbr74U+wXjIYqmXDuVLYMUt8yRxsMGuefKOUM5xwfy2vt7kX9/9yXCKcUNoySQAdcmcSy+0="
string(37) "{"code":200,"data":"example"}"
string(172) "HmTA+/WffQaTjbqk8XEP3Bre2sdfWcBcmSD1gJ4bhpriWwNudBel+vIkBK7upNcBDuoJ9xDO9qada9Tk4mcSybBLcopGd7VOkB/jp2SsUZ0lkmighXA+afAsTRMOlRKk8dpLiLnMPYAqVqzX4O02KFZ9KJqf6JWZTitJAikG1Rw="
bool(true)
