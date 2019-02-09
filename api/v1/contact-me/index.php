<?PHP
include '../../config/db_config.php';
header('Content-Type: application/json');


if($_SERVER['REQUEST_METHOD'] == 'GET') {
	$response = ['status' => 405, 'message' => '[GET] Method not allowed.'];
    echo json_encode($response);
}
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
	// echo json_encode($data);
	$api_response = ['status' => 200, 'success' => true];
	$name = $data['name'];
    $email = $data['email'];
    $message = $data['message'];

    $query = "INSERT INTO contact_me (`name`, `email`, `message`) VALUES('".$name."', '".$email."', '".$message."')";
    $response = $conn->query($query);
    if ($response === TRUE) {
        echo json_encode($api_response);
    }
    else {
        $api_response = ['status' => 400, 'success' => false];
        echo json_encode($api_response);
    }
}

?>