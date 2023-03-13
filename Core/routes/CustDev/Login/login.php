<?php
    $username = "No3Mc";
    $password = "DJ2vCcF7llVDO2Ly";
    $dbname = "USER_DB";
    $collection = "users";
    $clustername = "Cluster0";
    
    $manager = new MongoDB\Driver\Manager("mongodb+srv://$username:$password@$clustername.mongodb.net/$dbname");

    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    $query = new MongoDB\Driver\Query([
        'email' => $email,
        'password' => $password
    ]);

    $result = $manager->executeQuery("$dbname.$collection", $query)->toArray();

    if (count($result) == 1) {
        echo "Login successful";
    } else {
        echo "Invalid email or password";
    }
?>
