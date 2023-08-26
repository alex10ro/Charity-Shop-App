<?php

/** 
 * Receive Message
 * 
 * Receive a string message via text box 
 * 
 * @author Cristian Mitoi
 */

class Receive extends Endpoint 
{

    public function __construct()
    {
        $this->validateRequestMethod("POST");
        $this->validateMessageParams();
        $this->validateDonorParams();

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

   private function validateMessageParams() {
    // Check to see if a valid message is supplied 
   $message = $_POST['message'];
   if (ctype_space($message) || $message == '') {
    throw new ClientErrorException("invalid message", 400);
  }
 }

 private function validateDonorParams() {
  // Check to see if a valid donor is supplied 
 $donor = $_POST['donor'];
 if (!ctype_digit($donor)) {
  throw new ClientErrorException("invalid donor", 400);
}
}


 protected function initialiseSQL() {

    $message_id = $_POST['message'];
    $donor_id = $_POST['donor'];
      
        $sql = "INSERT INTO MESSAGES (message, donor_id) VALUES (:message, :donor)";
        $this->setSQL($sql);
        $this->setSQLParams(['message'=> $message_id, 'donor'=> $donor_id]);
      }

}