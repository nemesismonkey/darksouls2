<?php

	class HomeModel extends BaseModel {    

	}

	class HomeView extends BaseView {
		
		private $id;
		
		public function output() {
			$str = '<h2 class="hide-on-mobile grid-100 paddinglr-0">Home</h2>';
			
			return $str;
			
		}
	}

	class HomeViewModel extends BaseViewModel {
		
		
	}
?>