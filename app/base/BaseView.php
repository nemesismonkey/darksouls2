<?php

class BaseView {
	
	protected $viewModel;
	protected $appCore;

	function __construct($viewModel, appCore $appCore) {
		$this->viewModel = $viewModel;
		$this->appCore = $appCore;
	}
	
	

}

?>