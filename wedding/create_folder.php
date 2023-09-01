<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->folderName) && !empty(trim($data->folderName))) {
        $folderName = trim($data->folderName);

        // Define the directory where you want to create the folder
        $baseDirectory = 'img/';

        // Ensure the folder name is unique
        $finalFolderName = $folderName;
        $counter = 1;
        while (is_dir($baseDirectory . $finalFolderName)) {
            $finalFolderName = $folderName . '-' . $counter;
            $counter++;
        }

        $folderPath = $baseDirectory . $finalFolderName;

        if (mkdir($folderPath)) {
            echo json_encode(["message" => "Folder '$finalFolderName' created successfully."]);
        } else {
            echo json_encode(["error" => "Failed to create folder '$finalFolderName'."]);
        }
    } else {
        echo json_encode(["error" => "Folder name is empty."]);
    }
} else {
    echo json_encode(["error" => "Invalid request method."]);
}
?>