<?php

/** 
 * Index
 * 
 * Handles the landing pages
 * 
 * @author Cristian Mitoi
 */
 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: *");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {    
    exit(0);
} 

if ( !in_array($_SERVER['REQUEST_METHOD'], ['POST','GET'] )) {
    http_response_code(405);
    $output['error'] = $_SERVER['REQUEST_METHOD'] . " method not allowed";
    die (json_encode($output));
}

$url = $_SERVER['REQUEST_URI'];
$path = parse_url($url)['path'];
$path = str_replace("/api", "", $path);

include 'config/config.php';


switch ($path) {
    case '/auth':
    case '/auth/':
        $authenticate = new Authenticate();
        $data = $authenticate->getData();
        break;
    case '/messages':
    case '/messages/':
        $message = new Message();
        $data = $message->getData();
        break;
    case '/update': 
    case '/update/': 
        $update = new Update();
        $data = $update->getData();
        break;
    case '/receive': 
    case '/receive/': 
        $receive = new Receive();
        $data = $receive->getData();
        break;
    case '/donor': 
    case '/donor/': 
        $donor = new Donor();
        $data = $donor->getData();
        break;
        
    default:
        http_response_code(404);
        $data = array("Message"=>"Endpoint ".$path." not found (404)");
        break;
}

echo json_encode($data);