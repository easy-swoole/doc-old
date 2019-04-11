##UploadFile对象

该对象在用户上传文件时自动生成,可通过以下方法获取
```php
<?php
$request=  $this->request();
$img_file = $request->getUploadedFile('img');//获取一个上传文件,返回的是一个\EasySwoole\Http\Message\UploadFile的对象
$data = $request->getUploadedFiles();
```

### 实现代码:
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/5/24
 * Time: 下午3:20
 */

namespace EasySwoole\Http\Message;


class UploadFile
{
    private $tempName;
    private $stream;
    private $size;
    private $error;
    private $clientFileName;
    private $clientMediaType;
    function __construct( $tempName,$size, $errorStatus, $clientFilename = null, $clientMediaType = null)
    {
        $this->tempName = $tempName;
        $this->stream = new Stream(fopen($tempName,"r+"));
        $this->error = $errorStatus;
        $this->size = $size;
        $this->clientFileName = $clientFilename;
        $this->clientMediaType = $clientMediaType;
    }
    
    public function getTempName() {
        // TODO: Implement getTempName() method.
        return $this->tempName;
    }

    public function getStream()
    {
        // TODO: Implement getStream() method.
        return $this->stream;
    }

    public function moveTo($targetPath)
    {
        // TODO: Implement moveTo() method.
        return file_put_contents($targetPath,$this->stream) ? true :false;
    }

    public function getSize()
    {
        // TODO: Implement getSize() method.
        return $this->size;
    }

    public function getError()
    {
        // TODO: Implement getError() method.
        return $this->error;
    }

    public function getClientFilename()
    {
        // TODO: Implement getClientFilename() method.
        return $this->clientFileName;
    }

    public function getClientMediaType()
    {
        // TODO: Implement getClientMediaType() method.
        return $this->clientMediaType;
    }
}

```