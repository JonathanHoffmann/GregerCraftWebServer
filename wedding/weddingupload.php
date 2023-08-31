<?php
$uploadDirectory = "img/";

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["file"])) {
    $files = $_FILES["file"];

    for ($i = 0; $i < count($files["name"]); $i++) {
        $fileName = $files["name"][$i];
        $fileTmpName = $files["tmp_name"][$i];
        $uploadPath = $uploadDirectory . $fileName;

        // Check if the uploaded file is a video
        if ($files['type'][$i] === 'video/quicktime') {
            $outputFile = 'img/output.mp4';

            // Execute FFmpeg command to re-encode video
            $ffmpegCommand = "ffmpeg-6.0-full_build/bin/ffmpeg.exe -i $fileTmpName -c:v libx264 -preset medium -crf 23 -c:a aac -strict experimental $outputFile";
            echo($ffmpegCommand);
            exec($ffmpegCommand);
        }

        if (move_uploaded_file($fileTmpName, $uploadPath)) {
            echo "Uploaded: $fileName\n";
        } else {
            echo "Error uploading: $fileName\n";
        }
    }
}
?>