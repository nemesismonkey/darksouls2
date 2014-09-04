<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<?php $app->title = 'Darksouls Character Planner v4: Database Error :(';?>
<?php echo $app->get_element($app->pageHeader); ?>
<body>
	<div id="container">
	 <?php echo $app->get_element('bodyHeader'); ?>
	<div class="container">
     <div class="error-container">
		<div style=" max-width: 570px; _width: 570px; margin: 150px auto 0; " class="medium">
			<h1>There was an error with the database<span> :(</span></h1>
			<p>Sorry, but the page you were trying to view seems to have a database error</p>
			<p>This should only be temporary and we have been notified of the issue</p>
			
			<p><a href="<?php echo REL_PATH; ?>">Return</a></p>
		  </div>
	 </div>
	</div>
  <?php echo $app->get_element('footer'); ?>
  <?php echo $app->get_element($app->scripts); ?>
</body>
</html>