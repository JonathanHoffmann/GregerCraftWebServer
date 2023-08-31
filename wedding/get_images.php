<?php
$images = array_diff(scandir("img/"), array('..', '.'));  // Get all filenames except "." and ".."
echo json_encode(array_values($images));  // Convert associative array to a numeric indexed array
?>