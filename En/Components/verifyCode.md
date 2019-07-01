
#EasySwoole Verification Code Component  

> Warehouse Address: [Verification Code Component](https://github.com/easy-swoole/verifyCode)

EasySwoole provides an independent `Verification Code Component', which can output a Verification Code in a few lines of code.

## Composer install
```
composer require easyswoole/verifycode=3.x
```

### Example:  
```php
<?php
/**
 * Created by PhpStorm.
 * User: Apple
 * Date: 2018/11/12 0012
 * Time: 16:30
 */

namespace App\HttpController;
use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\VerifyCode\Conf;

class VerifyCode extends Controller
{
    function index()
    {
        $config = new Conf();
        $code = new \EasySwoole\VerifyCode\VerifyCode($config);
        $this->response()->withHeader('Content-Type','image/png');
        $this->response()->write($code->DrawCode()->getImageByte());
    }

    function getBase64(){
        $config = new Conf();
        $code = new \EasySwoole\VerifyCode\VerifyCode($config);
        $this->response()->write($code->DrawCode()->getImageBase64());
    }
}
```

## Config.php
Object instances that need to be passed into Config before generating validation codes  
Config class will be instantiated with default configuration, and it can generate two-dimensional code without configuration.

### Implementation code:
```php
<?php
// +----------------------------------------------------------------------
// | easySwoole [ use swoole easily just like echo "hello world" ]
// +----------------------------------------------------------------------
// | WebSite: https://www.easyswoole.com
// +----------------------------------------------------------------------
// | Welcome Join QQGroup 633921431
// +----------------------------------------------------------------------

namespace EasySwoole\VerifyCode;

use EasySwoole\Spl\SplBean;

/**
 * Verification code configuration file
 * Class VerifyCodeConf
 * @author  : evalor <master@evalor.cn>
 * @package Vendor\VerifyCode
 */
class Conf extends SplBean
{

    public $charset   = '1234567890AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'; // Alphabet
    public $useCurve  = false;         // Confusion curve
    public $useNoise  = false;         // Random Noise Points
    public $useFont   = null;          // Specified font
    public $fontColor = null;          // Font color
    public $backColor = null;          // Background color
    public $imageL    = null;          // Image width
    public $imageH    = null;          // Picture Height
    public $fonts     = [];            // Additional fonts
    public $fontSize  = 25;            // Font size
    public $length    = 4;             // Generating digits
    public $mime      = MIME::PNG;     // Setting type
    public $temp      = '/tmp';  // Setting Cache Directory

    public function setTemp($temp){
        if (!is_dir($temp)) mkdir($temp,0755) && chmod($temp,0755);
        $this->temp = $temp;
    }

    /**
     * Setting Picture Format
     * @param $MimeType
     * @author : evalor <master@evalor.cn>
     * @return Conf
     */
    public function setMimeType($MimeType)
    {
        $allowMime = [ MIME::PNG, MIME::GIF, MIME::JPG ];
        if (in_array($MimeType, $allowMime)) $this->mime = $MimeType;
        return $this;
    }

    /**
     * Setting Character Set
     * @param string $charset
     * @return Conf
     */
    public function setCharset($charset)
    {
        is_string($charset) && $this->charset = $charset;
        return $this;
    }

    /**
     * Open confusion curve
     * @param bool $useCurve
     * @return Conf
     */
    public function setUseCurve($useCurve = true)
    {
        is_bool($useCurve) && $this->useCurve = $useCurve;
        return $this;
    }

    /**
     * Turn on Noise Point Generation
     * @param bool $useNoise
     * @return Conf
     */
    public function setUseNoise($useNoise = true)
    {
        is_bool($useNoise) && $this->useNoise = $useNoise;
        return $this;
    }

    /**
     * Use custom fonts
     * @param string $useFont
     * @return Conf
     */
    public function setUseFont($useFont)
    {
        is_string($useFont) && $this->useFont = $useFont;
        return $this;
    }

    /**
     * Setting text color
     * @param array|string $fontColor
     * @return Conf
     */
    public function setFontColor($fontColor)
    {
        if (is_string($fontColor)) $this->fontColor = $this->HEXToRGB($fontColor);
        if (is_array($fontColor)) $this->fontColor = $fontColor;
        return $this;
    }

    /**
     * Set the background color
     * @param null $backColor
     * @return Conf
     */
    public function setBackColor($backColor)
    {
        if (is_string($backColor)) $this->backColor = $this->HEXToRGB($backColor);
        if (is_array($backColor)) $this->backColor = $backColor;
        return $this;
    }

    /**
     * Set Picture Width
     * @param int|string $imageL
     * @return Conf
     */
    public function setImageWidth($imageL)
    {
        $this->imageL = intval($imageL);
        return $this;
    }

    /**
     * Set Picture Height
     * @param null $imageH
     * @return Conf
     */
    public function setImageHeight($imageH)
    {
        $this->imageH = intval($imageH);
        return $this;
    }

    /**
     * Setting Font Set
     * @param array|string $fonts
     * @return Conf
     */
    public function setFonts($fonts)
    {
        if (is_string($fonts)) array_push($this->fonts, $fonts);
        if (is_array($fonts) && !empty($fonts)) {
            if (empty($this->fonts)) {
                $this->fonts = $fonts;
            } else {
                array_merge($this->fonts, $fonts);
            }
        }
        return $this;
    }

    /**
     * Set font size
     * @param int $fontSize
     * @return Conf
     */
    public function setFontSize($fontSize)
    {
        $this->fontSize = intval($fontSize);
        return $this;
    }

    /**
     * Setting Verification Code Length
     * @param int $length
     * @return Conf
     */
    public function setLength($length)
    {
        $this->length = intval($length);
        return $this;
    }

    /**
     * Get configuration values
     * @param $name
     * @author : evalor <master@evalor.cn>
     * @return mixed
     */
    public function __get($name)
    {
        return $this->$name;
    }

    /**
     * Hexadecimal to RGB
     * @param $hexColor
     * @author : evalor <master@evalor.cn>
     * @return array
     */
    function HEXToRGB($hexColor)
    {
        $color = str_replace('#', '', $hexColor);
        if (strlen($color) > 3) {
            $rgb = array(
                hexdec(substr($color, 0, 2)),
                hexdec(substr($color, 2, 2)),
                hexdec(substr($color, 4, 2))
            );
        } else {
            $color = $hexColor;
            $r = substr($color, 0, 1) . substr($color, 0, 1);
            $g = substr($color, 1, 1) . substr($color, 1, 1);
            $b = substr($color, 2, 1) . substr($color, 2, 1);
            $rgb = array(
                hexdec($r),
                hexdec($g),
                hexdec($b)
            );
        }
        return $rgb;
    }
}
```

## Verification Code Generation
 
### VerifyCode.php
VerifyCode validation code operation class automatically instantiates a Config instance if it is not passed in
#### Call method:
```
$config = new Conf();
$code = new \EasySwoole\VerifyCode\VerifyCode($config);
$code->DrawCode();//Generate a validation code and return a Result object
```

### Result.php
VerifyCode result class, created and returned when the VerifyCode validation code operation class calls DrawCode() method
Method List:
```php
 /**
     * Get Verification Code Pictures
     * @author : evalor <master@evalor.cn>
     * @return mixed
     */
    function getImageByte()
    {
        return $this->CaptchaByte;
    }

    /**
     * Returns the image Base64 string
     * @author : evalor <master@evalor.cn>
     * @return string
     */
    function getImageBase64()
    {
        $base64Data = base64_encode($this->CaptchaByte);
        $Mime = $this->CaptchaMime;
        return "data:{$Mime};base64,{$base64Data}";
    }

    /**
     * Get Verification Code Content
     * @author : evalor <master@evalor.cn>
     * @return mixed
     */
    function getImageCode()
    {
        return $this->CaptchaCode;
    }

    /**
     * Getting Mime information
     * @author : evalor <master@evalor.cn>
     */
    function getImageMime()
    {
        return $this->CaptchaMime;
    }

    /**
     * Get the Verification Code File Path
     * @author: eValor < master@evalor.cn >
     */
    function getImageFile()
    {
        return $this->CaptchaFile;
    }
```

