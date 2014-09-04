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

class BaseView {
	
	public $viewModel;
	public $appCore;

	function __construct($viewModel, appCore $appCore) {
		$this->viewModel = $viewModel;
		$this->appCore = $appCore;
	}

}


class BaseViewModel {
	
	public $model;

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