<?php
	class HomeController extends BaseController {
		
		public function __HomeController() {
			
		}
		
		public function index() {
			$this->appCore->homepage = true;
		}

	}
?>