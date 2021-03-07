<?php
  $fn = './code/'.$_GET['path'];
  if (!isset($fn) || !file_exists($fn)) {
    echo '出错了！';
    exit();
  }
  echo file_get_contents($fn);
?>