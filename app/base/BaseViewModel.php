<?php

class BaseViewModel {
	
	protected $model;

	public function __construct($model) {
		$this->model = $model;
	}
	
	public function getId() {
		$id = $this->model->id;
		if($id !== null)
			return (int) $id;
			
		return null;
	}
	public function getVi(){
		return $this->model->vi;
	}
	public function setVi($vi = null){
		$this->model->vi = $vi;
	}
	public function setId($id = null) {
		return $this->model->setId($id);
	}
	public function getPage(){
		return $this->model->page;
	}
	public function getPageLimit(){
		return $this->model->limit;
	}
	public function setPageLimit($limit = 20){
		return $this->model->limit = $limit;
	}
	public function returnAuth(){
		return $this->model->auth;
	}
	public function isAuthed() {
		$auth = $this->model->auth;
		
		$auth->proccessData();
		if($auth->allowUpload)
			$auth->isRealUser(true,appCore::curPageURL());
			
		return $this->model->auth->authenticated;
	}
	public function isLoggedIn(){
		return $this->model->auth->isLoggedIn;
	}
	public function showLogin(){
		if($this->model->auth->isLoggedIn)
		return $this->model->auth->displayName();
	}

}

?>