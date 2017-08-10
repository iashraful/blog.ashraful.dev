<?php
    $servername = "";
    $username = "";
    $password = "";  // Change the password if you need
    $database = "";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $database);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    // echo "Success!!";
?>