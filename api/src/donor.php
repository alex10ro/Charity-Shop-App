<?php
 
/**
 * Donor endpoint
 * 
 * Extracts donor information from the Database
 * 
 * @author Cristian Mitoi
 */

class Donor extends Endpoint
{
    protected function initialiseSQL() {
        $sql="SELECT donor_id, last_name FROM DONOR";
        $params=array();

    if (filter_has_var(INPUT_GET, 'product_id')) {
        $sql = "SELECT d.donor_id, p.name, p.image FROM DONOR AS d
                 JOIN PRODUCT AS p ON d.donor_id = p.donor_id 
                 WHERE product_id = :product_id ";
        $params['product_id'] = $_GET['product_id'];
        }

$this->setSQL($sql);
$this->setSQLParams($params);
}

}