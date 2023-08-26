<?php 
 
/** 
 * Messages Endpoint
 * 
 * Extracts Messages from the Database
 * 
 * @author Cristian Mitoi
 */


class Message extends Endpoint
{
    protected function initialiseSQL() {
        $sql="SELECT message_id, donor_id, message, status, created_at, updated_at, updated_by FROM MESSAGES";
        $params=array();

$this->setSQL($sql);
$this->setSQLParams($params);

}
 
}
 

