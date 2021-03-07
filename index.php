<?php
  $json = file_get_contents('./code/entry.json');
  $entries = json_decode($json, true)
?>
<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" type="text/css" href="style.css">
  <link rel="stylesheet" type="text/css" href="prism.css">
  <script src="prism.js"></script>
  <title>牧码</title>
</head>
<body>
  <div class="container">
    <div id="items">
      <ul class="list">
        <?php
          $item =
          '<li class="item" data-path="%s" data-language="%s">'.
            '<div class="language">%s</div>'.
            '<div class="name">%s</div>'.
            '<div class="contact">'.
              '<span class="author">%s</span>'.
              '<span class="email"> ( %s )</span>'.
            '</div>'.
          '</li>';
          foreach ($entries as $entry) {
            foreach ($entry as $key => $value) {
              $entry[$key] = htmlspecialchars($value);
            }
            $html = sprintf($item, $entry['path'], $entry['language'], $entry['language'], $entry['name'], $entry['author'], $entry['email']);
            echo $html;
          }
        ?>
      </ul>
    </div>
    <div class="view-container">
      <pre id="view" class="line-numbers">
        <div class="muma">牧码</div>
      </pre>
    </div>
  </div>
  <script src="main.js"></script>
</body>
</html>