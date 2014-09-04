<?php

class BaseModel {
	public $id;
	public $page;
	public $auth;
	public $vi;
	public $limit;
	
	public function __construct() {
		$this->id = null;
		$this->page = 1;
		$this->vi = 'default';
		$this->limit = 20;
	}
	
	public function setId($id = null) {
		if($id !== null && is_int($id))
			return $this->id = $id;
		
		return false;
			
	}
	
	public function getId() {
		return $this->id;
	}

}

?>