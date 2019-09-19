<?php


namespace App\HttpController;


use EasySwoole\Http\AbstractInterface\Controller;

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

    protected function actionNotFound(?string $action)
    {
        $path = $this->request()->getUri()->getPath();
        $file = EASYSWOOLE_TEMP_DIR.'/Doc'.$path;
        if(file_exists($file)){
            if($this->request()->getMethod() == 'POST'){
                $this->response()->write(file_get_contents($file));
            }else{
                /*
                 * 构建完整的页面
                 */
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