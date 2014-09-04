<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<?php $app->title = 'Darksouls Character Planner v4: Page not found :(';?>
<?php echo $app->get_element($app->pageHeader); ?>
<body>
	<div id="container">
	 <?php echo $app->get_element('bodyHeader'); ?>
	<div class="container">
		<div class="error-container">
			<h1><span class="red">404</span> Not found <span> :(</span></h1>
			<p>Sorry, but the page you were trying to view does not exist.</p>
			<p>It looks like this was the result of either:</p>
			<ul>
			  <li>a mistyped address</li>
			  <li>an out-of-date link</li>
			</ul>
			
			<p><a href="<?php echo REL_PATH; ?>">Return</a></p>
		  </div>
	 </div>
	</div>
  <?php echo $app->get_element('footer'); ?>
  <?php echo $app->get_element($app->scripts); ?>
</body>
</html>