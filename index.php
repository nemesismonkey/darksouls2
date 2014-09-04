<?php
	session_cache_limiter('private_no_expire');
	session_start();
	
	/*
	 *  This page serves as the host router.  It contains most of the environment variables for the site to run
	 *  Every page request that does not point directly to a file gets redirected here.
	 *  
	 */
	 
	/*define('FOLDER_BASE','darksouls-v4'); //Dev Server
	define('SUB_DOMAIN','');
	define('REL_DOMAIN' , 'mugenmonkey.com');*/
	
	define('FOLDER_BASE','darksoulsii/dks2'); //Local Machine
	define('SUB_DOMAIN','');
	define('REL_DOMAIN' , '145.89.7.121');
	
	define('HTTP',(isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on" ? "https://" : "http://"));
	
	define('REL_PATH', HTTP . SUB_DOMAIN . REL_DOMAIN . '/' . FOLDER_BASE . (strlen(FOLDER_BASE) > 0 ? '/' : ''));
	define('CHAR_SET','utf-8');
	define('CACHE',false);
	ini_set('session.cookie_domain', '.' . REL_DOMAIN);
	date_default_timezone_set('America/New_York');
	
	spl_autoload_extensions('.class.php');
	function splreg ($class) {
		@include(dirname(__FILE__) . '/' . 'app/classes/' . $class . '.class.php');
	}
	spl_autoload_register('splreg');
	
	require_once('router/router.php');
	require_once('app/base/BaseController.php');
	require_once('app/base/BaseMVC.php');
	require_once('app/appCore.php');
	
	$app = new appCore;
							
	$r = new Router;
	$filter =  Array('/.php/');
	if(FOLDER_BASE != '')
		$filter[1] = '/' . FOLDER_BASE;
	$r->uri_filter = $filter;
	
	
	$r->map('/', array('controller' => 'home', 'cache'=>1));
	$r->map('/build/:buildhash', array('controller' => 'home', 'cache'=>1), array('buildhash' => '[A-Za-z0-9\+\%\=]+'));
	
	 
	$r->execute();
	if(!$r->route_found){
	
		$app->push_error_page('404.php','404 Not Found');
		
		exit();
	}


	unset($r->routes);

	$controllerURI = 'app/controllers/' . $r->controller_name . 'Controller.php';

	$modelURI = 'app/viewModels/' . $r->controller_name . 'Vm.php';

	

	try {
	if(is_file($controllerURI)){
		if((@include $controllerURI) === false)
			throw new Exception('<p>Failed to include Controller '.$r->controller_name.'.</p>');
			
		if(is_file($modelURI)) {
			if((@include  $modelURI) === false)
				throw new Exception('<p>Failed to include View/Model '.$r->controller_name.'</p>');

			$app->controller = $r->controller;
			$app->controller_name = $r->controller_name;
			$app->action = $r->action;
			$app->id = $r->id;
			$app->params = $r->params;
			
			$mname = $r->controller_name . 'Model';
			$vmname = $r->controller_name . 'ViewModel';
			$vname = $r->controller_name . 'View';
			$cname = $r->controller_name . 'Controller';
			
			
			$model = new $mname;
			$viewModel = new $vmname($model);
			$view = new $vname($viewModel,$app);
			$controller = new $cname($model, $viewModel, $app);
			
			$controller->{'__'.$cname}();

			if (isset($r->action)) $controller->{$r->action}();
			
			try{
				if(isset($app->params['cache']) && $app->cacheEnable){
					
					if(!$app->proccessCache($r->request_uri,'')) {
						$dat = $view->output();
						$app->addToCache($r->request_uri,$dat);
						$app->content = $dat;
					}
				} else
					$app->content = $view->output();
			} catch(Exception $e){
				$app->content = $e->getMessage();
			}
			
		} else {
			$app->content = '<p>View/Model '.$r->controller_name.' is missing.</p>';
		}
	} else {
		$app->content = '<p>Controller '.$r->controller_name.' is missing.</p>';
	}
	} catch(Exception $e){
		$app->content = $e->getMessage();
	}
	
	include($app->template);
?>

