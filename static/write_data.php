<?php
header('Access-Control-Allow-Origin: web.mit.edu/*');
// get the data from the POST message
$post_data = json_decode(file_get_contents('php://input'), true);
// $post_data = $_POST;
$data = $post_data['filedata'];
$name = $post_data['filename'];
// the directory must be writable by the server
$fname = "/mit/thclark/Private/yc_results/{$name}.csv"; 
// write the file to disk
file_put_contents($fname, $data);
// echo($fname)
?>