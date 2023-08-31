<?php
$images = array_diff(scandir("img/"), array('..', '.'));

foreach ($images as $imageName) {
    echo '<a href="img/' . $imageName . '" download>' . $imageName . '</a><br>';
}
?>