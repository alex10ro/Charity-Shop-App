<?php 
 
/** 
 * Delete messages after 1 year script
 * 
 * Script that runs via a cronJob on the server
 * 
 * @author Cristian Mitoi
 */


 class Delete extends Endpoint 
 {
 
     public function __construct()
     {
 
         $db = new Database("db/data.sqlite");
         $this->initialiseSQL();
         $queryResult = $db->executeSQL($this->getSQL(), $this->getSQLParams());
 
         $this->setData( array(
             "length" => 0,
             "message" => "succes",
             "data" => null
         ));
     }
 

  protected function initialiseSQL() {
    date_default_timezone_set('Europe/London');
       
    $currentTime = time();
    $oneYearAgo = strtotime('-1 year', $currentTime);
    $sql = "DELETE FROM MESSAGES WHERE created_at < :one_year_ago";
         $params=array(':one_year_ago' => date('Y-m-d H:i:s', $oneYearAgo));

         $this->setSQL($sql);
         $this->setSQLParams($params);
       }
 
 }

