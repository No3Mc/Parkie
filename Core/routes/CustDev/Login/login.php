<?php
    // Replace the placeholders with your own MongoDB Atlas credentials
    $username = "No3Mc";
    $password = "DJ2vCcF7llVDO2Ly";
    $dbname = "USER_DB";
    $collection = "users";
    $clustername = "Cluster0";
    
    // Set up a MongoDB connection
    $manager = new MongoDB\Driver\Manager("mongodb+srv://$username:$password@$clustername.mongodb.net/$dbname");

    // Retrieve the login credentials from the HTML form
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Set up a query to retrieve the user document with matching email and password fields
    $query = new MongoDB\Driver\Query([
        'email' => $email,
        'password' => $password
    ]);

    // Execute the query and retrieve the matching user document
    $result = $manager->executeQuery("$dbname.$collection", $query)->toArray();

    // Check if there is exactly one matching user document
    if (count($result) == 1) {
        // The login credentials are valid
        echo "Login successful";
    } else {
        // The login credentials are invalid
        echo "Invalid email or password";
    }
?>
