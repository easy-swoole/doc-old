<head>
     <title>EasySwoole route|swoole route|swoole Api service|swoole custom route</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole Handle upload files/Error|swoole http|swoole Api document"/>
     <meta name="description" content="EasySwoole Handle upload files/Error|swoole http|swoole Api document"/>
</head>
---<head>---

## UploadFile Object

The `UploadFile` will be initialised automatically when a file is uploaded, you may get its instance like below:
```php
<?php
$request=  $this->request();
// Get the \EasySwoole\Http\Message\UploadFile instance
$img_file = $request->getUploadedFile('img');

// Get all uploaded files: Array[\EasySwoole\Http\Message\UploadFile]
$data = $request->getUploadedFiles();
```

### Source code
```php
<?php
namespace EasySwoole\Http\Message;

use Psr\Http\Message\UploadedFileInterface;

class UploadFile implements UploadedFileInterface
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
        // Implement getTempName() method.
        return $this->tempName;
    }

    public function getStream()
    {
        // Implement getStream() method.
        return $this->stream;
    }

    public function moveTo($targetPath)
    {
        // Implement moveTo() method.
        return file_put_contents($targetPath,$this->stream) ? true :false;
    }

    public function getSize()
    {
        // Implement getSize() method.
        return $this->size;
    }

    public function getError()
    {
        // Implement getError() method.
        return $this->error;
    }

    public function getClientFilename()
    {
        // Implement getClientFilename() method.
        return $this->clientFileName;
    }

    public function getClientMediaType()
    {
        // Implement getClientMediaType() method.
        return $this->clientMediaType;
    }
}

```