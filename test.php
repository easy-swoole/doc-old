<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/6/26 0026
 * Time: 10:18
 */

$path = './Manual/3.x/Cn';
filehandel($path);
function filehandel($path, $i = 0)
{
    $opendir = opendir($path);
    while ($file = readdir($opendir)) {
        if ($file == '.' || $file == '..') {
            continue;
        }
        $filePath = $path . '/' . $file;
        if (is_dir($filePath)) {
//            var_dump($filePath);
            filehandel($filePath,$i+1);
        }
        if ($i > 0 && is_file($filePath)) {
            var_dump($filePath);
            $a = substr($file,0,1);
//            rename($filePath,$path.'/'.strtolower($a).substr($file,1));
        }
    }
}

//var_dump(scandir('./Manual/3.x/Cn'));