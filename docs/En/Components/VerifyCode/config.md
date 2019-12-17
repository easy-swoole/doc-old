---
title: Verification code
meta:
  - name: description
    content: EasySwoole verification code component, can be customized to generate QR code graphics or base64 encoding.
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|Verification code|Swoole verification code
---
## Configuration
   
An object instance that needs to be passed to Config before generating the verification code
   After the Config class is instantiated, there will be a default configuration, and a verification code image can be generated without configuration.
   
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
 * 验证码配置文件
 * Class VerifyCodeConf
 * @author  : evalor <master@evalor.cn>
 * @package Vendor\VerifyCode
 */
class Conf extends SplBean
{

    public $charset   = '1234567890AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'; // 字母表
    public $useCurve  = false;         // Confusion curve
    public $useNoise  = false;         // Random noise
    public $useFont   = null;          // Specified font
    public $fontColor = null;          // font color
    public $backColor = null;          // background color
    public $imageL    = null;          // Image width
    public $imageH    = null;          // Picture height
    public $fonts     = [];            // Extra font
    public $fontSize  = 25;            // font size
    public $length    = 4;             // Number of generated bits
    public $mime      = MIME::PNG;     // Setting type
    public $temp      = '/tmp';  // Set the cache directory

    public function setTemp($temp){
        if (!is_dir($temp)) mkdir($temp,0755) && chmod($temp,0755);
        $this->temp = $temp;
    }

    /**
     * Set image format
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
     * Set character set
     * @param string $charset
     * @return Conf
     */
    public function setCharset($charset)
    {
        is_string($charset) && $this->charset = $charset;
        return $this;
    }

    /**
     * Turn on the confusion curve
     * @param bool $useCurve
     * @return Conf
     */
    public function setUseCurve($useCurve = true)
    {
        is_bool($useCurve) && $this->useCurve = $useCurve;
        return $this;
    }

    /**
     * Turn on noise generation
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
     * Set text color
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
     * Set image width
     * @param int|string $imageL
     * @return Conf
     */
    public function setImageWidth($imageL)
    {
        $this->imageL = intval($imageL);
        return $this;
    }

    /**
     * Set picture height
     * @param null $imageH
     * @return Conf
     */
    public function setImageHeight($imageH)
    {
        $this->imageH = intval($imageH);
        return $this;
    }

    /**
     * Set font set
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
     * Set the font size
     * @param int $fontSize
     * @return Conf
     */
    public function setFontSize($fontSize)
    {
        $this->fontSize = intval($fontSize);
        return $this;
    }

    /**
     * Set the verification code length
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
     * Hex to RGB
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
