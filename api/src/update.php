<?php

/** 
 * Update Status
 * 
 * Update the status for a specific message. A valid JWT
 * is required.
 * 
 * If status is updated to "approved", then an email is sent.
 * 
 * @author Cristian Mitoi
 */

require './vendor/autoload.php'; 
use FirebaseJWT\JWT;
use FirebaseJWT\Key;
use SendGrid\Mail\Mail;
 
class Update extends Endpoint 
{

    public function __construct()
    {
        $this->validateRequestMethod("POST");
        $this->validateToken();
        $this->validateUpdateParams();
        $this->sendEmail();

        $db = new Database("db/data.sqlite");
        $this->initialiseSQL();
        $queryResult = $db->executeSQL($this->getSQL(), $this->getSQLParams());

        $this->setData( array(
            "length" => 0,
            "message" => "succes",
            "data" => null
        ));
    }

    private function validateRequestMethod($method) {
  if ($_SERVER['REQUEST_METHOD'] != $method) {
    throw new ClientErrorException("Invalid Request Method", 405);
   }

  }

    private function validateToken() {
  $key = SECRET;
        
  // Get all headers from the http request
  $allHeaders = getallheaders();
  $authorizationHeader = "";
        
  // Look for an Authorization header. This 
  // this might not exist. It might start with a capital A (requests
  // from Postman do), or a lowercase a (requests from browsers might)
  if (array_key_exists('Authorization', $allHeaders)) {
    $authorizationHeader = $allHeaders['Authorization'];
  } elseif (array_key_exists('authorization', $allHeaders)) {
    $authorizationHeader = $allHeaders['authorization'];
  }
        
  // Check if there is a Bearer token in the header
  if (substr($authorizationHeader, 0, 7) != 'Bearer ') {
    throw new ClientErrorException("Bearer token required", 401);
  }
 
  // Extract the JWT from the header 
  $jwt = trim(substr($authorizationHeader, 7));
 try{
  $decoded = JWT::decode($jwt, new Key($key, 'HS256'));

 }catch (Exception $e){
    throw new ClientErrorException($e->getMessage(), 401);
    }

    if ($decoded->iss != $_SERVER['HTTP_HOST']) {
  throw new ClientErrorException("invalid token issuer", 401);
 }

   }

   private function validateUpdateParams() {
 
  //Look for a status and message_id parameter
  if (!filter_has_var(INPUT_POST,'status')) {
    throw new ClientErrorException("status parameter required", 400);
  }
  if (!filter_has_var(INPUT_POST,'message_id')) {
    throw new ClientErrorException("message_id parameter required", 400);
  }
       
  // Check to see if a valid status is supplied 
  $status = ["pending", "approved", "dismissed"];
  if (!in_array(strtolower($_POST['status']), $status)) {
    throw new ClientErrorException("invalid status", 400);
  }
}  

  private function sendEmail() {
  
    $status = ["approved"];
    //check if status is approved
    if (in_array(strtolower($_POST['status']), $status)) {
        $db = new Database("db/data.sqlite");
        $message_id = $_POST['message_id'];
        $sql = "SELECT m.message_id, m.message, d.email, d.first_name FROM MESSAGES AS m 
                JOIN DONOR AS d ON m.donor_id = d.donor_id WHERE message_id = :message_id ";
        $queryResult = $db->executeSQL($sql, ['message_id' => $message_id]);
          
        //storing data of the array returned by the query
        if (!empty($queryResult)) {
            $dataMessageID = $queryResult[0]['message_id'];
            $dataMessage = $queryResult[0]['message'];
            $dataEmail = $queryResult[0]['email'];
            $dataName = $queryResult[0]['first_name'];
            //if the two variables are not empty, then send the email
            if (!empty($dataEmail) && !empty($dataMessage)) {
                $email = new \SendGrid\Mail\Mail(); 
                $email->setFrom("northumbriadissertation2023@gmail.com", "Charity Shop");
                $email->setSubject("Someone wants to thank you");
                $email->addTo($dataEmail, "name");
                $emailBody = <<<EOF
                <html>
                <head>
                  <style>
                    /* Add your CSS styles here */
                    body {
                      font-family: Arial, sans-serif;
                      font-size: 16px;
                      line-height: 1.5;
                      margin: 0;
                      padding: 0;
                      background-color: #f2f2f2;
                    }
                    .container {
                      width: 80%;
                      max-width: 600px;
                      margin: 20px auto;
                      background-color: #ffffff;
                      border-radius: 5px;
                      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                      background-color: #3f51b5;
                      color: #ffffff;
                      border-top-left-radius: 5px;
                      border-top-right-radius: 5px;
                      padding: 20px;
                    }
                    .header h1 {
                      margin: 0;
                      font-size: 28px;
                      font-weight: 400;
                      text-align: center;
                    }
                    .content {
                      padding: 20px;
                      text-align: center;
                    }
                    .content h2 {
                      margin-top: 0;
                      font-size: 24px;
                      font-weight: 400;
                      color: #3f51b5;
                    }
                    .content p {
                      margin: 0;
                      font-size: 16px;
                      color: #333333;
                    }
                    .content .cta {
                      margin-top: 20px;
                      text-align: center;
                    }
                    .content .cta a {
                      display: inline-block;
                      padding: 10px 20px;
                      background-color: #3f51b5;
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 5px;
                      transition: background-color 0.2s ease-in-out;
                    }
                    .content .cta a:hover {
                      background-color: #2c3e50;
                    }
                  </style>
                </head>
                <body>
                  <div class='container'>
                    <div class='header'>
                      <h1>Someone wants to thank you</h1>
                    </div>
                    <div class='content'>
                      <h2>Hi, $dataName!</h2>
                      <p>You received the following message:</p>
                      <br></br>
                      <p class='message'>$dataMessage</p>
                      <br></br>
                      <p>Think something is wrong? Press on the button below and make sure to include this reference number: <strong>#$dataMessageID</strong></p>
                      <div class='cta'>
                        <a href='mailto:northumbriadissertation2023@gmail.com?subject=Reference%20number%20#$dataMessageID'>Reply to this message</a>
                      </div>
                    </div>
                  </div>
                </body>
              </html>
EOF;
                $email->addContent("text/html", $emailBody);
                $sendgrid = new \SendGrid(SENDGRID_API_KEY);
                try {
                    $response = $sendgrid->send($email);
                    var_dump($response);
                } catch (Exception $e) {
                    echo 'Caught exception: ',  $e->getMessage(), "\n";
                }
            } else {
                echo "Data is empty";
            }
        } else {
            echo "No data found for message_id";
        }
    }
}

 protected function initialiseSQL() {
        $status_ids = ["pending"=>"pending","approved"=>"approved", "dismissed"=>"dismissed"];

        $status_id =$status_ids[strtolower($_POST['status'])];

        date_default_timezone_set('Europe/London');
        $t = time();
        $_POST[$date = date('Y-m-d H:i:s', $t)] ;
       
        $sql = "UPDATE messages SET status = :status, updated_at = :date, updated_by = :updated_by WHERE message_id = :message_id";
        $this->setSQL($sql);
        $this->setSQLParams(['status'=> $status_id, 'date' => $date, 'updated_by'=>$_POST['updated_by'], 'message_id'=>$_POST['message_id']]);
      }

}