
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

  <title><?php echo $app->title; ?></title>
  <meta name="description" content="">
  <meta name="author" content="">
  <link rel="apple-touch-icon-precomposed" sizes="57x57" href="apple-icon-57x57-precomposed.png" />
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="apple-icon-72x72-precomposed.png" />
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="apple-icon-114x114-precomposed.png" />
  <link rel="apple-touch-icon-precomposed" sizes="144x144" href="apple-icon-144x144-precomposed.png" />
  <meta name="viewport" content="width=device-width,initial-scale=0.8715">

  <?php echo $app->linkStyle('css/style'); ?>
  <?php echo $app->linkStyle('css/alphaSelects'); ?>
 
  <link href='http://fonts.googleapis.com/css?family=Roboto:400,300,700,900' rel='stylesheet' type='text/css'>
  <?php echo $app->cssInjection; ?>

  <script src="<?php echo REL_PATH; ?>js/libs/modernizr-2.7.1.min.js"></script>
</head>