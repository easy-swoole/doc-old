<?php


namespace App\Utility;


use voku\helper\HtmlDomParser;

class Markdown
{
    public static function toText(string $file):?string
    {
        if(file_exists($file)){
            $parsedown = new \Parsedown();
            return $parsedown->text(file_get_contents($file));
        }else{
            return null;
        }
    }

    public static function toHtml(string $file):HtmlBean
    {
        $html = new HtmlBean();
        $dom = HtmlDomParser::str_get_html(self::toText($file));
        /*
         * 处理头部
         */
        if($dom->find('head',0)){
            if($dom->find('head title',0)){
                $html->getHead()->setTitle((string)$dom->find('head title',0));
            }
            foreach (['style','base','link','meta','script'] as $key){
                $temp = [];
                foreach ($dom->find("head {$key}") as $subject){
                    $temp[] = (string)$subject;
                }
                $action = "set".ucfirst($key);
                $html->getHead()->$action($temp);
            }
            /*
             * 删除head
             */
            $dom->find('head',0)->outertext = '';
        }
        /*
         * 处理尾部的script
         */
        $temp = [];
        foreach ($dom->find('script') as $subject){
            $temp[] = (string)$subject;
            $subject->outertext = '';
        }
        $html->setScript($temp);
        $html->setBody($dom->__toString());
        unset($dom);
        return $html;
    }
}