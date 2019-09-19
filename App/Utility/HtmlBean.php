<?php


namespace App\Utility;


use EasySwoole\Spl\SplBean;

class HtmlBean extends SplBean
{
    protected $body = '';
    /** @var HeadBean */
    protected $head;
    protected $script = [];


    protected function initialize(): void
    {
        if(!$this->head){
            $this->head = new HeadBean();
        }
    }

    /**
     * @return string
     */
    public function getBody(): string
    {
        return $this->body;
    }

    /**
     * @param string $body
     */
    public function setBody(string $body): void
    {
        $this->body = $body;
    }

    /**
     * @return HeadBean
     */
    public function getHead(): HeadBean
    {
        return $this->head;
    }

    /**
     * @param HeadBean $head
     */
    public function setHead(HeadBean $head): void
    {
        $this->head = $head;
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

    function __toString()
    {
        $dom = new \DOMDocument('1.0');
        $html = $dom->createElement("html");
        $head = $dom->createElement('head',$this->head);
        $body = $dom->createElement('body',$this->body);
        $script = $dom->createElement('script',implode("\n",$this->script));
        $html->appendChild($head);
        $html->appendChild($body);
        $html->appendChild($script);
        $dom->appendChild($html);
        return $dom->saveHTML();
    }
}