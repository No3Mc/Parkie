<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = $_POST['name'];
  $email = $_POST['email'];
  $phone = $_POST['phone'];
  $postcode = $_POST['postcode'];
  $password = $_POST['password'];

  $userData = $name . ',' . $email . ',' . $phone . ',' . $postcode . ',' . $password . "\n";

  $file = fopen('users.csv', 'a');
  fwrite($file, $userData);
  fclose($file);

  echo 'User registered successfully';
} else {
  echo 'Invalid request method';
}

?>
