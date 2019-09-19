<?php


namespace App\Utility;


use EasySwoole\Utility\File;

class Builder
{
    public static function buildDir(string $source,string $target)
    {
        File::cleanDirectory($target);
        $target = rtrim($target,'/');
        $list = File::scanDirectory($source);
        foreach ($list['files'] as $file){
            if(substr($file,-2) == 'md'){
                $html = Markdown::toHtml($file)->__toString();
                $relatePath = str_replace($source,'',$file);
                $relatePath = substr($target.$relatePath,0,-2).'html';
                File::createFile($relatePath,$html);
            }
        }
    }
}