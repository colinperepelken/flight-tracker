<?php

$degrees = 360 - $_GET['deg'];

$icon = $_GET['img'];
$im = imagecreatefrompng($icon);
imagesavealpha($im , true);
$pngTransparency = imagecolorallocatealpha($im , 0, 0, 0, 127);
imagefill($im , 0, 0, $pngTransparency);
 
$rotate = imagerotate($im, $degrees, $pngTransparency);
 
imagealphablending($rotate,true);
imagesavealpha($rotate,true);
header('Content-Type: image/png');
imagepng($rotate);

?>