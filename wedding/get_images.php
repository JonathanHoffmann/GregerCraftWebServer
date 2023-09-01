<?php
function listFiles($dir) {
    $result = [];
    $files = scandir($dir);

    foreach ($files as $file) {
        if ($file != "." && $file != "..") {
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                // If it's a directory, list its contents
                $result[] = [
                    "type" => "folder",
                    "name" => $file,
                    "contents" => listFiles($path)
                ];
            } else {
                // If it's a file, add it to the result
                $result[] = [
                    "type" => "file",
                    "name" => $file
                ];
            }
        }
    }

    return $result;
}

$galleryDir = "img/";
$galleryContents = listFiles($galleryDir);

header("Content-Type: application/json");
echo json_encode($galleryContents);
?>