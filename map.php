<?php

ini_set("allow_url_fopen", 1);
$json = file_get_contents('https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=49.9569&lng=-119.3787&fDstL=0&fDstU=500');

echo $json;

?>