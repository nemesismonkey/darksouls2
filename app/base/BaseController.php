<?php

class BaseController {
	public $model;
	public $viewModel;
	public $appCore;
	
	public function __construct($model, $viewModel, $appCore) {
		$this->model = $model;
		$this->viewModel = $viewModel;
		$this->appCore = $appCore;
		//$this->model->auth = new authModule($appCore);
		$this->model->page = (isset($this->appCore->params['page']) ? $this->appCore->params['page'] : 1);
		$this->model->id = $this->appCore->id;
	}
}

?>