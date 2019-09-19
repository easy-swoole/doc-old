<?php


namespace App\Utility;


use EasySwoole\Spl\SplBean;

class HeadBean extends SplBean
{
    protected $base = [];
    protected $link = [];
    protected $meta = [];
    protected $script = [];
    protected $style = [];
    protected $title = '';

    /**
     * @return array
     */
    public function getBase(): array
    {
        return $this->base;
    }

    /**
     * @param array $base
     */
    public function setBase(array $base): void
    {
        $this->base = $base;
    }

    /**
     * @return array
     */
    public function getLink(): array
    {
        return $this->link;
    }

    /**
     * @param array $link
     */
    public function setLink(array $link): void
    {
        $this->link = $link;
    }

    /**
     * @return array
     */
    public function getMeta(): array
    {
        return $this->meta;
    }

    /**
     * @param array $meta
     */
    public function setMeta(array $meta): void
    {
        $this->meta = $meta;
    }

    /**
     * @return array
     */
    public function getScript(): array
    {
        return $this->script;
    }

    /**
     * @param array $script
     */
    public function setScript(array $script): void
    {
        $this->script = $script;
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @param string $title
     */
    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    /**
     * @return array
     */
    public function getStyle(): array
    {
        return $this->style;
    }

    /**
     * @param array $style
     */
    public function setStyle(array $style): void
    {
        $this->style = $style;
    }

    public function __toString()
    {
        $dom = new \DOMDocument('1.0');
        $title = $dom->createElement('title',$this->title);
        $dom->appendChild($title);
        foreach (['style','base','link','meta','script'] as $key){
            foreach ($this->$key as $value){
                $temp = $dom->createElement($key,$value);
                $dom->appendChild($temp);
            }
        }
        return $dom->saveHTML();
    }
}