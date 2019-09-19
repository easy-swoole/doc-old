<?php


namespace App\HttpController;


use App\Utility\Builder;
use EasySwoole\Http\AbstractInterface\Controller;
use voku\helper\HtmlDomParser;
use voku\helper\SimpleHtmlDom;

class Index extends Controller
{

    function index()
    {
        $file = EASYSWOOLE_ROOT.'/Doc/index.html';
        if(is_file($file)){
            $this->response()->write(file_get_contents($file));
        }else{
            $this->writeJson(404,null,'file not exist');
        }
    }

    function _gitHook()
    {
        Builder::buildDir(EASYSWOOLE_ROOT.'/Doc/Cn',EASYSWOOLE_TEMP_DIR.'/Doc/Cn');
    }

    protected function actionNotFound(?string $action)
    {
        $path = $this->request()->getUri()->getPath();
        $rootDir = explode("/",$path)[1];

        $file = EASYSWOOLE_TEMP_DIR.'/Doc'.$path;
        if(file_exists($file)){
            if($this->request()->getMethod() == 'POST'){
                $this->response()->write(file_get_contents($file));
            }else{
                /*
                 * 构建完整的页面
                 */
                $tpl = file_get_contents(EASYSWOOLE_ROOT.'/Doc/page.tpl');
                $content = HtmlDomParser::str_get_html(file_get_contents($file));
                $summary = HtmlDomParser::str_get_html(file_get_contents(EASYSWOOLE_TEMP_DIR."/Doc/{$rootDir}/summary.html"));
                $tpl = str_replace('{!--HEAD--}',$content->find('head',0)->innertext,$tpl);
                $tpl = str_replace('{!--SUMMARY--}',$summary->find('body',0)->innertext,$tpl);
                $tpl = str_replace('{!--BODY--}',$content->find('body',0)->innertext,$tpl);

                // we want nice output
                $dom = new \DOMDocument();
                $dom->preserveWhiteSpace = false;
                libxml_use_internal_errors(true);
                $dom->loadHTML((string)$tpl);
                libxml_clear_errors();
                $dom->formatOutput = true;
                $this->response()->write(html_entity_decode(($dom->saveHTML())));
            }

        }else{
            if(substr($path,-4) == 'html'){
                $this->response()->redirect('/');
            }else{
                $this->response()->withStatus(404);
            }
        }
    }
}