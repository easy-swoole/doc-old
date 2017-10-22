# 随机内容生成工具

本工具提供生成随机字符串的能力，可以用于生成随机ID，随机编号(支持并发)等场景

### randStr

用于生成一串随机字符串，字符串的内容从 `0-9` `a-z` `A-Z`中随机选择

```
use Core\Utility\Random;

// 生成字母不重复的随机字符串(最大支持57位)
Random::randStr(16); // 样例: n3wUj7a1RmXuPEz5

// 允许字母重复
Random::randStr(16, false); // 样例: fNUFu47pQfHiFuYc
```

### randNumStr

用于生成一串由 `0-9` 数字组成的随机数字字符串

```
use Core\Utility\Random;

Random::randNumStr(16); // 样例: '1294681249507592'
```

### randOrderCode

使用SnowFlake算法生成一个唯一的序列号，自动获取WorkerID进行计算，可以保证在高并发场景下的唯一编号，最大支持1023个Worker，支持添加前缀后缀

```
use Core\Utility\Random;

Random::randOrderCode('ORD','T'); // 样例: 'ORD4733869468080693574T'
```


<script>
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?4c8d895ff3b25bddb6fa4185c8651cc3";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
</script>
<script>
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';        
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();
</script>