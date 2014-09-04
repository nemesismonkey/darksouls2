<?php
	/* *
	 * 
	 * AppCore Class
	 * Contains all base functions for application use
	 * Is passed to all other classes via the Base(app/base/) classes
	 * 
	 * */

	
	class appCore {
		
		//Constants
		const VERSION = 1.00;
		const SALT = 'Xj$f&mGVVK0V2ZBjXP0y-ecJ3QgScCAr9LB-HOf@';
		const EL_PATH = 'app/elements/';
		const VI_PATH = 'app/views/';
		const ER_PATH = 'app/errors/';
		const ST_PATH = 'app/static/';
		const CA_PATH = 'app/cache/';
		const TM_PATH = 'tmp/';
		const CHAR_SET = 'utf8';
		const MAX_UPLOAD_SIZE = 4194304; // 4 Megabytes
		const USER_ASSETS = 'assets/users/';
		
		public $config;
		public $title;
		public $controller;
		public $controller_name;
		public $action;
		public $id;
		public $params;
		public $errors;
		public $defaultModel;
		public $content;
		public $pageHeader;
		public $scripts;
		public $imgroot;
		public $baseurl;
		public $template;
		public $auth;
		public $sinjection;
		public $homepage;
		public $extraContent;
		public $cpage;
		public $timestamp;
		public $cssInjection;
		public $isAjaxRequest;
		
		private $gateCookie;
		
		static $db = Array(
			"host" => 'localhost', //Database Host
			"user" => 'root',      //Database Username
			"pass" => '',          //Database password
			"name" => 'stolicocktails'   //Database name
		);
		
		
		public function __construct($conf = Array()){
			
			$this->title = 'Darksouls 2 Character Planner';
			$this->config = $conf;
			$this->errors = Array();
			
			$this->pageHeader = 'pageHeader';  // Default page header  elements/paheHeader.php
			$this->scripts = 'pageScripts'; // Default scripts element  elements/pageScripts.php
			$this->imgroot = 'imgs/'; 
			$this->timestamp = array('css'=>'02052014','script'=>'02052014');
			$this->template = 'app/templates/index.php';
			
			$this->auth = null;

			$this->cpage = 'home';
			$this->extraContent = '';
			$this->cssInjection = '';
			$this->sinjection = '';
			$this->isAjaxRequest = $this->requestType();
			$this->ip = self::getIp();
			$this->cacheEnable = CACHE;
			$this->cacheTime = 18000;  //5 hours in seconds
			$this->gateCookie = md5('age');
		}
		
		public function get_element($elem = '',$varArray = Array()){
			
			foreach((array) $varArray as $varName => $value){
				$$varName = $value;
			}
			
			$app = $this;
			
			$filename = self::EL_PATH . $elem . '.php';
			
			if (is_file($filename)) {
				ob_start();
				include $filename;
				return ob_get_clean();
			}
			return false;
		}
		
		public function view($view = '',$varArray = Array()){
			
			foreach((array) $varArray as $varName => $value){
				$$varName = $value;
			}
			
			$app = $this;
			
			$filename = self::VI_PATH . $view . '.php';
			
			if (is_file($filename)) {
				ob_start();
				include $filename;
				return ob_get_clean();
			}
			return false;
		}
		
		public function linkStyle($relative_path_to_style_sheet = false,$parameters = false){
			if($relative_path_to_style_sheet) {
					$str = '<link rel="stylesheet" type="text/css" ';
					if($parameters){
						foreach($parameters as $param => $value){
							$str .= $param . '="' . $value . '" ';
						}
					}
					$str .= 'href="' . REL_PATH . $relative_path_to_style_sheet . '.css' . '?' . $this->timestamp['css'] . '">';
					
					return $str;
			}
			return false;
		}
		
		public function linkScript($relative_path_to_script = false){
			if($relative_path_to_script) {
					$str = '<script type="text/javascript" ';
					$str .= 'src="' . REL_PATH . $relative_path_to_script . '.js' . '?' . $this->timestamp['script'] . '"></script>';
					
					return $str;
			}
			return false;
		}

		public function proccessCache($request,$gate = ''){
				$filename = md5($request);
				$filenames = $this->genCacheFiles($filename);
				if(@file_exists($filenames['content']) && @file_exists($filenames['css']) && @file_exists($filenames['js']) && @file_exists($filenames['ex']) && @file_exists($filenames['title'])){
				
					if((filemtime($filenames['content']) + $this->cacheTime) < time()){
						return false;
					}
						$this->content = $gate . file_get_contents($filenames['content']);
						$this->cssinjection = file_get_contents($filenames['css']);
						$this->sinjection = file_get_contents($filenames['js']);
						$this->extraContent = file_get_contents($filenames['ex']);
						$this->title = file_get_contents($filenames['title']);
						
					
					return true;
				}					
				
				return false;
		}
		public function addToCache($request,$data){
			$filename = md5($request);
			$filenames = $this->genCacheFiles($filename);
			
			@file_put_contents($filenames['content'],$data,LOCK_EX);
			@file_put_contents($filenames['css'],$this->cssinjection,LOCK_EX);
			@file_put_contents($filenames['js'],$this->sinjection,LOCK_EX);
			@file_put_contents($filenames['ex'],$this->extraContent,LOCK_EX);
			@file_put_contents($filenames['title'],$this->title,LOCK_EX);
			
			@chmod($filenames['content'],0755);
			@chmod($filenames['css'],0755);
			@chmod($filenames['js'],0755);
			@chmod($filenames['ex'],0755);
			@chmod($filenames['title'],0755);

		}
		private function genCacheFiles($base) {
			return Array('content'=>self::CA_PATH . $base.'.con.cache','css'=>self::CA_PATH . $base.'.css.cache','js'=> self::CA_PATH . $base.'.js.cache','ex'=> self::CA_PATH . $base.'.exa.cache','title'=> self::CA_PATH . $base.'.title.cache');
		}
		public function push_error_page($page,$errorcode) {
			header('HTTP/1.0 '. $errorcode);
			$app = $this;
			$errorc = substr($errorcode,0,3);
			if(is_file(self::ER_PATH . $page) && include(self::ER_PATH . $page)) {
				
			} else
				$this->push_error('404.php','404 Not Found');
			exit();
		}
		
		public function push_error($type = '',$message = ''){
			
			array_push($this->errors, Array('type'=>$type,'message'=>$message));
			
		}
		
		public function pdo_call($query) {
			
			$dbh = null;

			try {
				$dbh = new PDO('mysql:host='.self::$db['host'].';dbname='.self::$db['name'], self::$db['user'], self::$db['pass']);
				$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$dbh->exec('SET CHARACTER SET utf8');
				
				$sth = $dbh->query($query);
				$dbh = null;
				
				if(is_object($sth) && $sth)
					return $sth->fetchAll( PDO::FETCH_OBJ );
					
				else 
					$this->database_error();
					
			} catch (PDOException $e) {
				$this->database_error($e);
				
			}
		}
		public function open_new_pdo() {
			
			$dbh = null;

			try {
				$dbh = new PDO('mysql:host='.self::$db['host'].';dbname='.self::$db['name'], self::$db['user'], self::$db['pass']);
				$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$dbh->exec('SET CHARACTER SET utf8');
				return $dbh;
			} catch (PDOException $e) {
				$this->database_error($e);
				
			}
		}
		public function pdo_update($query) {
			$dbh = null;
			try {
				$dbh = new PDO('mysql:host='.self::$db['host'].';dbname='.self::$db['name'], self::$db['user'], self::$db['pass']);
				$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$dbh->exec('SET CHARACTER SET utf8');
				
				$dbh->exec($query);

				$dbh = null;
			} catch (PDOException $e) {
				$this->database_error($e);
				
			}
		}
		public function database_error($e = ''){
			header('HTTP/1.1 503 Service Temporarily Unavailable');
			header('Status: 503 Service Temporarily Unavailable');
			
			$er = $e->getMessage()."\r\n"."in"."\r\n".$e->getFile()."\r\n"."on line"."\r\n".$e->getLine()."\r\n\r\n";
			ob_start();
			print_r($e);
			$er .= ob_get_clean();
			
			appCore::putFileError('pdo_error.txt',$er);
			$app = $this;
			include(self::ER_PATH . 'dberr.php');
			
			exit();
			
		}
		public function requestType() {
			if(isset($_SERVER['HTTP_X_REQUESTED_WITH']))
			$ajax = ($_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest');
		else
			$ajax = false;
			
			return $ajax;
		}
		public function get_sidebar() {
			$type = $this->sidebar;
			
			return $this->view($type);
		}
		static function getIp(){
			$ip = array($_SERVER['REMOTE_ADDR'],$_SERVER['REMOTE_ADDR']);
			
			if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
				$ip[1] = $_SERVER['HTTP_X_FORWARDED_FOR'];
			
			
			return $ip;
		}
		static function sanitize_url($text) {
			
			$stopwords = array();
			include(self::ST_PATH . 'stopwords.php');
			$text = preg_replace('/[\'\"\`]/u','',$text);
			$text = preg_replace('/[^\\pL\d]+/u', '-', $text); 
			$text = str_replace($stopwords,'-',$text);
			$text = preg_replace('/(-)+/','-',$text);
			$text = trim($text, '-');
			$text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
			$text = strtolower($text);
			$text = preg_replace('/[^-\w]+/', '', $text);

			return $text;
		}
		
		public function return_img_link($fileThumbPath,$filename,$alttext = '',$imgclass = ''){
			return '<a href="'.REL_PATH.$filename.'" target="_blank"><img src="'.REL_PATH.$fileThumbPath.'" alt="' . stripslashes($alttext) . '" '.(!empty($imgclass) ? 'class="'.$imgclass.'"' : '').' /></a>';
		}
		
		static function curPageURL() {
		 $pageURL = 'http';
		 if (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
		 $pageURL .= "://";
		 if (isset($_SERVER["SERVER_PORT"]) && $_SERVER["SERVER_PORT"] != "80") {
		  $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
		 } else {
		  $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
		 }
		 return $pageURL;
		}
		static function returnError($message,$inctags = true){
			return ($inctags ? '<div class="error">'.$message.'</div>' : $message);
		}
		static function writeErrorPath($path = null){
			appCore::putFileError('Path-Error.txt',$path);
		}
		static function putFileError($file,$err){
			file_put_contents('tmp/'.date("Y-m-d--H_i_s").$file,$err,FILE_APPEND);
		}
		static function makeValidString($str) {
			$clear = strip_tags($str,'<p><strong><sup><sub><em><del><ins><mark><s><code>');
			$clear = html_entity_decode($clear);
			$clear = urldecode($clear);
			//$clear = preg_replace('/[^A-Za-z0-9\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\;\:\'\"\,\.\/\\/]/', ' ', $clear);
			$clear = preg_replace('/ +/', ' ', $clear);
			$clear = trim($clear);
			
			return $clear;
		}
		
		static function makeValidText($str,$allowed = '') {
			//$clear = strip_tags($str,$allowed);
			//$clear = html_entity_decode($clear);
			//$clear = urldecode($clear);
			//$clear = preg_replace('/ +/', ' ', $clear);
			//$clear = trim($clear);
			//if($clear == trim($str))
			return $str;
			
			return false;
		}
		
		static function isValidUrl($url) {
			
			$url = trim($url);
			if (filter_var($url, FILTER_VALIDATE_URL, FILTER_FLAG_SCHEME_REQUIRED) && filter_var($url, FILTER_VALIDATE_URL, FILTER_FLAG_HOST_REQUIRED)) return $url;
			
			return null;
		}
		
		
	}
	
?>