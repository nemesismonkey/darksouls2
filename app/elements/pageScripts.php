<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
  <script>window.jQuery || document.write("<?php echo REL_PATH . 'js/libs/jquery-2.1.0.min.js'; ?>")</script>
	
   <?php echo $app->linkScript('js/plugins'); ?> 
   <?php echo $app->linkScript('js/alphaSelects'); ?> 
   <?php echo $app->linkScript('js/script'); ?>
	<script> var d = new Darksouls("<?php echo REL_PATH; ?>"<?php echo (isset($app->params['buildhash']) ? ',"'.str_replace('%3D%3D%3D%3D','/',urlencode($app->params['buildhash'])).'"' : ',false'); ?>); </script>
  <?php
	echo $app->sinjection;
  ?>
 <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-29538296-1', 'mugenmonkey.com');
  ga('send', 'pageview');

</script>


  <!--[if lt IE 7 ]>
    <script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
    <script>window.attachEvent('onload',function(){CFInstall.check({mode:'overlay'})})</script>
  <![endif]-->