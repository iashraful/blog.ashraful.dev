<?php
    $servername = "localhost";
    $username = "root";
    $password = "admin";  // Change the password if you need
    $database = "website";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $database);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    // echo "Success!!";
?>