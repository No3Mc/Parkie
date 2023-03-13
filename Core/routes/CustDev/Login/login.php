<?php
    $username = "No3Mc";
    $password = "DJ2vCcF7llVDO2Ly";
    $dbname = "USER_DB";
    $collection = "users";
    $clustername = "Cluster0";
    
    $manager = new MongoDB\Driver\Manager("mongodb+srv://$username:$password@$clustername.mongodb.net/$dbname");

    $email = $_POST['email'];
    $password = $_POST['password'];

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


// testing the maan choud driver for php. Gand pharh di hai database ne

    $query = new MongoDB\Driver\Query([]);
    $result = $manager->executeQuery("$dbname.$collection", $query)->toArray();
    print_r($result);
    



?>
