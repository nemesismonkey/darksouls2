<?php	
	if($app->isAjaxRequest) {
		echo $app->content;
	} else {
?>
<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]--> <!--  manifest="index.appcache" -->
<?php echo $app->get_element($app->pageHeader); ?>

<body>
<div id="loader">
	<img src="<?php echo REL_PATH; ?>imgs/loader.gif" />
	<p>Loading...</p>
</div>

  <div id="container" class="mobile-grid-container">
	<?php echo $app->get_element('bodyHeader'); ?>
		<?php 
			
			//echo $app->content;
		
			//echo $app->extraContent;
			
			//echo $app->get_element('footer');
		?>
	<div class="container">
		
		<div class="container c-header">
			<div class="player-tab base active" data-index="0">
				<div><div class="player-icon light"></div> Base</div>
			</div>
			<div class="player-tab tab t1 hidden" data-index="1">
				<div><div class="player-icon dark"></div><div class="player-icon player-remove"></div> - 1</div>
			</div>
			
			<div class="player-tab tab t2 hidden" data-index="2">
				<div><div class="player-icon dark"></div><div class="player-icon player-remove"></div> - 2</div>
			</div>
			
			
			<div class="player-tab end">
				<div><div class="player-icon add"></div></div>
			</div>
			
			<div class="player-options float-right">
				<div>
					SETTINGS
				</div>
				<div>
					ARMOR OPTIMIZER
				</div>

			</div>
			
		</div>
		<form>
		<div class="container c-body clearfix">
			<div class="grid-33">
				<div class="clearfix stat-box tall"><label for="classname"><img class="stat-icons cls" src="<?php echo REL_PATH; ?>imgs/_t.png"> Starting Class</label>  <select id="classname" class="float-right"></select>
					<div id="bestclass">
						<span id="class-name"></span>
						<span id="class-lvl" class="float-right"></span>
					</div>
				</div>
				<hr />
				<div class="clearfix stat-box">
					<label for="slv" class="no-click"><img class="stat-icons slv" src="<?php echo REL_PATH; ?>imgs/_t.png"> Soul Level</label> <input type="text"  class="fixed black bold" id="slv" maxlength="3" readonly /> <input type="text"  class="fixed" readonly />
					<div id="revert"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons" title="Revert" /></div>
				</div>
				
				
				<div class="clearfix stat-box"><label for="vig"><img class="stat-icons vig" src="<?php echo REL_PATH; ?>imgs/_t.png"> Vigor</label><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow up" data-for="vig" /> <img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow down" data-for="vig" /> <input type="text"  class="editable bold" id="vig" maxlength="2" data-for="vig" tabindex="1" /> <input type="text"  class="fixed" readonly /> </div>
				<div class="clearfix stat-box"><label for="end"><img class="stat-icons end" src="<?php echo REL_PATH; ?>imgs/_t.png"> Endurance</label><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow up" data-for="end" /> <img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow down" data-for="end" /> <input type="text"  class="editable bold" id="end" maxlength="2" data-for="end" tabindex="2" /> <input type="text"  class="fixed" readonly /></div>
				<div class="clearfix stat-box"><label for="vit"><img class="stat-icons vit" src="<?php echo REL_PATH; ?>imgs/_t.png"> Vitality</label><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow up" data-for="vit" /> <img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow down" data-for="vit" /> <input type="text"  class="editable bold" id="vit" maxlength="2" data-for="vit" tabindex="3" /> <input type="text"  class="fixed" readonly /></div>
				<div class="clearfix stat-box"><label for="att"><img class="stat-icons att" src="<?php echo REL_PATH; ?>imgs/_t.png"> Attunement</label><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow up" data-for="att" /> <img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow down" data-for="att" /> <input type="text"  class="editable bold" id="att" maxlength="2" data-for="att" tabindex="4" /> <input type="text"  class="fixed" readonly /></div>
				<div class="clearfix stat-box"><label for="str"><img class="stat-icons str" src="<?php echo REL_PATH; ?>imgs/_t.png"> Strength</label><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow up" data-for="str" /> <img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow down" data-for="str" /> <input type="text"  class="editable bold" id="str" maxlength="2" data-for="str" tabindex="5" /> <input type="text"  class="fixed" readonly /></div>
				<div class="clearfix stat-box"><label for="dex"><img class="stat-icons dex" src="<?php echo REL_PATH; ?>imgs/_t.png"> Dexterity</label><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow up" data-for="dex" /> <img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow down" data-for="dex" /> <input type="text"  class="editable bold" id="dex" maxlength="2" data-for="dex" tabindex="6" /> <input type="text"  class="fixed" readonly /></div>
				<div class="clearfix stat-box"><label for="adp"><img class="stat-icons adp" src="<?php echo REL_PATH; ?>imgs/_t.png"> Adaptability</label><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow up" data-for="adp" /> <img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow down" data-for="adp" /> <input type="text"  class="editable bold" id="adp" maxlength="2" data-for="adp" tabindex="7" /> <input type="text"  class="fixed" readonly /></div>
				<div class="clearfix stat-box"><label for="nnt"><img class="stat-icons nnt" src="<?php echo REL_PATH; ?>imgs/_t.png"> Intelligence</label><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow up" data-for="nnt" /> <img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow down" data-for="nnt" /> <input type="text"  class="editable bold" id="nnt" maxlength="2" data-for="nnt" tabindex="8" /> <input type="text"  class="fixed" readonly /></div>
				<div class="clearfix stat-box"><label for="fai"><img class="stat-icons fai" src="<?php echo REL_PATH; ?>imgs/_t.png"> Faith</label><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow up" data-for="fai" /> <img src="<?php echo REL_PATH; ?>imgs/_t.png" class="arrow down" data-for="fai" /> <input type="text"  class="editable bold" id="fai" maxlength="2" data-for="fai" tabindex="9" /> <input type="text"  class="fixed" readonly /></div>
				
				<hr />
				<div class="align-center clearfix">
				<div class="grid-50 mobile-grid-50 small faded">Souls to next Level</div> <div class="grid-50 mobile-grid-50 small faded">Total Soul Cost</div>
				<div class="grid-50 mobile-grid-50"><input type="text"  class="fixed bigger black bold" id="csc" readonly /></div>
				<div class="grid-50 mobile-grid-50"><input type="text"  class="fixed bigger black bold" id="tsc" readonly /></div>
				</div>
				<hr />
				<div class="clearfix stat-box tall"><label for="covenant">Covenant</label>  <select id="covenant" class="float-right"></select></div>
				<hr />
				<div class="clearfix stat-box hidden">
					<img src="<?php echo REL_PATH; ?>imgs/_t.png" class="status-icons item" />
					<img src="<?php echo REL_PATH; ?>imgs/_t.png" class="status-icons item" />
					<img src="<?php echo REL_PATH; ?>imgs/_t.png" class="status-icons item" />
					<img src="<?php echo REL_PATH; ?>imgs/_t.png" class="status-icons item" />
				</div>
				<div class="clearfix" id="spell-c">
					<div class="clearfix stat-box taller">
						<!--Spells, Magic & Pyromancies-->
						<img src="<?php echo REL_PATH; ?>imgs/_t.png" class="spell-header" />
					</div>
					<div class="grid-50 mobile-grid-50">
						<select class="spells" data-index="0">
							
						</select>
						
					</div>
					<div class="grid-50 mobile-grid-50 align-right">
						<select class="spells" data-index="1">
							
						</select>
					</div>
					<div class="grid-50 mobile-grid-50">
						<select class="spells" data-index="2">
							
						</select>
					</div>
					<div class="grid-50 mobile-grid-50 align-right">
						<select class="spells" data-index="3">
							
						</select>
					</div>
					<div class="grid-50 mobile-grid-50">
						<select class="spells" data-index="4">
							
						</select>
					</div>
					<div class="grid-50 mobile-grid-50 align-right">
						<select class="spells" data-index="5">
							
						</select>
					</div>
					<div class="grid-50 mobile-grid-50">
						<select class="spells" data-index="6">
							
						</select>
					</div>
					<div class="grid-50 mobile-grid-50 align-right">
						<select class="spells" data-index="7">
							
						</select>
					</div>
					<div class="grid-50 mobile-grid-50">
						<select class="spells" data-index="8">
							
						</select>
					</div>
					<div class="grid-50 mobile-grid-50 align-right">
						<select class="spells" data-index="9">
							
						</select>
					</div>
					<div class="grid-50 mobile-grid-50">
						<select class="spells" data-index="10">
							
						</select>
					</div>
					<div class="grid-50 mobile-grid-50 align-right">
						<select class="spells" data-index="11">
							
						</select>
					</div>
				</div>
				<hr class="hide-on-desktop" id="tester" />
			</div>
			
			<div class="grid-33">
				
				<div class="clearfix stat-box"><label for="hp"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons hp" /> HP</label> <input type="text" class="fixed big bold" id="hp" readonly /></div>
				<div class="clearfix stat-box"><label for="stam"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons stam" /> Stamina</label> <input type="text" class="fixed big bold" id="stam" readonly /></div>
				<div class="mini align-right faded hidden">
					<span class="">Stamina Regen</span> <span class="faded"><span id="stamin">45.0</span>/sec (<span id="stamtime">2.1</span> seconds to fill)</span>
				</div>
				<div class="clearfix stat-box"><label for="eqp"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons eqp" /> Equip Load</label> <input type="text" class="fixed big bold" id="eqp" readonly /></div>
				<div class="mini align-right faded">
					Using <span id="eper"></span>% | <span id="ewig"></span> Weight left <span class="hidden">| <span id="eroll"></span></span>
				</div>
				<div class="clearfix stat-box"><label for="poise"><img class="stat-icons poise" src="<?php echo REL_PATH; ?>imgs/_t.png"> Poise</label> <input type="text" class="fixed big bold" id="poise" readonly /></div>
				<div class="clearfix stat-box"><label for="slots"><img class="stat-icons slots" src="<?php echo REL_PATH; ?>imgs/_t.png"> Attunement Slots</label> <input type="text" class="fixed big bold" id="slots" readonly /></div>
				<hr />
			
				<div class="clearfix stat-box tall"><label for="armor-h"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons arm" /> Head</label>  <select id="armor-h" class="float-right"></select></div>
				<div class="clearfix stat-box tall"><label for="armor-c"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons arm" /> Chest</label>  <select id="armor-c" class="float-right"></select></div>
				<div class="clearfix stat-box tall"><label for="armor-a"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons arm" /> Hands</label>  <select id="armor-a" class="float-right"></select></div>
				<div class="clearfix stat-box tall"><label for="armor-l"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons arm" /> Legs</label>  <select id="armor-l" class="float-right"></select></div>
				
				
				<hr />
				<!--<div class="clearfix bold small">
					Special Items
				</div>
				<div class="clearfix">
					<div class="grid-33 small xfaded">
						<img src="<?php echo REL_PATH; ?>imgs/_t.png" class="specail-icons dh" /><br/>
						Dragon Head
					</div>
					<div class="grid-33 small xfaded">
						<img src="<?php echo REL_PATH; ?>imgs/_t.png" class="specail-icons db" /><br/>
						Dragon Body
					</div>
					<div class="grid-33 small xfaded">
						<img src="<?php echo REL_PATH; ?>imgs/_t.png" class="specail-icons eg" /><br/>
						Egg Head
					</div>
				</div>-->
				
				<div class="clearfix weapon-container">
				
					<div class="grid-50">
						<div class="stat-box clearfix">
							<div><label for="weapon-left-1"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons lh1" /></label> <img src="<?php echo REL_PATH; ?>imgs/_t.png" class="path-icons nor" /> </div>
							<div>(<span style="color:#b38f64;">20</span>/<span style="color:#2b7cb5;">0</span>/<span style="color:#b52b2b;">0</span>/<span style="color:#b59d2b;">0</span>) 20</div>
							<div><select id="weapon-left-1"></select></div>
						</div>
					</div>
					
					<div class="grid-50">
						<div class="stat-box clearfix">
							 <div><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="path-icons nor" /> <label for="weapon-right-1"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons rh1" /></label></div>
							 <div>20 (<span style="color:#b38f64;">20</span>/<span style="color:#2b7cb5;">0</span>/<span style="color:#b52b2b;">0</span>/<span style="color:#b59d2b;">0</span>)</div>
							 <div><select id="weapon-right-1"></select></div>
						</div>
					</div>
				</div>
				<div class="clearfix weapon-container">
				
					<div class="grid-50">
						<div class="stat-box clearfix">
							<div><label for="weapon-left-2"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons lh2" /></label> <img src="<?php echo REL_PATH; ?>imgs/_t.png" class="path-icons nor" /></div>
							<div>(<span style="color:#b38f64;">20</span>/<span style="color:#2b7cb5;">0</span>/<span style="color:#b52b2b;">0</span>/<span style="color:#b59d2b;">0</span>) 20</div>
							<div><select id="weapon-left-2"></select></div>
						</div>
					</div>
					
					<div class="grid-50">
						<div class="stat-box clearfix">
							<div><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="path-icons nor" />  <label for="weapon-right-2"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons rh2" /></label></div>
							<div>20 (<span style="color:#b38f64;">20</span>/<span style="color:#2b7cb5;">0</span>/<span style="color:#b52b2b;">0</span>/<span style="color:#b59d2b;">0</span>)</div>
							<div><select id="weapon-right-2"></select></div> 
						</div>
					</div>
					
				</div>
				<div class="clearfix weapon-container">
				
					<div class="grid-50">
						<div class="stat-box clearfix">
							<div><label for="weapon-left-3"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons lh3" /></label> <img src="<?php echo REL_PATH; ?>imgs/_t.png" class="path-icons nor" /></div>
							<div>(<span style="color:#b38f64;">20</span>/<span style="color:#2b7cb5;">0</span>/<span style="color:#b52b2b;">0</span>/<span style="color:#b59d2b;">0</span>) 20</div>
							<div><select id="weapon-left-3"></select></div>
						</div>
					</div>
					
					<div class="grid-50">
						<div class="stat-box clearfix">
							<div><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="path-icons nor" />  <label for="weapon-right-3"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons rh3" /></label></div>
							<div>20 (<span style="color:#b38f64;">20</span>/<span style="color:#2b7cb5;">0</span>/<span style="color:#b52b2b;">0</span>/<span style="color:#b59d2b;">0</span>)</div>
							<div><select id="weapon-right-3"></select></div> 
						</div>
					</div>
					
				</div>
				<hr />
				<div class="bold" id="hand-2">
					<input val="1" id="hwep2" type="checkbox"> <label for="hwep2" class="small">2 Hand Weapons</label> 
				</div>
				<div class="clearfix stat-box"><label for="rings"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons rin" /> Rings</label> </div>
				<div class="clearfix stat-box tall"> <select id="ring1" data-rindid="0" class="float-left ring"></select> <select id="ring2" data-rindid="1" class="float-right ring"></select></div>
				<div class="clearfix stat-box tall"> <select id="ring3" data-rindid="2" class="float-left ring"></select> <select id="ring4" data-rindid="3" class="float-right ring"></select></div>
			</div>
			
			<div class="grid-33">
				
				
				<div class="clearfix stat-box"><label for="casts"><img class="stat-icons casts" src="<?php echo REL_PATH; ?>imgs/_t.png"> Cast Speed</label> <input type="text" class="fixed big bold" id="casts" readonly /></div>
				<div class="clearfix stat-box"><label for="agility"><img class="stat-icons agility" src="<?php echo REL_PATH; ?>imgs/_t.png"> Agility</label> <input type="text" class="fixed big bold" id="agility" readonly /></div>
				<hr />
				<div class="clearfix stat-box"><label for="atkstr"><img class="stat-icons atkstr" src="<?php echo REL_PATH; ?>imgs/_t.png"> Attack: Strength</label> <input type="text" class="fixed big bold" id="atkstr" readonly /></div>
				<div class="clearfix stat-box"><label for="atkdex"><img class="stat-icons atkdex" src="<?php echo REL_PATH; ?>imgs/_t.png"> Attack: Dex</label> <input type="text" class="fixed big bold" id="atkdex" readonly /></div>
				<div class="clearfix stat-box"><label for="magicbns"><img class="stat-icons magicbns" src="<?php echo REL_PATH; ?>imgs/_t.png"> Magic Bonus</label> <input type="text" class="fixed big bold" id="magicbns" readonly /></div>
				<div class="clearfix stat-box"><label for="firebns"><img class="stat-icons firebns" src="<?php echo REL_PATH; ?>imgs/_t.png"> Fire Bonus</label> <input type="text" class="fixed big bold" id="firebns" readonly /></div>
				<div class="clearfix stat-box"><label for="ligbns"><img class="stat-icons ligbns" src="<?php echo REL_PATH; ?>imgs/_t.png"> Lightning Bonus</label> <input type="text" class="fixed big bold" id="ligbns" readonly /></div>
				<div class="clearfix stat-box"><label for="darbns"><img class="stat-icons darbns" src="<?php echo REL_PATH; ?>imgs/_t.png"> Dark Bonus</label> <input type="text" class="fixed big bold" id="darbns" readonly /></div>
				<div class="clearfix stat-box"><label for="poisionbns"><img class="stat-icons poisonbns" src="<?php echo REL_PATH; ?>imgs/_t.png"> Poison Bonus</label> <input type="text" class="fixed big bold" id="poisonbns" readonly /></div>
				<div class="clearfix stat-box"><label for="bleedbns"><img class="stat-icons bleedbns" src="<?php echo REL_PATH; ?>imgs/_t.png"> Bleed Bonus</label> <input type="text" class="fixed big bold" id="bleedbns" readonly /></div>
				
				
				<hr />
				<div class="clearfix stat-box"><label for="phy-def"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons def" /> Physical Defence</label> <input type="text" class="fixed big bold" id="phy-def" readonly /></div>
				<div class="clearfix stat-box"><label for="phy-sti" class="shift-left-10"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons sti" /> VS Strike</label> <input type="text" class="fixed big bold" id="phy-sti" readonly /></div>
				<div class="clearfix stat-box"><label for="phy-sla" class="shift-left-10"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons sla" /> VS Slash</label> <input type="text" class="fixed big bold" id="phy-sla" readonly /></div>
				<div class="clearfix stat-box"><label for="phy-pie" class="shift-left-10"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons pie" /> VS Pierce</label> <input type="text" class="fixed big bold" id="phy-pie" readonly /></div>
				
				<div class="clearfix stat-box"><label for="mag-def"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons mag" /> Magic Defence</label> <input type="text" class="fixed big bold" id="mag-def" readonly /></div>
				<div class="clearfix stat-box"><label for="fla-def"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons fla" /> Fire Defence</label> <input type="text" class="fixed big bold" id="fla-def" readonly /></div>
				<div class="clearfix stat-box"><label for="lig-def"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons lig" /> Lighting Defence</label> <input type="text" class="fixed big bold" id="lig-def" readonly /></div>
				<div class="clearfix stat-box"><label for="dar-def"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons dar" /> Dark Defence</label> <input type="text" class="fixed big bold" id="dar-def" readonly /></div>
				<hr />
				<div class="clearfix stat-box"><label for="bleed"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons bleed" /> Bleed Resistance</label> <input type="text" class="fixed big bold" id="bleed" readonly /></div>
				<div class="clearfix stat-box"><label for="poison"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons poison" /> Poison Resistance</label> <input type="text" class="fixed big bold" id="poison" readonly /></div>
				<div class="clearfix stat-box"><label for="petrify"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons petrify" /> Petrify Resistance</label> <input type="text" class="fixed big bold" id="petrify" readonly /></div>
				<div class="clearfix stat-box"><label for="curse"><img src="<?php echo REL_PATH; ?>imgs/_t.png" class="stat-icons curse" /> Curse Resistance</label> <input type="text" class="fixed big bold" id="curse" readonly /></div>
			</div>
			
		</div>
		<div class="container c-spells clearfix hidden">
			<div class="grid-33 mobile-grid-100" id="status-effects-box">
				
			</div>
			<div class="grid-66 mobile-grid-100">
			
			</div>
		
		</div>
		<div class="container c-items clearfix align-center">
			<div class="grid-20 mobile-grid-50">
				<select class="s-items" data-index="0">
					
				</select>
			</div>
			<div class="grid-20 mobile-grid-50">
				<select class="s-items" data-index="1">
					
				</select>
			</div>
			<div class="grid-20 mobile-grid-50">
				<select class="s-items" data-index="2">
					
				</select>
			</div>
			<div class="grid-20 mobile-grid-50">
				<select class="s-items" data-index="3">
					
				</select>
			</div>
			<div class="grid-20 mobile-grid-100">
				<select class="s-items" data-index="4">
					
				</select>
			</div>
		</div>
		<div class="container c-footer clearfix">
			<div class="grid-15 mobile-grid-33 stat-box">
				<div class="oth-links">
					MINI LINK
				</div>
			</div>
			<div class="grid-70 mobile-grid-33 relati align-center">
				<div class="shr-link" id="shr-link"> SHARE LINK </div><div class="shr-inp"><input type="text" id="link64" readonly /></div>
				<div id="text-copied"> <span class="hide-on-mobile">Share link successfully copied to clipboard</span> <span class="hide-on-desktop">Coppied!</span> </div>
			</div>
			<div class="grid-15 mobile-grid-33 push-70 stat-box align-right">
				<div class="float-right">
					<div class="oth-links">
					SAVE
				</div></div>
			</div>
		</div>
		</form>
		
		
	</div>
  </div> <!--! end of #container -->

  <?php echo $app->get_element($app->scripts); ?>
</body>
</html>
<!-- <script>
var cacheStatusValues = [];
cacheStatusValues[0] = 'uncached';
cacheStatusValues[1] = 'idle';
cacheStatusValues[2] = 'checking';
cacheStatusValues[3] = 'downloading';
cacheStatusValues[4] = 'updateready';
cacheStatusValues[5] = 'obsolete';

var cache = window.applicationCache;
cache.addEventListener('cached', logEvent, false);
cache.addEventListener('checking', logEvent, false);
cache.addEventListener('downloading', logEvent, false);
cache.addEventListener('error', logEvent, false);
cache.addEventListener('noupdate', logEvent, false);
cache.addEventListener('obsolete', logEvent, false);
cache.addEventListener('progress', logEvent, false);
cache.addEventListener('updateready', logEvent, false);

function logEvent(e) {
    var online, status, type, message;
    online = (navigator.onLine) ? 'yes' : 'no';
    status = cacheStatusValues[cache.status];
    type = e.type;
    message = 'online: ' + online;
    message+= ', event: ' + type;
    message+= ', status: ' + status;
    if (type == 'error' && navigator.onLine) {
        message+= ' (prolly a syntax error in manifest)';
    }
    console.log(message);
}

window.applicationCache.addEventListener(
    'updateready', 
    function(){
        window.applicationCache.swapCache();
        console.log('swap cache has been called');
    }, 
    false
);

setInterval(function(){cache.update()}, 10000);
</script> -->
<?php } ?>