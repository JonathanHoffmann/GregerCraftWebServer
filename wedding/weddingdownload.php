<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["file"])) {
    // Retrieve the folder name from the form data (if provided)
    $folderName = isset($_POST['folderName']) ? $_POST['folderName'] : '';

    // Define the directory where you want to upload the images (base folder)
    $baseDirectory = 'img/';

    if (!empty($folderName)) {
        // Ensure the folder exists, or create it if it doesn't
        $folderPath = $baseDirectory . $folderName;
        if (!is_dir($folderPath)) {
            mkdir($folderPath, 0777, true);
        }
    } else {
        // No folder name provided, upload to the base folder
        $folderPath = $baseDirectory;
    }

    $files = $_FILES["file"];
    
    // Process and move each uploaded file to the folder
    for ($i = 0; $i < count($files["name"]); $i++) {
        $fileName = $files["name"][$i];
        $fileTmpName = $files["tmp_name"][$i];
        $uploadPath = $folderPath . '/' . $fileName;

        if (move_uploaded_file($fileTmpName, $uploadPath)) {
            echo json_encode(["message" => "Uploaded: $fileName"]);
        } else {
            echo json_encode(["error" => "Error uploading: $fileName"]);
        }
    }
} else {
    echo json_encode(["error" => "Invalid request method."]);
}
?>