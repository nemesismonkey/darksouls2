/* Author: 

*/

/*
 *  Darksouls Character Planner Engine
 *
 */
function Darksouls(baseUrl,buildHash){
	var t = this;
	t.baseURL = baseUrl;
	t.buildHash = (buildHash === false ? false : buildHash);
	
	this.currentVariation = 0;
	this.characterTotals = [{}];
	this.intHolder;
	this.timHolder;
	this.selectedClass = {
		clss: 0,
		change : function(num) {
			this.clss = (typeof num === 'number' && num < t.classes.length && num > 0 ? num : this.clss);
		}
	};
	this.activeArmor = [[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	this.activeArmUpgrade = [[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	this.activeWeapons = [[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	this.activeWepPaths = [[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	this.activeWepUpgrade = [[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	
	this.activeItems = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
	this.activeSpells = [[],[],[]];
	this.activeRings = [[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	
	
	this.options = {
		alphaSelects: true,
		runalphaSelects: false
	}
	
	var loader = function(file) {
		var json;
		$.ajax({
			'async': false,
			'global': false,
			'url': t.baseURL + file,
			'dataType': "json",
			'success': function (data) {
				json = data;
			}
		});
		return json;
	}
	this.armorData = loader('js/armorData.json');
	this.weaponData = loader('js/weaponData.json');
	this.miscData = loader('js/miscData.json');
	
	this.ringData = this.miscData.rings;
	this.itemData = this.miscData.items;
	this.spellData = this.miscData.spells;

	// ===== Class Data =====================
	
	this.classes = (function(d,undefined){
		var cldata = [
			{
				name: 'Warrior' ,
				stats : [12,7,6,6,5,15,11,5,5,5]
			},{
				name: 'Knight' ,
				stats : [13,12,6,7,4,11,8,9,3,6]
			},{
				name: 'Swordsman' ,
				stats : [12,4,8,4,6,9,16,6,7,5]
			},{
				name: 'Bandit' ,
				stats : [11,9,7,11,2,9,14,3,1,8]
			},{
				name: 'Cleric' ,
				stats : [14,10,3,8,10,11,5,4,4,12]
			},{
				name: 'Sorcerer' ,
				stats : [11,5,6,5,12,3,7,8,14,4]
			},{
				name: 'Explorer' ,
				stats : [10,7,6,9,7,6,6,12,5,5]
			},{
				name: 'Deprived' ,
				stats : [1,6,6,6,6,6,6,6,6,6]
			}];
			
			var st = [];
			for(var i = 0,len = cldata.length;i<len;i++){
				st[i] = {
					'name': cldata[i].name,
					'lev': cldata[i].stats[0],
					'vig': cldata[i].stats[1],
					'end': cldata[i].stats[2],
					'vit': cldata[i].stats[3],
					'att': cldata[i].stats[4],
					'str': cldata[i].stats[5],
					'dex': cldata[i].stats[6],
					'adp': cldata[i].stats[7],
					'nnt': cldata[i].stats[8],
					'fai': cldata[i].stats[9],
					'total' : function(){
						return (this.fai + this.nnt + this.adp + this.dex + this.str + this.att + this.vit + this.end + this.vig);	
					},
					'curLev' : function(){ return (this.total() - this.base.total()) + this.lev},
					'attr': function(name, value){
						var t = this;
						if(value == undefined && !typeof name === 'object') {
							return this[name];
						} else {
							if(typeof name === 'object') {
								var keys = [];
								var vals = [];
								for (var key in name) {
								   if (name.hasOwnProperty(key) && typeof name[key] != 'object') {

										t[key] = name[key];
										keys.push(key);
										vals.push(name[key]);
								   }
								}
								
								var g = (typeof value === 'boolean' && value === true ? true : false);
								if(g) {
									var event = $.Event('characters.changeBase');	
								} else
									var event = $.Event('characters.change');
									
								event.character = {attrName : keys, attrVal : vals};
								if(!g)
									d.trigger.t(event);
							} else {
								if(value >= this.base[name]) {
									if(value > 99)
										value = 99;
									this[name] = value;
									var event = $.Event('characters.change');
									event.character = {attrName : name, attrVal : value};
									
									d.trigger.t(event);
								}
							}
							
						}
						return this;
					}
				}
			}
			
			return st;
		})(t);
		
		this.rings = (function($){
			var active = [[],[],[]];
			var activeRingSet = [[],[],[]];
			
			var isInArry = function(valToLookFor,ArrayToSearch) {
				for(var i = 0,len = ArrayToSearch.length;i<len;i++) {
					if(ArrayToSearch[i] === valToLookFor)
						return true;
				}
				
				return false;
			}
			return {
				calcEffects : function() {
					this.effects = {}
					var counter = 0;
					for(var i = 0, len = active[t.characters.curChar.id].length;i<len;i++) {
						for(var g = 0, len2 = active[t.characters.curChar.id][i].effects.length;g<len2;g++) {
							this.effects['ef'+counter] = active[t.characters.curChar.id][i].effects[g];
							counter++;
						}
					}
				},
				getEffects : function() {
					return this.effects;
				},
				getActive : function() {
					return active;
				},
				changeRing : function(ring,ringId,ringValue) {
					ring = parseInt(ring);
					var cur = t.activeRings[t.characters.curChar.id];
					

					if(ringId != activeRingSet[t.characters.curChar.id][ring] && isInArry(ringId,activeRingSet[t.characters.curChar.id]) && ringId > 0) {
						if(t.options.alphaSelects) {
							t.elements.rings.eq(ring).alphaSelects('setToIndex',cur[ring]);
						}
						return false;
					} else {
						t.activeRings[t.characters.curChar.id][ring] = parseInt(ringValue);
						activeRingSet[t.characters.curChar.id][ring] = parseInt(ring);
						this.setRings();
						
						t.delegateStat.update('all',t);
						t.updateDefense();
						t.genBase64();
						t.showEffects();
						return true;
					}
				},
				setRings : function() {
					var rings = t.activeRings[t.characters.curChar.id];
					active[t.characters.curChar.id] = [t.ringData[rings[0]],t.ringData[rings[1]],t.ringData[rings[2]],t.ringData[rings[3]]];
					activeRingSet[t.characters.curChar.id] = [t.ringData[rings[0]].ringId,t.ringData[rings[1]].ringId,t.ringData[rings[2]].ringId,t.ringData[rings[3]].ringId];
					
					this.calcEffects();
				},
				addFromBase : function() {
					var rings = t.activeRings[0];

					active[t.characters.curChar.id] = [t.ringData[rings[0]],t.ringData[rings[1]]];
					t.activeRings[t.characters.curChar.id] = [rings[0],rings[1]];
					this.setRings();
				},
				changeRingSlots : function() {
					var rings = t.elements.rings;
					rings.eq(0).val(t.activeRings[t.characters.curChar.id][0]);
					rings.eq(1).val(t.activeRings[t.characters.curChar.id][1]);
					rings.eq(2).val(t.activeRings[t.characters.curChar.id][2]);
					rings.eq(3).val(t.activeRings[t.characters.curChar.id][3]);
					
					this.setRings();
					
					
					this.calcEffects();
				},
				getweight : function() {
					var rings = t.activeRings[t.characters.curChar.id];
					return (t.ringData[rings[0]].weight + t.ringData[rings[1]].weight + t.ringData[rings[2]].weight + t.ringData[rings[3]].weight);
					return
				}
				
			}
		})(jQuery);
		
		this.weapons = (function($){
			var active = [];
			var virtualWeapons = [];
			
			return {
				calcEffects : function() {
					this.effects = {}
					var counter = 0;
					for(var i = 0, len = active.length;i<len;i++) {
						for(var g = 0, len2 = active[i].effects.length;g<len2;g++) {
							this.effects['ef'+counter] = active[i].effects[g];
							counter++;
						}
					}
					
				},
				getEffects : function() {
					return this.effects;
				},
				setWeapons : function() {
					var weps = t.activeWeapons;
					var id = t.characters.curChar.id;
					active = [t.weaponData[weps[id][0]],t.weaponData[weps[id][1]],t.weaponData[weps[id][2]],t.weaponData[weps[id][3]]];
					
					this.calcEffects();
				},
				changeWeapon : function(hand) {
					var weps = t.activeWeapons;
					
					active[hand] = t.weaponData[weps[t.characters.curChar.id][hand]];
					
					this.genVirtual(hand);
					this.calcEffects();
				},
				getActiveWeps : function() {
					return active;
				},
				genVirtual : function(hand) {
					if(hand == 'all') {
						this.setVirtualWeapons(active);
					} else
						if(typeof(hand) == 'number') {
							this.setVirtualWeapons(active[hand]);
						}
				},
				setVirtualWeapons : function(weaponObj) {
					if(weapenObj.hasOwnProperty('name')) {
						
					} else {
						
					}
					
					
				},
				curWeight : function(obj,i) {
					return (active[0].weight + active[1].weight + active[2].weight + active[3].weight);
				}
			}
		})(jQuery);

		this.covenants =  [
			{
				name : 'No Covenant',
				id : 0
			},{
				name : 'Heirs of the Sun',
				id : 1
			},{
				name : 'Way of the Blue',
				id : 2
			},{
				name : 'Brotherhood of Blood',
				id : 3
			},{
				name : 'Blue Sentinels',
				id : 4
			},{
				name : 'Bell Keepers',
				id : 5
			},{
				name : 'Rat King',
				id : 6
			},{
				name : 'Dragon Remnants',
				id : 7
			},{
				name : 'Company of Champions',
				id : 8
			},{
				name : 'Pilgrims of Dark',
				id : 9
			}
		]
		this.curCov = {
			
			covenant : [0,0,0],
			switchCov : function(){
				var covId = this.covenant[t.characters.curChar.id];
				t.elements.stats.cov.val(covId);
				this.saveState(covId);
			},
			setCov : function(covId){
				this.covenant[t.characters.curChar.id] = covId;
				t.elements.stats.cov.val(covId);
				this.saveState(covId);
			},
			setCovFromBase : function(){
				this.covenant[t.characters.curChar.id] = this.covenant[0];
				t.elements.stats.cov.val(this.covenant[0]);
				this.saveState(this.covenant[0]);
			},
			saveState : function(id) {
				t.characterTotals[t.characters.curChar.id].covenant = id;
			}
		}
		this.player = function(id,sclass,changes){
			var pla = $.extend(true,{},t.classes[sclass]);
			for (var prop in changes) {
				if(pla.hasOwnProperty(prop) && changes.hasOwnProperty(prop) && typeof changes[prop] == 'number' && prop != 'id') {
					if(changes[prop] > pla[prop])
						pla[prop] = changes[prop];
				}
			}
			return $.extend({
				'id': id
			},{base : $.extend(true,{},t.classes[sclass])},pla);
		}
		
		this.variations = [];
		this.characters = (function(t){
			return {
				currentVar : t.currentVariation,
				curChar : t.variations[t.currentVariation],
				
				addVar : function(changes,clss) {
					var newCharacter = new t.player(t.variations.length, clss, changes);
					t.variations.push(newCharacter);
					this.changeVar(t.variations.length - 1);
					return newCharacter;
				},
				
				changeVar : function(id) {
					if(id < t.variations.length) {
						t.currentVariation = id;
						this.curChar = t.variations[t.currentVariation];
						this.changeSelectedClass();
						return t.characters;
					}
					
					return false;
				},
				getAllVar : function() {
					return t.variations;
				},
				setClassById : function(id) {
					t.selectedClass.change(id);
				},
				getClassByName : function(name) {
					for(var i = 0,len = t.classes.length-1;len >= i;--len){
						if(t.classes[len].name == name)
							return t.classes[len];
					}
					return false;
				},
				getClassNameById : function(id) {
					t.variations;
				},
				getClassId : function(name) {
					for(var i = 0,len = t.classes.length-1;len >= i;--len){
						if(t.classes[len].name == name)
							return len;
					}
					return false;
				},
				getAllClasses : function(name) {
					return t.classes;
				},
				changeSelectedClass : function(){
					t.selectedClass.change(this.getClassId(t.characters.curChar.base.name));
				},
				changeBaseClass : function(name) {
					var nclass = this.getClassByName(name);
					if(nclass) {
						var cur = t.characters.curChar;
						var temp = {};
						
						for(var key in cur) {
							if (cur.hasOwnProperty(key) && typeof cur[key] == 'number') {
								if(key != 'id' && key != 'hum'){
									if((cur[key] == cur.base[key] || cur[key] < cur.base[key]) || nclass[key] > cur[key]) {
										temp[key] = nclass[key];
									} else if(cur[key] > cur.base[key]){
										temp[key] = cur[key];
									}
										
								}
							}
							else if(key == 'name') {
								temp[key] = nclass[key];
							}
						}
						
						cur.base.attr(nclass,true);
						cur.attr(temp,false);
						
						this.changeSelectedClass();
						t.delegateStat.update('all',t);
						if(t.options.alphaSelects) {
							t.elements.stats.name.alphaSelects('setToIndex',t.characters.getClassId(t.variations[t.characters.curChar.id].name));
						}
					}
				},
				switchCharacter : function(id) {
					if(this.changeVar(id) !== false) {
						t.initChar(t.characters.curChar);
						t.showEffects();
						if(t.options.alphaSelects) {
							t.elements.stats.name.alphaSelects('setToIndex',t.characters.getClassId(t.variations[t.characters.curChar.id].name));
							t.elements.rings.eq(0).alphaSelects('setToIndex',t.activeRings[t.characters.curChar.id][0]);
							t.elements.rings.eq(1).alphaSelects('setToIndex',t.activeRings[t.characters.curChar.id][1]);
							t.elements.stats.cov.alphaSelects('setToIndex',t.curCov.covenant[t.characters.curChar.id]);
							for(var i = 0,len = t.elements.sitems.length;i<len;i++){
								t.elements.sitems.eq(i).alphaSelects('setToIndex',t.activeItems[t.characters.curChar.id][i]);
							}
						}
					}
				}
			}
		})(t);
		
		//new this.player(0,0,{vit:25})
		
		this.stats = this.graphs();
		this.defences = this.defform();
		
		
		/*
		 *  Register Observer Instance
		 *  Listens for custom name-spaced events and fires events when needed.
		 *  
		 */
		this.observe();
		this.attachDrivenEvents();
		this.generateFormElements();
		
		
		
		var ndata = this.genFromBase64();
		
		this.armor = [];
		
		
		if(ndata.length > 0) {
			var ptab = $('.player-tab.hidden');
			for(var i = 0,len = ndata.length;i<len;i++){
				t.armor.push({
					head : t.armorData.head[t.activeArmor[i][0]],
					chest : t.armorData.chest[t.activeArmor[i][1]],
					arms : t.armorData.arms[t.activeArmor[i][2]],
					legs : t.armorData.legs[t.activeArmor[i][3]]
				});
				
				t.characterTotals.push({});
				t.characters.addVar(ndata[i],ndata[i].clss);
				t.curCov.setCov(ndata[i].cov);
				//t.rings.setRings();
				//t.armorFuncs.calcEffects(t);
				
				if((i + 1) < len)
					ptab.eq(i).removeClass('hidden');
				
				if(i == 2)
					$('.player-tab.end').hide();
			}
			
			t.characters.changeVar(0);
			
			
		} else {
			this.characters.addVar({},0)
		}
		
		t.weapons.setWeapons();
		t.armorFuncs.setArmor(t);
		
		this.initChar(t.characters.curChar);
		
		
		t.showEffects();
		t.genBase64();
		
		
		ZeroClipboard.config({ debug: false });
		var client = ZeroClipboard( document.getElementById("shr-link"), {
		  moviePath: t.baseURL + "js/libs/ZeroClipboard.swf"
		});
		client.clip(document.getElementById("shr-link"));
		client.on("load", function(client) {
			client.on( 'dataRequested', function (client, args) {
				client.setText( document.getElementById('link64').value );
			});
			client.on( "complete", function(client, args) {
				$('#text-copied').show(0,function() {
					$(this).fadeOut(3000);
				});	
			});
		});
		
		if(t.options.alphaSelects) {
			t.elements.rings.alphaSelects({data: t.ringData,delayOptions: true,optionTemplate: '<div data-for="{index}"><img src="{srcImg}" style="background-image: url({imageSprite}); background-position: {offset}"><div class="alpha-results-text">{name}</div></div>',imageSprite: t.baseURL + 'imgs/sprites/ring-sprite.png'});
			t.elements.sitems.alphaSelects({data: t.itemData,delayOptions: true,optionTemplate: '<div data-for="{index}"><img src="{srcImg}" style="background-image: url({imageSprite}); background-position: {offset}"><div class="alpha-results-text">{name}</div></div>',imageSprite: t.baseURL + 'imgs/sprites/item-sprite.png'});
			t.elements.stats.cov.alphaSelects({data: t.covenants,delayOptions: false,optionTemplate: '<div data-for="{index}"><div class="alpha-results-text">{name}</div></div>',imageSprite: false,displayTemplate: '<div class="alpha-select-text"><span class="alpha-text">{name}</span><div class="alpha-arrow"></div></div>',});
			t.elements.stats.name.alphaSelects({data: t.classes,optionProps:{lev:0},dataforkey: 'name', delayOptions: false,optionTemplate: '<div data-for="{index}"><div class="alpha-sub-text float-right">Level {lev}</div><div class="alpha-results-text">{name} </div></div>',imageSprite: false,displayTemplate: '<div class="alpha-select-text"><span class="alpha-text">{name}</span><div class="alpha-arrow"></div></div>',});
			
			t.elements.armor.head.alphaSelects({data: t.armorData.head,optionProps:{phy:0,mag:0,fla:0,lig:0,weight:0,poise:0},delayOptions: true,optionTemplate: '<div data-for="{index}"><img src="{srcImg}" style="background-image: url({imageSprite}); background-position: {offset}"><div class="alpha-results-text">{name}</div><div class="alpha-results-text alpha-sub-text">Def (<span class="defense-color">{phy}</span>/<span class="magic-color">{mag}</span>/<span class="fire-color">{fla}</span>/<span class="light-color">{lig}</span>) : <span class="weight-color">{weight}</span> Wei | <span class="weight-color">{poise}</span>p</div></div>',imageSprite: t.baseURL + 'imgs/sprites/head-sprite.png'});
			t.elements.armor.chest.alphaSelects({data: t.armorData.chest,optionProps:{phy:0,mag:0,fla:0,lig:0,weight:0,poise:0},delayOptions: true,optionTemplate: '<div data-for="{index}"><img src="{srcImg}" style="background-image: url({imageSprite}); background-position: {offset}"><div class="alpha-results-text">{name}</div><div class="alpha-results-text alpha-sub-text">Def (<span class="defense-color">{phy}</span>/<span class="magic-color">{mag}</span>/<span class="fire-color">{fla}</span>/<span class="light-color">{lig}</span>) : <span class="weight-color">{weight}</span> Wei | <span class="weight-color">{poise}</span>p</div></div>',imageSprite: t.baseURL + 'imgs/sprites/chest-sprite.png'});
			t.elements.armor.arms.alphaSelects({data: t.armorData.arms,optionProps:{phy:0,mag:0,fla:0,lig:0,weight:0,poise:0},delayOptions: true,optionTemplate: '<div data-for="{index}"><img src="{srcImg}" style="background-image: url({imageSprite}); background-position: {offset}"><div class="alpha-results-text">{name}</div><div class="alpha-results-text alpha-sub-text">Def (<span class="defense-color">{phy}</span>/<span class="magic-color">{mag}</span>/<span class="fire-color">{fla}</span>/<span class="light-color">{lig}</span>) : <span class="weight-color">{weight}</span> Wei | <span class="weight-color">{poise}</span>p</div></div>',imageSprite: t.baseURL + 'imgs/sprites/arms-sprite.png'});
			t.elements.armor.legs.alphaSelects({data: t.armorData.legs,optionProps:{phy:0,mag:0,fla:0,lig:0,weight:0,poise:0},delayOptions: true,optionTemplate: '<div data-for="{index}"><img src="{srcImg}" style="background-image: url({imageSprite}); background-position: {offset}"><div class="alpha-results-text">{name}</div><div class="alpha-results-text alpha-sub-text">Def (<span class="defense-color">{phy}</span>/<span class="magic-color">{mag}</span>/<span class="fire-color">{fla}</span>/<span class="light-color">{lig}</span>) : <span class="weight-color">{weight}</span> Wei | <span class="weight-color">{poise}</span>p</div></div>',imageSprite: t.baseURL + 'imgs/sprites/legs-sprite.png'});
			
			t.elements.spellslots.css('visibilty','visible');
			t.elements.spellslots.alphaSelects({data: t.spellData,optionProps:{cost:0,requirement:0},delayOptions: true,groupBy: 'type',groupTitles:['Magic','Pyromancies','Miracles'], optionTemplate: '<div data-for="{index}"><img src="{srcImg}" style="background-image: url({imageSprite}); background-position: {offset}"> <div class="alpha-results-text align-left"> {name}</div><div class="alpha-results-text alpha-sub-text align-left">Cost <span class="defense-color">{cost}</span> <span class="float-right">Requirement <span class="magic-color">{requirement}</span></span></div></div>',imageSprite: t.baseURL + 'imgs/sprites/spell-sprite.png'});
			
			t.options.runalphaSelects = true;
			t.delegateStat.update('att',t);
		}
		
		setTimeout(function(){
			$('#loader').hide();
		},500);
}

Darksouls.prototype.trigger = (function($) {
	var body = $('body');
	return { 
		t : function(toTrigger) {
			body.trigger(toTrigger);
		}
	}
})(jQuery);
Darksouls.prototype.observe = function(){
	var t = this;
	var v = [{
		'selector' : 'body',
		'name' : 'characters.change' ,
		'func' : function(event){
			t.updateChar(event);
			t.updateDefense();
		}
	},{
		'selector' : 'body',
		'name' : 'characters.changeBase' ,
		'func' : function(event){
			t.updateBChar(event);
		}
	}];
	
	$(v).each(function(index){
		$(this.selector).on(this.name,this.func);
	});
};
Darksouls.prototype.delegateStat = (function($) {
	var dexstr = [45,46,48,50,52,54,55,56,56,57,59,61,63,66,68,70,73,75,77,80,82,84,86,89,91,93,95,98,100,102,105,109,113,117,121,124,128,132,136,140,141,143,144,146,147,149,150,152,153,155,155,156,157,158,158,159,160,161,161,162,162,163,164,165,166,166,167,168,169,170,171,173,174,176,177,179,180,182,183,185,185,186,187,188,188,189,190,191,191,192,192,193,194,195,196,197,198,199,200];
	var castspeed = [37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,116,117,118,119,120,121,122,123,124,125,126,126,127,127,128,128,129,129,130,130,131,131,132,132,133,133,134,134,135,135,136,136,137,137,138,138,139,139,140,140,141,141,142,142,143,143,144,144,145,145,146,146,147,147,148,148,149,149,150];
	var magbns = [50,50,51,51,51,52,52,53,53,53,58,63,68,74,79,84,90,95,100,106,106,106,107,107,108,108,108,109,109,110,113,116,119,122,125,128,131,134,137,140,141,143,144,146,147,149,150,152,153,155,155,156,157,158,158,159,160,161,161,162,162,163,164,165,166,166,167,168,169,170,171,173,174,176,177,179,180,182,183,185,185,186,187,188,188,189,190,191,191,192,192,193,194,195,196,196,198,199,200];
	var blepsn = [50,50,52,52,54,54,55,56,56,57,61,66,70,75,79,84,88,93,97,102,105,108,111,114,117,120,123,126,129,132,133,135,136,138,139,141,142,144,145,147,147,148,149,150,151,151,152,153,154,155,155,156,157,158,158,159,160,161,161,162,162,163,164,165,166,166,167,168,169,170,171,173,174,176,177,179,180,182,183,185,185,186,187,188,188,189,190,191,191,192,192,193,194,195,196,197,198,199,200];
	var firdar = [50,54,56,59,61,63,65,68,70,72,76,81,85,90,94,99,103,108,112,117,120,123,126,129,132,135,138,141,144,147,147,148,149,150,151,151,152,153,154,155,155,156,157,158,158,159,160,161,161,162,162,163,164,165,166,166,167,168,169,170,170,171,172,173,173,174,175,176,176,177,177,178,179,180,181,181,182,183,184,185,185,186,187,188,188,189,190,191,191,192,192,193,194,195,196,197,198,199,200]

	var dethpbreaks = function(stat,breakpoints,breakvalues) {
		var v;
		
		if(stat <= breakpoints[0])
			v = stat * breakvalues[0];
			
		if(stat > breakpoints[0] && stat <= breakpoints[1])
			v = (breakpoints[0] * breakvalues[0]) + ((stat - breakpoints[0]) * breakvalues[1]);
			
		if(stat > breakpoints[1] && stat <= breakpoints[2])
			v = (breakpoints[0] * breakvalues[0]) + ((breakpoints[1]-breakpoints[0]) * breakvalues[1]) + ((stat - breakpoints[1]) * breakvalues[2]);
		
		if(stat > breakpoints[2])
			v = (breakpoints[0] * breakvalues[0]) + ((breakpoints[1]-breakpoints[0]) * breakvalues[1]) + ((breakpoints[2]-breakpoints[1]) * breakvalues[2]);
			
		return v;
	}
	var calccastSpeed = function(curChar,obj) {
		var speedIndex = Math.floor(((curChar.att * 2) + curChar.fai + curChar.nnt) / 4) - 1;
		var speed = castspeed[speedIndex];
		
		obj.characterTotals[obj.characters.curChar.id].castSpeed = speed;
		obj.elements.stats.casts.val(speed);
	}
	var psnbleBns = function(stat,dex,obj,type) {
		var nIndex = Math.floor(((dex * 3) + stat) / 4);
		var nval = blepsn[nIndex-1];
		
		obj.characterTotals[obj.characters.curChar.id][type] = nval;
		obj.elements.stats[type].val(nval);
	}
	var calcFirDarMag = function(curChar,obj,type) {
		var nIndex = 0;
		var nval;
		
		if(type == 'magicbns') {
			nval = magbns[curChar.nnt-1];
		}
		if(type == 'firebns') {
			nIndex = Math.floor((curChar.nnt + curChar.fai)/2);
			nval = firdar[nIndex-1];
		}
		if(type == 'darbns') {
			nIndex = Math.min(curChar.nnt,curChar.fai);
			nval = firdar[nIndex-1];
		}

		obj.characterTotals[obj.characters.curChar.id][type] = nval;
		obj.elements.stats[type].val(nval);
	}
	var calcAgility = function(curChar, obj){
		var adp = curChar.adp;
		var att = curChar.att;
		
		var f1 = 86 + ((adp - 8) * (110 - 86)/(40 - 8));
		var f2 = (att - 3) * (1/4);
		var min = f1 + f2;
		
		var agility;
			//IF(F25+G25>110;110+10*(F25+G25-110)/68;F25+G25))
		if(min > 110) {
			agility = 110 + (10 * (min - 110) / 68);
		} else
			agility = min;
		
		var ragility = Math.floor(Math.max(85,agility));
		
		
		obj.characterTotals[obj.characters.curChar.id].agility = ragility;
		
		var iframes = 8;
		if(agility > 89.99 && agility < 94.99)
			iframes = 9;
		else if(agility > 94.99 && agility < 99.99)
			iframes = 10;
		else if(agility > 99.99 && agility < 104.99)
			iframes = 12;
		else if(agility > 104.99 && agility < 114.99)
			iframes = 13;
		else if(agility > 114.99 && agility < 119.99)
			iframes = 15;
		else if(agility > 119.99)
			iframes = 16;
			
		obj.characterTotals[obj.characters.curChar.id].iframes = iframes;	
			
		obj.elements.stats.agility.val(ragility + '('+iframes+')');
	}
	var h = {
		vig : function(obj){
			var els = obj.elements.stats,
				cur = obj.characters.curChar;
			var vig = cur.vig;
			
			
			var hp = 500 + dethpbreaks(vig,[20,50,99],[30,20,5]);
				hp += dethpbreaks(cur.end,[20,50,99],[2,1,0]);
				hp += dethpbreaks(cur.vit,[20,50,99],[2,1,0]);
				hp += dethpbreaks(cur.att,[20,50,99],[2,1,0]);
				hp += dethpbreaks(cur.str,[20,50,99],[2,1,0]);
				hp += dethpbreaks(cur.dex,[20,50,99],[2,1,0]);
				hp += dethpbreaks(cur.adp,[20,50,99],[2,1,0]);
				hp += dethpbreaks(cur.nnt,[20,50,99],[2,1,0]);
				hp += dethpbreaks(cur.fai,[20,50,99],[2,1,0]);
		
			var change = obj.applyEffects({hp:hp});
			var vit = (change.hasOwnProperty('hp') ? Math.floor(change.hp) : hp)
			obj.characterTotals[obj.characters.curChar.id].hp = vit;
			els.hp.val(vit);
		},
		att : function(obj){
			var att = obj.characters.curChar.att;
			var slot = 0;
			if(att >= 75)
				slot = 10;
			else if(att >= 60)
				slot = 9;
			else if(att >= 50)
				slot = 8;
			else if(att >= 40)
				slot = 7;
			else if(att >= 30)
				slot = 6;
			else if(att >= 25)
				slot = 5;
			else if(att >= 20)
				slot = 4;
			else if(att >= 16)
				slot = 3;
			else if(att >= 13)
				slot = 2;
			else if(att >= 10)
				slot = 1;
			
			var slotS = obj.applyEffects({slots: slot});
			
			obj.characterTotals[obj.characters.curChar.id].attSlots = slotS.slots;
			obj.elements.stats.slots.val(slotS.slots);
			obj.dictateSpellsShown(slotS.slots, obj.activeSpells[obj.characters.curChar.id].length ,obj.spellFuncs.countTotal(obj, -1));
			
			//calccastSpeed(obj.characters.curChar,obj);
		},
		end : function(obj){
			
			var els = obj.elements;
			var end = obj.characters.curChar.end;

			var stm = 80 + dethpbreaks(end,[20,50,99],[2,1,1]);

			var change = obj.applyEffects({stam:stm});

			stm = (change.hasOwnProperty('stam') ? Math.round(change.stam) : stm);
			
			obj.characterTotals[obj.characters.curChar.id].stam = stm;

			els.stats.stam.val(stm);

		},
		vit : function(obj){
			var els = obj.elements;
			var vit = obj.characters.curChar.vit;
			var total = dethpbreaks(vit,[29,49,79],[1.5,1,0.5]);
			if(vit > 79)
				total += Math.floor((vit - 79) / 2) * 0.5;

			total += 38.5;
			
			
			var els = obj.elements;
			var end = obj.characters.curChar.end;
			var curWeight = obj.armorFuncs.curWeight(obj,obj.currentVariation) + obj.weapons.curWeight() + obj.rings.getweight();
			

			var change = obj.applyEffects({eqp:total});
			
			total = (change.hasOwnProperty('eqp') ? change.eqp : total)
			
			var points = [total * .08333, total * .16667, total * .25 , total * .5 ,total];
			var using = curWeight / total;
			var frac = (using * 100 ).toFixed(1)
			
			obj.characterTotals[obj.characters.curChar.id].curWeight = curWeight;
			els.stats.eqp.val(curWeight + '/' + total.toFixed(1));
			
			var left,roll,color;
			if(curWeight <= points[0]) {
				left  = points[0] - curWeight;
				roll = 'Fastest Roll';
				color = 'green';
			}else if(curWeight <= points[1]) {
				left  = points[1] - curWeight;
				roll = 'Faster Roll';
				color = 'green';
			}else if(curWeight <= points[2]) {
				left  = points[2] - curWeight;
				roll = 'Fast Roll';
				color = 'green';
			}else if(curWeight <= points[3]) {
				left  = points[3] - curWeight;
				roll = 'Medium Roll';
				color = 'orange';
			}else if(curWeight <= points[4]) {
				left  = points[4] - curWeight;
				roll = 'Slow Roll';
				color = 'red';
			}else if(curWeight > points[4]) {
				left  = points[4] - curWeight;
				roll = 'Stagger';
				color = 'deepred';
			}
			
			
			
			els.stats.eper.text(frac).attr('class','').addClass(color);
			els.stats.ewig.text((left).toFixed(1)).attr('class','').addClass(color);
			els.stats.eroll.text(roll).attr('class','').addClass(color);
		},
		adp : function(obj){
			
		},
		str : function(obj){
			var str = obj.characters.curChar.str - 1;
			var atkstr = dexstr[str];
			
			obj.elements.stats.atkstr.val(atkstr);
			obj.characterTotals[obj.characters.curChar.id].atkstr = atkstr;
		},
		dex : function(obj) {
		
			var dex = obj.characters.curChar.dex - 1;
			var atkdex = dexstr[dex];
			
			obj.elements.stats.atkdex.val(atkdex);
			obj.characterTotals[obj.characters.curChar.id].atkdex = atkdex;

			
		},
		fai : function(obj) {
		
			var fai = obj.characters.curChar.fai - 1;
			var faibns = dexstr[fai];
			
			obj.elements.stats.ligbns.val(faibns);
			obj.characterTotals[obj.characters.curChar.id].ligbns = faibns;
		},
		nnt : function(obj) {
		
		}
	}
	
	return {
		update : function(stat,obj) {
			if(h.hasOwnProperty(stat)){
				h[stat](obj);
				h.vig(obj);
				if(stat == 'att' || stat == 'adp')
					calcAgility(obj.characters.curChar,obj);
				if(stat == 'att' || stat == 'nnt' || stat == 'fai')
					calccastSpeed(obj.characters.curChar,obj);
				
				if(stat == 'nnt' || stat == 'fai') {
					calcFirDarMag(obj.characters.curChar,obj,'firebns');
					calcFirDarMag(obj.characters.curChar,obj,'darbns');
				}
				if(stat == 'nnt')
					calcFirDarMag(obj.characters.curChar,obj,'magicbns');
				
				if(stat == 'dex' || stat == 'fai')
					psnbleBns(obj.characters.curChar.fai,obj.characters.curChar.dex,obj,'bleedbns');
					
				if(stat == 'dex' || stat == 'adp')
					psnbleBns(obj.characters.curChar.adp,obj.characters.curChar.dex,obj,'poisonbns');
				
				
			}else if(stat == 'all') {
				h.vig(obj);h.att(obj);h.vit(obj);h.end(obj);h.str(obj);h.dex(obj);h.fai(obj);
				calccastSpeed(obj.characters.curChar,obj);
				calcAgility(obj.characters.curChar,obj);
				calcFirDarMag(obj.characters.curChar,obj,'magicbns');
				calcFirDarMag(obj.characters.curChar,obj,'firebns');
				calcFirDarMag(obj.characters.curChar,obj,'darbns');
				psnbleBns(obj.characters.curChar.fai,obj.characters.curChar.dex,obj,'bleedbns');
				psnbleBns(obj.characters.curChar.adp,obj.characters.curChar.dex,obj,'poisonbns');
			}
		}
	}
})(jQuery);
Darksouls.prototype.attachDrivenEvents = function() {
	var t = this;
	
	var evs = [{
		'base' : '.c-body',
		'sel' : 'input.editable',
		'name' : 'mousedown mouseup change drop copy paste keydown keyup',
		'func' : function(event) {
			var $t = $(this);
			var ev = event.type;
			if(ev == 'drop' || ev == 'copy' || ev == 'paste') {
				event.preventDefault();
				event.stopPropagation();
				this.blur();
				return false;
			}
			if(ev == 'mousedown') {
				event.preventDefault();
				event.stopPropagation();
				$t.mouseup();
			}
			if(ev == 'mouseup') {
				event.preventDefault();
				event.stopPropagation();
				this.select();
			}
			if(ev == 'keydown' || ev == 'keyup') {
				var key = event.which;
				var shift = event.shiftKey;
				
				if(key == 13 && ev == 'keyup') {
					t.changeStat($t.attr('data-for'),$t.val(),false,$t.attr('tabindex'));
				}
				
				if(ev == 'keydown') {
					return (!shift && (key == 8 ||
					  key == 9 ||
					  key == 46 ||
					  key == 37 ||
					  key == 39) ||
					  (key >= 48 && key <= 57) ||
					  (key >= 96 && key <= 105));
				} else if(ev == 'keyup') {
					if($t.val().length == 2 && key != 9 && key != 13) {
						$t.blur();
					}
				}
			}
			
			if(ev == 'change') {
				var val = $t.val();
				if(val.charAt(0) == '0')
					$t.val(val.substring(1));
				var to = $t.attr('data-for');
				t.changeStat(to,val,false,$t.attr('tabindex'));
				t.classify();
				$t.blur();
			}
		}
	},{
		'base' : '.c-body',
		'sel' : 'input.fixed',
		'name' : 'mouseup mousemove change copy drop keydown click',
		'func' : function(event) {
			event.preventDefault();
			event.stopPropagation();
			this.blur();
			return false;
		}
	},{
		'base' : '.c-body',
		'sel' : 'select#classname',
		'name' : 'change keyup',
		'func' : function(event) {
			var v = this.value;
			t.characters.changeBaseClass(v);
			t.genBase64();
		}
	},{
		'base' : '.c-body',
		'sel' : '#revert',
		'name' : 'click',
		'func' : function(event) {
			t.revertCharacter();
		}
	},{
		'base' : '.c-body',
		'sel' : 'select.ring',
		'name' : 'change',
		'func' : function(event) {
			var v = this.value;
			var ringId = t.ringData[v].ringId;
			
			var ringHand = this.getAttribute('data-rindid');
			
			if(t.rings.changeRing(ringHand,ringId,v) === false) {
				t.genBase64();
				this.value = t.activeRings[t.characters.curChar.id][ringHand];
			}
			
		}
	},{
		'base' : '.c-body',
		'sel' : '.arrow',
		'name' : 'click mousedown mouseup mouseout',
		'func' : function(event) {
			var $t = $(this);
			var ty = event.type;
			if(ty == 'click') {
				
				var v = ($t.hasClass('up') ? 1 : -1);
				var f = $t.attr('data-for');
				var $t = $('#'+f);
				
				v = parseInt($t.val()) + (event.shiftKey ? v * 10 : v);
				t.changeStat(f,v,false,false);
				t.classify();
			}
			if(ty == 'mousedown') {
				$t.addClass('watching');
				t.timHolder = setTimeout(function() {
					t.intHolder = setInterval(function(){
						if($t.hasClass('watching'))
							$t.click();
						else{
							clearInterval(t.intHolder);
							$t.removeClass('watching');
						}
					},120);
				},300);
			}else if(ty == 'mouseup') {
				clearInterval(t.intHolder);
				clearTimeout(t.timHolder);
				$t.removeClass('watching');
			}
			
			if(ty == 'mouseout') {
				clearInterval(t.intHolder);
				clearTimeout(t.timHolder);
				$t.removeClass('watching');
			}
		}
	},{
		'base' : '.c-body',
		'sel' : '#covenant',
		'name' : 'change',
		'func' : function(event) {
			t.curCov.setCov(parseInt(this.value));
			t.genBase64();
		}
	},{
		'base' : '.c-body',
		'sel' : '#bestclass',
		'name' : 'click',
		'func' : function(event) {
			t.characters.changeBaseClass($.data(t.elements.stats.clname,'baseclassid'));
			t.elements.stats.bclass.hide();
			t.genBase64();
		}
	},{
		'base' : '.c-body',
		'sel' : '#armor-h,#armor-c,#armor-a,#armor-l',
		'name' : 'change',
		'func' : function(event) {
			var charId = t.characters.curChar.id;
			var id = this.id;
			var h,d;
			
			switch(id){
				case('armor-h'):
					h = 'head';
					d = 0;
				break;
				case('armor-c'):
					h = 'chest';
					d = 1;
				break;
				case('armor-a'):
					h = 'arms';
					d = 2;
				break;
				case('armor-l'):
					h = 'legs';
					d = 3;
				break;
			}
			t.activeArmor[charId][d] = $(this).val();
			
			
			
			t.armorFuncs.changePiece(t,h,t.armorData.head[$(this).val()])
			t.delegateStat.update('end',t);
			t.delegateStat.update('vit',t);
			t.delegateStat.update('hum',t);
			t.delegateStat.update('res',t);

			t.genBase64();
			t.showEffects();
		}
	},{
		'base' : '.c-items',
		'sel' : '.s-items',
		'name' : 'change',
		'func' : function(event) {
			var indes = parseInt(this.getAttribute('data-index'));
			
			t.setItem(t.characters.curChar.id,indes, this.value);
			
			t.genBase64();
		}
	},{
		'base' : '#spell-c',
		'sel' : '.spells',
		'name' : 'change',
		'func' : function(event) {
			var indes = parseInt(this.getAttribute('data-index'));
			
			t.pushSpell(event,indes,this.value);
			
			t.genBase64();
		}
	},{
		'base' : '.c-header',
		'sel' : '.player-tab:not(.active)',
		'name' : 'click',
		'func' : function(event) {
			var $t = $(this);
			$('.player-tab').removeClass('active');
			var $ch = $('.player-tab:hidden');
			if($t.hasClass('end')) {
				if($ch.length > 0) {
					var ind = 1;
					if($ch.length == 1) {
						$t.hide();
						ind = 2;
					}
					$ch.eq(0).removeClass('hidden').addClass('active').show();
					
					if($ch.length > 0){
						t.armor.push($.extend(true,{},t.armor[0]));
						t.characterTotals.push({});
						t.characters.addVar(t.characters.curChar,t.selectedClass.clss);
						
						t.activeItems[ind] = t.activeItems[0].slice(0);
						
						t.activeSpells[ind] = t.activeSpells[0].slice(0);
						t.curCov.setCovFromBase();
						t.elements.stats.lev.val(t.characters.curChar.curLev());
						t.rings.addFromBase();
						t.characters.switchCharacter(ind);
						t.genBase64();
					}
				}
				
			} else {
				if($t.hasClass('base')) {
					$t.addClass('active');
					t.characters.switchCharacter(0);
				} else if($t.hasClass('tab')) {
					$t.addClass('active').show();
					t.characters.switchCharacter($t.attr('data-index'));
				}
			}
		}
	},{
		'base' : '.c-header',
		'sel' : '.player-remove',
		'name' : 'click',
		'func' : function(event) {
			event.stopPropagation()
			var $t = $(this);
			var par = $t.parent().parent();
			var $pt = $('.player-tab.tab');
				$pt.removeClass('active');
			var index = par.attr('data-index');
				var ln = t.variations.length;
				var sw = 0;
				if((index == 2 && ln == 3) || (index == 1 && ln == 2)) {
					t.variations.pop();
					t.armor.pop();
					t.characterTotals.pop();
					t.activeRings[index] = [0,0,0,0];
				} else {
					t.variations.splice(1,1);
					t.characterTotals.splice(1,1)
					t.armor.splice(1,1);
					sw = 1;
					t.variations[1].id = 1;
					t.activeRings[1] = [t.activeRings[2][0],t.activeRings[2][1],t.activeRings[2][2],t.activeRings[2][3]];
					t.activeRings[2] = [0,0,0,0];
				}
				var $ch = $('.player-tab.tab:visible');
				
				if($ch.length == 1) {
					$('.player-tab.base').addClass('active');
					$ch.hide();
				} else
					$pt.hide().eq(0).show().addClass('active');
				
				$('.player-tab.end').show();
				
				t.characters.switchCharacter(sw);
				t.genBase64();
		}
	},{
		'base' : '.c-footer',
		'sel' : '#link64',
		'name' : 'click',
		'func' : function(event) {
			this.select();
			return false;
		}
	}];
	
	$(evs).each(function(index){
		$(this.base).on(this.name,this.sel,this.func);
	});
	
}
Darksouls.prototype.setItem = function(curId,selId,value) {
	this.activeItems[curId][selId] = parseInt(value);
}
Darksouls.prototype.setItemSels = function(curId) {
	var itms = this.activeItems[curId];
	for(var i = 0,len = itms.length;i<len;i++) {
		this.elements.sitems.eq(i).val(itms[i]);
	}
}
Darksouls.prototype.dictateSpellUsage = function(event,index,value) {
	var curspells = this.activeSpells[this.characters.curChar.id];
}
Darksouls.prototype.pushSpell = function(event,index,value) {

	var curspells = this.activeSpells[this.characters.curChar.id];
	var slots = this.elements.spellslots;
	
	var nspell = this.spellData[value];
	var cost = nspell.cost;
	
	for(var i = 0;i<index;i++) {
		if(slots[i].value == '0') {
			slots[index].value = 0;
			slots[i].value = value;
			if(this.options.alphaSelects && this.options.runalphaSelects) {
				this.elements.spellslots.eq(i).alphaSelects('setToIndex',value);
			}
			index = i;
			break;
		}
	}
	
	var total = this.spellFuncs.countTotal(this, index);
	
	var avail = this.characterTotals[this.characters.curChar.id].attSlots;
	
	if((total + cost) > avail) {
		var spellId = this.spellFuncs.returnCurSpellId(this,index);
		slots.eq(index).val(spellId);
		if(this.options.alphaSelects && this.options.runalphaSelects) {
			this.elements.spellslots.eq(index).alphaSelects('setToIndex',value);
		}
	} else {
		if(typeof curspells[index] == "undefined") {
			curspells.push({id:value,cost: nspell.cost,i:index});
			
		} else {
			if(value == 0) {
				curspells.splice(index,1);
				this.spellFuncs.reShiftSpells(this);
			}
			else {
				curspells[index] = {id:value,cost: nspell.cost,i:index};
			}
		}
		
		this.dictateSpellsShown(avail,curspells.length,(total + cost));
	}
	
}
Darksouls.prototype.dictateSpellsShown = function(slots,usedSlots,totalCost) {
	var curspells = this.activeSpells[this.characters.curChar.id];
	var avail = slots, s2 = slots;
	if(totalCost > usedSlots)
		avail -= (totalCost - usedSlots);
	
	var slots = this.elements.spellslots;
	var alpha = (this.options.alphaSelects && this.options.runalphaSelects);
	
	slots.css('visibility', 'hidden');
	if(alpha) {
		this.elements.spellslots.alphaSelects('hide');
	}
	for(var index = 0,len = slots.length;index<len;index++) {
		//console.log(curspells);
		var clot = slots.eq(index),
			cind = slots[index];
		if(avail > 0 && index < avail) {
			if(alpha) {
				clot.alphaSelects('show');
			} else
				cind.style.visibility = 'visible';
				
			if(typeof curspells[index] == "undefined") {
				cind.value = 0;
				if(alpha) {
					clot.alphaSelects('setToIndex',0);
				}
			}
				
		} else {
			if(cind.value != '0' && typeof curspells[index] == "undefined" && index != s2) {
				cind.value = 0;
				
				if(alpha) {
					clot.alphaSelects('setToIndex',0);
				}
				
				//break;
			} else if(typeof curspells[index] != "undefined" && index >= s2){
				if(alpha) {
					//console.log(index,slots.eq(index).alphaSelects('setToIndex',0));
				}

				this.activeSpells[this.characters.curChar.id] = curspells.slice(0,s2);
			}
			
			
		}

	}
	
	
}
Darksouls.prototype.dictateSpellsShown = function(slots,usedSlots,totalCost) {
	var curspells = this.activeSpells[this.characters.curChar.id];
	var avail = slots, s2 = slots;
	if(totalCost > usedSlots)
		avail -= (totalCost - usedSlots);
	
	var slots = this.elements.spellslots;
	var alpha = (this.options.alphaSelects && this.options.runalphaSelects);
	
	slots.css('visibility', 'hidden');
	if(alpha) {
		this.elements.spellslots.alphaSelects('hide');
	}
	for(var index = 0,len = slots.length;index<len;index++) {
		//console.log(curspells);
		var clot = slots.eq(index),
			cind = slots[index];
		if(avail > 0 && index < avail) {
			if(alpha) {
				clot.alphaSelects('show');
			} else
				cind.style.visibility = 'visible';
				
			if(typeof curspells[index] == "undefined") {
				cind.value = 0;
				if(alpha) {
					clot.alphaSelects('setToIndex',0);
				}
			}
				
		} else {
			if(cind.value != '0' && typeof curspells[index] == "undefined" && index != s2) {
				cind.value = 0;
				
				if(alpha) {
					clot.alphaSelects('setToIndex',0);
				}
				
				//break;
			} else if(typeof curspells[index] != "undefined" && index >= s2){
				if(alpha) {
					//console.log(index,slots.eq(index).alphaSelects('setToIndex',0));
				}

				this.activeSpells[this.characters.curChar.id] = curspells.slice(0,s2);
			}
			
			
		}

	}
	
	
}
Darksouls.prototype.spellFuncs = {
	countTotal : function(obj,index) {
		var curspells = obj.activeSpells[obj.characters.curChar.id];
		var total = 0;
		for(var i = 0,len = curspells.length;i<len;i++){
			if(i != index)
			total += curspells[i].cost;
		}
		return total;
	},
	returnCurSpellId : function(obj,index) {
		var curspells = obj.activeSpells[obj.characters.curChar.id];
		if(typeof curspells[index] == "undefined")
			return 0;
		else
			return curspells[index].id;
	},
	setSpellElements : function(obj) {
		var curspells = obj.activeSpells[obj.characters.curChar.id];
		//console.log(obj.activeSpells);
		for(var i = 0,len = curspells.length;i<len;i++){
			obj.elements.spellslots[i].value = curspells[i].id;
			if(obj.options.alphaSelects && obj.options.runalphaSelects) {
				obj.elements.spellslots.eq(i).alphaSelects('setToIndex',curspells[i].id);
			}
		}
		if(curspells.length === 0) {
			obj.elements.spellslots.val(0);
			if(obj.options.alphaSelects && obj.options.runalphaSelects) {
				obj.elements.spellslots.alphaSelects('setToIndex',0);
			}
		}
	},
	reShiftSpells : function(obj) {
		
		var curspells = obj.activeSpells[obj.characters.curChar.id];
		var els = obj.elements.spellslots;
		var b = 0;
		
		for(var i = 0,len = curspells.length;i<len;i++){			
			if(curspells[i].i != i) {
				els[i].value = curspells[i].id;
				els[curspells[i].i].value = 0;
				curspells[i].i = i;
			}
			
			
		}
	}
}
Darksouls.prototype.changeStat = function(target,value,shiftKey,index){
	var t = this;
	value = parseInt(value);
	var base = this.characters.curChar.base;
	var v = (base.hasOwnProperty(target) ? base[target] : false);
	if(v === false)
		return false;
	
	if(value < v )
		value = v;
	
	this.characters.curChar.attr(target,value);
	
	t.delegateStat.update(target,t);

	if(index !== false)
	this.highlightnext(index);
	
	this.genBase64();
	
}
Darksouls.prototype.classify = function() {
	var t = this;
	var lvls = [];
	
	var clc = this.classes;
	var cha = this.characters.curChar;
	
	var changes = {};
	for(var key in cha){
		if(cha.hasOwnProperty(key) && typeof cha[key] == 'number' && key != 'id' && key != 'lev') 
			changes[key] = cha[key];
	}

	for(var i = clc.length-1;i>=0;i--){
		var slv = 0;
		
		for(var key in changes){	
			slv += (changes[key] == cha.base[key] ? 0 : (clc[i][key] > changes[key] ? (clc[i][key] - changes[key]) : (clc[i][key] < changes[key] ? (changes[key] - clc[i][key]) : 0 )));
		}
		
		slv += clc[i].lev;
		lvls.push({id:i,lvl:slv});
		
	}
	
	var lowest = lvls[0].lvl;
	var lid = lvls[0].id;
	
	for(var i = 0,len = lvls.length;i<len;i++){
		if(lowest > lvls[i].lvl) {
			lowest = lvls[i].lvl;
			lid = lvls[i].id;
		}
	}
	
	 this.delagateBestClass({lvl: lowest,id: t.classes[lid].name});
}

Darksouls.prototype.delagateBestClass = function(data) {
	var els = this.elements.stats;
	var t = this;
	this.classTimer;
	
	els.bclass.finish().hide();
	
	clearTimeout(this.classTimer);
	
	this.classTimer = setTimeout(function(){
		els.clname.text(t.staticFunctions.capitalize(data.id));
		els.clvl.text(data.lvl);
		$.data(els.clname,'baseclassid',data.id);
		els.bclass.fadeIn(200,function(){
			setTimeout(function(){
				els.bclass.finish().fadeOut(300);
			},5000);
			
		});
	}, 500);
			
}

Darksouls.prototype.highlightnext = function(current) {
	$('.editable[tabindex="'+(parseInt(current) + 1)+'"]').focus().select();
}
Darksouls.prototype.initChar = function(data){
	
	var t = this;
	var c = t.characters.curChar;
	var els = this.elements.stats;
	for(var key in data) {
		if (data.hasOwnProperty(key) && typeof data[key] == 'number') {
			if(key != 'id'){
				els[key].val(data[key]);
				els[key].next().val(c.base[key]);
			}
		} else if (key == 'name'){
			t.elements.stats[key].val(data.base[key]); 
		}
	}
	t.armorFuncs.setArmor(t);
	t.rings.changeRingSlots();
	t.armorFuncs.calcAll(t);
	t.updateDefense();
	t.updateSouls();
	
	
	
	t.delegateStat.update('all',t);
	t.spellFuncs.setSpellElements(t);
	t.curCov.switchCov();
	t.setItemSels(c.id);
	//console.log(t.activeSpells);
	
	//console.log(t.activeSpells);
	
}
Darksouls.prototype.generateFormElements = function() {
	var t = this;
	
	var cls = t.characters.getAllClasses();
	
	var sc = '';
	for(var i = 0,len = cls.length;i<len;i++) {
		sc += '<option value="'+cls[i].name+'">'+t.staticFunctions.capitalize(cls[i].name)+'</option>';
	}
	
	t.elements.stats.name.append(sc);
	
	sc = '';
	var cls = t.covenants;
	for(var i = 0,len = cls.length;i<len;i++) {
		sc += '<option value="'+cls[i].id+'">'+cls[i].name+'</option>';
	}
	
	t.elements.stats.cov.append(sc);

	
	t.elements.rings.append(t.basicStringBuilder(t.ringData));
	t.elements.sitems.append(t.basicStringBuilder(t.itemData));
	t.elements.spellslots.append(t.genSpellList());
	
	$('#armor-h').append(t.basicStringBuilder(t.armorData.head))
	$('#armor-c').append(t.basicStringBuilder(t.armorData.chest))
	$('#armor-a').append(t.basicStringBuilder(t.armorData.arms))
	$('#armor-l').append(t.basicStringBuilder(t.armorData.legs))
}
Darksouls.prototype.basicStringBuilder = function(data) {
	var sc = '';
	for(var i = 0,len = data.length;i<len;i++) {
		sc += '<option value="'+i+'">'+data[i].name+'</option>';
	}
	
	return sc;
}
Darksouls.prototype.genSpellList = function() {
	
	var spells = this.spellData;
	
	var sort = [[],[],[]];
	
	for(var i = 1, len = spells.length;i<len;i++) {
		sort[spells[i].type].push('<option value="'+i+'">'+spells[i].name+'</option>');
	}
	
	var str = '<option value="0">'+spells[0].name+'</option>';
		str += '<optgroup label="Magic">' + sort[0].join('') + '</optgroup>'
		str += '<optgroup label="Pyromancy">' + sort[1].join('') + '</optgroup>'
		str += '<optgroup label="Miracles">' + sort[2].join('') + '</optgroup>'
	
	return str;
}
Darksouls.prototype.updateSouls = function(){
	var lvl = this.characters.curChar.curLev();
	var base = this.characters.curChar.base.lev;
	var tsl = this.stats.allLevelCost(lvl);
	var tsc = this.stats.nextLevelCost(lvl);
	var bsc = this.stats.allLevelCost(base);
	tsl -= bsc;
	
	this.elements.stats.tsc.val(tsl);
	this.elements.stats.csc.val(tsc);
	this.elements.stats.lev.val(lvl);
	
	this.characterTotals[this.characters.curChar.id].totalSoulCost = tsl;
	this.characterTotals[this.characters.curChar.id].nextLvlSouls = tsc;
}
Darksouls.prototype.updateChar = function(data){
	var t = this;
	var els = this.elements.stats;
	
	var event = data.namespace;
	var type = data.type;
	var update = data.character;
	
	if(typeof update.attrVal == 'number') {
		if(update.attrName != 'lev')
			t.elements.stats[update.attrName].val(update.attrVal);
	} else if(typeof update.attrVal == 'object') {
		var cur = update.attrVal;
		for(var i = 0, len = update.attrName.length;i<len;i++) {
			if(els.hasOwnProperty(update.attrName[i]) && update.attrName != 'lev')
			els[update.attrName[i]].val(update.attrVal[i]);
			els[update.attrName[i]].next().val(t.characters.curChar.base[update.attrName[i]]);
		}
	}
	
	t.updateSouls();
}

Darksouls.prototype.updateBChar = function(data){
	var cur = this.characters.curChar;
	var temp = {};
	var els = this.elements.stats;
	for(var key in cur) {
		if (cur.hasOwnProperty(key) && typeof cur[key] == 'number') {
			if(cur[key] < cur.base[key] && key != 'id' && key != 'hum'){
				temp[key] = cur.base[key];
			}
		}
	}
	
	cur.attr(temp);
}
Darksouls.prototype.updateDefense = function(){
	var def = this.defences.computeDef();

	var armor = this.armorFuncs.getAll();
	def.poise = armor.poise;
	def = this.applyEffects(def);

	
	var el = this.elements.defense;
	
	var cc = this.characterTotals[this.characters.curChar.id];
	
	cc.phy = Math.round((def.phy + armor.phy)*10)/10;
	cc.sti = Math.round((def.phy + armor.sti)*10)/10;
	cc.sla = Math.round((def.phy + armor.sla)*10)/10;
	cc.pie = Math.round((def.phy + armor.pie)*10)/10;
	
	cc.mag = Math.round((def.mag + armor.mag)*10)/10;
	cc.fla = Math.round((def.fla + armor.fla)*10)/10;
	cc.lig = Math.round((def.lig + armor.lig)*10)/10;
	cc.dar = Math.round((def.dar + armor.dar)*10)/10;
	
	cc.poison = Math.round((def.poison + armor.poison));
	cc.bleed = Math.round((def.bleed + armor.bleed));
	cc.petrify = Math.round((def.petrify + armor.petrify));
	cc.curse = Math.round((def.curse + armor.curse));
	
	el.phy.val(cc.phy + ' (' + Math.round(def.phy) + ')');
	el.sti.val(cc.sti);
	el.sla.val(cc.sla);
	el.pie.val(cc.pie);
	
	el.mag.val(cc.mag + ' (' + Math.round(def.mag) + ')');
	el.fla.val(cc.fla + ' (' + Math.round(def.fla) + ')');
	el.lig.val(cc.lig + ' (' + Math.round(def.lig) + ')');
	el.dar.val(cc.dar + ' (' + Math.round(def.dar) + ')');
	
	cc.poise = def.poise + this.naturalPoise();

	var elst = this.elements.stats;	
	
	elst.poison.val(cc.poison);
	elst.bleed.val(cc.bleed);
	elst.petrify.val(cc.petrify);
	elst.curse.val(cc.curse);
	elst.poise.val(cc.poise.toFixed(1));
}
Darksouls.prototype.naturalPoise = function(){
	var cur = this.characters.curChar;
	var end = cur.end, adp = cur.adp;
	
	var v = Math.min(end,adp);
	var val = 0;
	if(v <= 30)	
		val = (v * .3);
	else if(v > 30 && v <= 50)
		val = 9 + ((v-30) * .2);
	else if(v == 99)
		val = 18;
	else if(v > 50)
		val = 13 + ((v-50) * .1);
	
	return Math.round((val)*10)/10;
}
Darksouls.prototype.showEffects = function(){
	var t = this;
	var charId = t.characters.curChar.id;
	var activeRings = t.activeRings[charId], activeArmor = t.activeArmor[charId];
	
	var data = [t.ringData[activeRings[0]],t.ringData[activeRings[1]],t.ringData[activeRings[2]],t.ringData[activeRings[3]],t.armorData.head[activeArmor[0]]];
	var els = t.elements.stats.effs;
	var efs = [];
	var idar = {};
	
	for(var i = 0,len = data.length;i<len;i++) {
		var pos = false;
		var id = false;
		var ef = false;
		if(data[i].hasOwnProperty('statusID')) {
			pos = '-' + (data[i].statusID * 29) + 'px 0px';
			id = data[i].statusID;
			idar['t' + id] = pos;
			ef = true;
		}
		
		efs.push(ef);
	}
	
	var st = '<ul class="effects-list">';
	
	for(var g = 0,leg = efs.length;g < leg; g++){
		if(data[g].hasOwnProperty('effects')){
			for(var i = 0,len = data[g].effects.length;i<len;i++) {
				st += '<li>' + data[g].effects[i].effect + '</li>';
			}
		}
	}
	st += '</ul>';
	
	els.hide();
	var p = 0;
	for(var key in idar){
		if(idar.hasOwnProperty(key)){
			els.eq(p).show().css('backgroundPosition',idar[key]);
			p++;
		}
	}

	t.elements.efsbox[0].innerHTML = st;
}
Darksouls.prototype.applyEffects = function(alteringObject,effectsArray) {
	var def = alteringObject;
	var effects = [this.rings.getEffects(),this.armorFuncs.getEffects()];
	var muls = {};
	var adds = {};
	var subs = {};
	
	for(var i = 0,len=effects.length;i<len;i++) {
		for(var key in effects[i]) {
			if(effects[i].hasOwnProperty(key) && effects[i][key] !== false) {
				var alters = effects[i][key].alters;
				var method = effects[i][key].method;
				var val = effects[i][key].value;
				var str = effects[i][key].effect;
				
				if(def.hasOwnProperty(alters)) {
					switch(method) {
						case('add'):
							if(adds.hasOwnProperty(alters)){
								adds[alters].total.push(val);
							} else {
								adds[alters] = {
									total : [val]
								}
							}
						break;
						case('sub'):
							if(subs.hasOwnProperty(alters)){
								subs[alters].total.push(val);
							} else {
								subs[alters] = {
									total : [val]
								}
							}
						break;
						case('mul'):
							if(muls.hasOwnProperty(alters)){
								muls[alters].total.push(val);
							} else {
								muls[alters] = {
									total : [val]
								}
							}
						break;
					}
				}
			}
		}
	}
	var multiple = {};
	for(var key in muls) {
		if(muls.hasOwnProperty(key) && def.hasOwnProperty(key)){
			for(var i=0,len = muls[key].total.length; i<len; i++) {
				if(multiple.hasOwnProperty(key)) {
					multiple[key] *= muls[key].total[i];
				} else {
					multiple[key] = 1 * muls[key].total[i];
				}
			}
		}
	}
	for(var key in multiple) {
		if(multiple.hasOwnProperty(key)){
			def[key] = def[key] * multiple[key];
		}
	}
	for(var key in adds) {
		if(adds.hasOwnProperty(key)){
			for(var i=0,len = adds[key].total.length; i<len; i++) {
				def[key] += adds[key].total[i];
			}
		}
	}
	for(var key in subs) {
		if(subs.hasOwnProperty(key)){
			for(var i=0,len = subs[key].total.length; i<len; i++) {
				def[key] -= subs[key].total[i];
			}
		}
	}
	
	return def;
}

Darksouls.prototype.armorFuncs = (function(){
	return {
		curWeight : function(obj,i) {
			return (obj.armor[i].legs.weight + obj.armor[i].arms.weight + obj.armor[i].chest.weight + obj.armor[i].head.weight);
		},
		curPhy : function(obj,i) {
			return (obj.armor[i].legs.phy + obj.armor[i].arms.phy + obj.armor[i].chest.phy + obj.armor[i].head.phy);
		},
		curSti : function(obj,i) {
			return (obj.armor[i].legs.sti + obj.armor[i].arms.sti + obj.armor[i].chest.sti + obj.armor[i].head.sti);
		},
		curSla : function(obj,i) {
			return (obj.armor[i].legs.sla + obj.armor[i].arms.sla + obj.armor[i].chest.sla + obj.armor[i].head.sla);
		},
		curPie : function(obj,i) {
			return (obj.armor[i].legs.pie + obj.armor[i].arms.pie + obj.armor[i].chest.pie + obj.armor[i].head.pie);
		},
		curMag : function(obj,i) {
			return (obj.armor[i].legs.mag + obj.armor[i].arms.mag + obj.armor[i].chest.mag + obj.armor[i].head.mag);
		},
		curFla : function(obj,i) {
			return (obj.armor[i].legs.fla + obj.armor[i].arms.fla + obj.armor[i].chest.fla + obj.armor[i].head.fla);
		},
		curLig : function(obj,i) {
			return (obj.armor[i].legs.lig + obj.armor[i].arms.lig + obj.armor[i].chest.lig + obj.armor[i].head.lig);
		},
		curDar : function(obj,i) {
			return (obj.armor[i].legs.dar + obj.armor[i].arms.dar + obj.armor[i].chest.dar + obj.armor[i].head.dar);
		},
		curPoise : function(obj,i) {
			return (obj.armor[i].legs.poise + obj.armor[i].arms.poise + obj.armor[i].chest.poise + obj.armor[i].head.poise);
		},
		curBleed : function(obj,i) {
			return (obj.armor[i].legs.bleed + obj.armor[i].arms.bleed + obj.armor[i].chest.bleed + obj.armor[i].head.bleed);
		},
		curPetrify : function(obj,i) {
			return (obj.armor[i].legs.petrify + obj.armor[i].arms.petrify + obj.armor[i].chest.petrify + obj.armor[i].head.petrify);
		},
		curPoison : function(obj,i) {
			return (obj.armor[i].legs.poison + obj.armor[i].arms.poison + obj.armor[i].chest.poison + obj.armor[i].head.poison);
		},
		curCurse : function(obj,i) {
			return (obj.armor[i].legs.curse + obj.armor[i].arms.curse + obj.armor[i].chest.curse + obj.armor[i].head.curse);
		},
		curPen : function(obj,i) {
			return (obj.armor[i].legs.stamPen + obj.armor[i].arms.stamPen + obj.armor[i].chest.stamPen + obj.armor[i].head.stamPen);
		},
		calcAll : function(obj) {
			var v = obj;
			var t = obj.characters.curChar.id;
			this.updateArmorSet(obj);
			this.total = {
				weight: this.curWeight(v,t),
				phy: this.curPhy(v,t),
				sti: this.curSti(v,t),
				sla: this.curSla(v,t),
				pie: this.curPie(v,t),
				mag: this.curMag(v,t),
				fla: this.curFla(v,t),
				lig: this.curLig(v,t),
				dar: this.curDar(v,t),
				poise: this.curPoise(v,t),
				bleed: this.curBleed(v,t),
				petrify: this.curPetrify(v,t),
				poison: this.curPoison(v,t),
				curse: this.curCurse(v,t),
				stamPen : this.curPen(v,t)
			}
			this.calcEffects(v);
		},
		getAll : function() {
			return this.total;
		},
		calcEffects : function(obj) {
			//console.trace();
			var i = obj.characters.curChar.id;
			var counter = 0;
			this.effects = {};
			var pieces = ['head','chest','arms','legs'];
			for(var p=0;p<4;p++) {
				if(obj.armor[i][pieces[p]].hasOwnProperty('effects')) {
					var efs = obj.armor[i][pieces[p]].effects;
					for(var g = 0,len = efs.length;g<len;g++) {
						this.effects[pieces[p] + counter] = efs[g];
						counter++;
					}
					
				}
			}
		},
		getEffects : function() {
			return this.effects;
		},
		changePiece : function(obj,piece,armorObj){
			var i = obj.currentVariation;
			if(obj.armor[i].hasOwnProperty(piece)){
				obj.armor[i][piece] = armorObj;
				this.calcAll(obj);
				obj.updateDefense();
			}
		},
		updateArmorSet : function(obj) {
			var t = obj;
			var arm = [];
			for(var i=0;i<3;i++) {
				arm.push({
					head : t.armorData.head[t.activeArmor[i][0]],
					chest : t.armorData.chest[t.activeArmor[i][1]],
					arms : t.armorData.arms[t.activeArmor[i][2]],
					legs : t.armorData.legs[t.activeArmor[i][3]]
				});
			}
			obj.armor = arm;
		},
		setArmor : function(t) {
			var i = t.characters.curChar.id;
			//console.log(t.activeArmor[i][0]);
			t.elements.armor.head.val(t.activeArmor[i][0]);
			t.elements.armor.chest.val(t.activeArmor[i][1]);
			t.elements.armor.arms.val(t.activeArmor[i][2]);
			t.elements.armor.legs.val(t.activeArmor[i][3]);
			if(t.options.alphaSelects && t.options.runalphaSelects) {
				t.elements.armor.head.alphaSelects('setToIndex',t.activeArmor[i][0]);
				t.elements.armor.chest.alphaSelects('setToIndex',t.activeArmor[i][1]);
				t.elements.armor.arms.alphaSelects('setToIndex',t.activeArmor[i][2]);
				t.elements.armor.legs.alphaSelects('setToIndex',t.activeArmor[i][3]);
			}
		}
	}
})();

Darksouls.prototype.revertCharacter = function(){

	var base = {};
	var t = this;
	var cur = this.characters.curChar.base;
	var id = this.characters.curChar.id;
	
	this.elements.stats.bclass.finish().hide();
	for(var key in cur) {
		if(cur.hasOwnProperty(key) && typeof cur[key] == 'number' && key != 'id') {
			base[key] = cur[key];
			this.elements.stats[key].val(cur[key]);
		}
	}
	
	t.activeWeapons[id] = [0,0,0,0];
	t.activeWepPaths[id] = [0,0,0,0];
	t.activeWepUpgrade[id] = [0,0,0,0];
	t.activeArmor[id] = [0,0,0,0];
	t.activeArmUpgrade[id] = [0,0,0,0];
	t.activeRings[id] = [0,0,0,0];
	t.rings.setRings([0,0,0,0]);
	t.curCov.setCov(0);
	t.activeSpells[id] = [];
	
	if(t.options.alphaSelects) {
		t.elements.rings.alphaSelects('setToIndex',0);
		t.elements.stats.cov.alphaSelects('setToIndex',0);
		t.elements.spellslots.alphaSelects('setToIndex',0);
		t.elements.sitems.alphaSelects('setToIndex',0);
		t.elements.armor.head.alphaSelects('setToIndex',0);
	}
	
	$.extend(this.characters.curChar,base);
	
	this.initChar();
	
	this.showEffects();
	
}

Darksouls.prototype.elements = (function(){
	var $ = jQuery;
	return {
		stats : {
			name : $('#classname'),
			lev : $('#slv'),
			vig : $('#vig'),
			end : $('#end'),
			vit : $('#vit'),
			att : $('#att'),
			str : $('#str'),
			dex : $('#dex'),
			adp : $('#adp'),
			nnt : $('#nnt'),
			fai : $('#fai'),
			csc : $('#csc'),
			tsc : $('#tsc'),
			cov : $('#covenant'),
			stam : $('#stam'),
			eqp : $('#eqp'),
			hp : $('#hp'),
			poise : $('#poise'),
			bleed : $('#bleed'),
			petrify : $('#petrify'),
			poison : $('#poison'),
			curse : $('#curse'),
			item : $('#item'),
			slots : $('#slots'),
			
			eper : $('#eper'),
			ewig : $('#ewig'),
			eroll : $('#eroll'),
			
			effs : $('.status-icons'),
			
			bclass : $('#bestclass'),
			clname : $('#class-name'),
			clvl : $('#class-lvl'),
			
			stmt : $('#stamin'),
			stmr : $('#stamtime'),
			
			casts : $('#casts'),
			agility : $('#agility'),
			atkstr : $('#atkstr'),
			atkdex : $('#atkdex'),
			magicbns : $('#magicbns'),
			firebns : $('#firebns'),
			ligbns : $('#ligbns'),
			darbns : $('#darbns'),
			poisonbns : $('#poisonbns'),
			bleedbns : $('#bleedbns')
			
		},
		defense : {
			phy : $('#phy-def'),
			sti : $('#phy-sti'),
			sla : $('#phy-sla'),
			pie : $('#phy-pie'),
			
			mag : $('#mag-def'),
			fla : $('#fla-def'),
			lig : $('#lig-def'),
			dar : $('#dar-def')
		},
		rings : $('.ring'),
		link : $('#link64'),
		efsbox : $('#status-effects-box'),
		sitems  : $('.s-items'),
		spellslots  : $('.spells'),
		armor : {
			head: $('#armor-h'),
			chest: $('#armor-c'),
			arms: $('#armor-a'),
			legs: $('#armor-l')
		}
	}
})();

Darksouls.prototype.graphs = function(){
	var t = this;
	var costs = [0,500,528,557,587,619,653,689,727,767,810,854,901,948,997,1049,1104,1159,1217,1278,1341,1408,1479,1553,1631,1699,1770,1845,1922,2003,2087,2175,2266,2361,2460,2564,2671,2784,2900,3022,3149,3256,3367,3482,3600,3722,3849,3980,4115,4255,4400,4549,4704,4864,5029,5200,5330,5463,5600,5740,5883,6031,6181,6336,6494,6657,6823,6994,7168,7348,7531,7697,7866,8039,8216,8397,8582,8771,8964,9161,9362,9568,9779,9994,10214,10438,10668,10903,11143,11388,11638,11836,12037,12242,12450,12662,12877,13096,13319,13545,13775,14009,14248,14490,14736,14987,15241,15501,15764,16032,16305,16582,16864,17150,17442,17738,18005,18275,18549,18827,19109,19396,19687,19982,20282,20586,20895,21208,21527,21849,22177,22510,22847,23190,23538,23891,24249,24613,24982,25357,25738,26124,26515,26913,27317,27727,28143,28565,28993,29428,29869,30317,30772,31234,31702,32178,32661,33150,33648,34152,34665,35185,35712,36248,36792,37344,37904,38472,39050,39635,40230,40713,41201,41696,42196,42702,43215,43733,44258,44789,45327,45689,46055,46423,46795,47169,47546,47927,48310,48697,49086,49479,49875,50274,50676,51081,51490,51902,52317,52736,53157,55018,56944,58937,60999,63134,65344,67631,69998,72448,74984,77608,80324,83136,86046,89057,92174,95400,98739,102195,105772,109474,113306,117271,121376,125624,130021,134572,139282,144156,149202,154424,159829,165423,171213,177205,183407,189826,196470,203347,210464,217830,225454,233345,241512,249965,258714,267769,277141,286841,296880,297622,298367,299112,299860,300610,301361,302115,302870,303627,304386,305147,305910,306675,307442,308210,308981,309753,310528,311304,312082,312862,313645,314429,315215,316003,316793,317585,318379,319175,319973,320772,321574,322378,323184,323992,324802,325614,326428,327244,328062,328883,329705,330529,331355,332184,333014,333847,334681,335518,336357,337198,338041,338886,339733,340582,341434,342287,343143,344001,344861,345723,346588,347454,348323,349193,350066,350942,351819,352698,353580,354464,355350,356239,357129,358022,358917,359814,360714,361616,362520,363426,364335,365246,366159,367074,367992,368912,369834,370759,371685,372615,373546,374480,375416,376355,377296,378239,379185,380133,381083,382036,382991,383948,384908,385870,386835,387802,388772,389743,390718,391695,392674,393656,394640,395626,396615,397607,398601,399597,400596,401598,402602,403608,404617,405629,406643,407660,408679,409700,410725,411752,412781,413813,414847,415885,416924,417967,419011,420059,421109,422162,423217,424275,425336,426399,427465,428534,429605,430679,431756,432835,433918,435002,436090,437180,438273,439369,440467,441568,442672,443779,444888,446001,447116,448233,449354,450477,451604,452733,453864,454999,456137,457277,458420,459566,460715,461867,463022,464179,465340,466503,467669,468838,470010,471185,472363,473544,474728,475915,477105,478298,479493,480692,481894,483098,484306,485517,486731,487948,489167,490390,491616,492845,494078,495313,496551,497792,499037,500284,501535,502789,504046,505306,506569,507836,509105,510378,511654,512933,514216,515501,516790,518082,519377,520675,521977,523282,524590,525902,527217,528535,529856,531181,532508,533840,535174,536512,537854,539198,540546,541898,543252,544610,545972,547337,548705,550077,551452,552831,554213,555598,556987,558380,559776,561175,562578,563985,565395,566808,568225,569646,571070,572497,573929,575364,576802,578244,579690,581139,582592,584048,585508,586972,588439,589911,591385,592864,594346,595832,597321,598815,600312,601812,603317,604825,606337,607853,609373,610896,612424,613955,615489,617028,618571,620117,621667,623222,624780,626342,627908,629477,631051,632629,634210,635796,637385,638979,640576,642178,643783,645392,647006,648623,650245,651871,653500,655134,656772,658414,660060,661710,663364,665023,666685,668352,670023,671698,673377,675061,676748,678440,680136,681837,683541,685250,686963,688681,690402,692128,693859,695593,697332,699075,700823,702575,704332,706093,707858,709627,711401,713180,714963,716750,718542,720339,722139,723945,725755,727569,729388,731211,733039,734872,736709,738551,740397,742248,744104,745964,747829,749699,751573,753452,755336,757224,759117,761015,762917,764825,766737,768653,770575,772502,774433,776369,778310,780256,782206,784162,786122,788087,790058,792033,794013,795998,797988,799983,801983,803988,805998,808013,810033,812058,814088,816123,818164,820209,822259,824315,826376,828442,830513,832589,834671,836757,838849,840946,843049,845156,847269,849387,851511,853640,855774,857913,860058,862208,864364,866525,868691,870863,873040,875222,877410,879604,881803,884007,886217,888433,890654,892881,895113,897351,899594,901843,904098,906358,908624,910895,913173,915456,917744,920039,922339,924644,926956,929273,931597,933926,936260,938601,940948,943300,945658,948022,950392,952768,955150,957538,959932,962332,964738,967150,969567,971991,974421,976857,979300,981748,984202,986663,989129,991602,994081,996566,999058,1001555,1004059,1006569,1009086,1011609,1014138,1016673,1019215,1021763,1024317,1026878,1029445,1032019,1034599,1037185,1039778,1042378,1044984,1047596,1050215,1052841,1055473,1058111,1060757,1063409,1066067,1068732,1071404,1074083,1076768,1079460,1082158,1084864,1087576,1090295,1093021,1095753,1098492,1101239,1103992,1106752,1109519,1112292,1115073,1117861,1120656,1123457,1126266,1129081,1131904,1134734,1137571,1140415,1143266,1146124,1148989,1151862,1154741,1157628,1160522,1163424,1166332,1169248,1172171,1175102,1178039,1180984,1183937,1186897,1189864,1192839,1195821,1198810,1201807,1204812,1207824,1210843,1213870,1216905,1219947,1222997,1226055,1229120,1232193,1235273,1238361,1241457,1244561,1247672,1250792,1253918,1257053,1260196,1263346,1266505,1269671,1272845,1276027,1279217,1282415,1285621,1288836,1292058,1295288,1298526,1301772,1305027,1308289,1311560,1314839,1318126,1321421,1324725,1328037];
		
		var nextLevelCost = function(value){
				return costs[value];
			}
		
		return {

			nextLevelCost : function(value){
				return costs[value];
			},
			allLevelCost : function(value){
				
				function compute(lvl){
					var val = 0;
					for(var i = 0,v = lvl;v>i;v--){
						val += nextLevelCost(v);
					}
					return val;
				}
				
				return compute(value - 1);
			},
		}
	};
/*
 *  Defform
 *  Functions used for calculating base defences of the current character
 *  this.characters.curChar;
 *  
 */	
Darksouls.prototype.defform = function(){
	var t = this;
	/*
	 *  Name spaced functions for internal use of defence calculation
	 *  Requires use of this.DefenseGraph and curChar
	 *  
	 */
	 
	 
	var phy = [0,0,0,0,0,0,70,72,75,77,80,81,82,83,84,85,86,87,89,90,91,93,95,97,99,102,104,106,108,110,113,115,118,121,124,127,130,133,136,139,142,143,145,147,149,151,152,154,156,158,160,160,160,161,161,161,162,162,163,163,163,164,165,165,166,167,168,168,169,170,171,172,173,175,176,178,179,181,182,184,185,186,186,187,188,189,189,190,191,192,192,193,194,195,195,196,197,198,199,200]
	var defs = [0,6,12,18,24,30,36,42,48,54,60,68,76,84,92,100,108,116,124,132,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,180,181,181,182,182,183,183,184,184,185,185,186,186,187,187,188,188,189,189,190,190,191,191,192,192,193,193,194,194,195,195,196,196,197,197,198,198,199,200]

	 
	var ComputeBasePhysicalDefense = function(playerData){
		var i = Math.floor((playerData.vit + playerData.end + playerData.str + playerData.dex) / 4);
		var value = phy[i];

		return value;
	}
    var ComputeBaseMagicalDefense = function(playerData){
		return defs[playerData.nnt];
	}
    var ComputeBaseFlameDefense = function(playerData){
		return defs[Math.floor((playerData.nnt + playerData.fai) / 2 )];
	}
    var ComputeBaseLightningDefense = function(playerData){
		return defs[playerData.fai];
    }
    var ComputeBaseDarkDefense = function(playerData){
		return defs[Math.min(playerData.nnt,playerData.fai)];
    }
	
	var ComputeResistance = function(playerDataStat,playerDataAdp){
		var val = Math.round(((playerDataAdp * 3.5) + playerDataStat) / 4.5);
		return defs[val]
		
	}
	
	return {
		computePhyDef : function(){
			return value = ComputeBasePhysicalDefense(t.characters.curChar);
		},
		computeMagDef : function(){
			return ComputeBaseMagicalDefense(t.characters.curChar);
		},
		computeFlaDef : function(){
			return ComputeBaseFlameDefense(t.characters.curChar);
		},
		computeLigDef : function(){
			return ComputeBaseLightningDefense(t.characters.curChar);
		},
		computeDarDef : function(){
			return ComputeBaseDarkDefense(t.characters.curChar);
		},
		computePoison : function() {
			return ComputeResistance(t.characters.curChar.vit,t.characters.curChar.adp);
		},
		computeBleed : function() {
			return ComputeResistance(t.characters.curChar.fai,t.characters.curChar.adp);
		},
		computePetrify : function() {
			return ComputeResistance(t.characters.curChar.vig,t.characters.curChar.adp);
		},
		computeCurse : function() {
			return ComputeResistance(t.characters.curChar.att,t.characters.curChar.adp);
		},
		computeDef : function(){
			return {
				phy : this.computePhyDef(),
				mag : this.computeMagDef(),
				fla : this.computeFlaDef(),
				lig : this.computeLigDef(),
				dar : this.computeDarDef(),
				poison : this.computePoison(),
				bleed : this.computeBleed(),
				petrify : this.computePetrify(),
				curse : this.computeCurse()
			}
		}
	
	}
	
};

Darksouls.prototype.genBase64 = function() {
	var t = this, c = [],
	vars = t.variations;
	for(var i=0,len = vars.length;i<len;i++){
		var chr = vars[i];
		var id = chr.id;
		c.push({});
		c[i].clss = t.characters.getClassId(chr.name);  
		for(var key in chr) {
			if(chr.hasOwnProperty(key) && typeof chr[key] == 'number' && key != 'id') {
				if(chr[key] > chr.base[key])
					c[i][key] = chr[key]
			}
		}
		c[i].weaponIds = t.activeWeapons[id];
		c[i].weaponPths = t.activeWepPaths[id];
		c[i].weaponUps = t.activeWepUpgrade[id];
		c[i].armorIds = t.activeArmor[id];
		c[i].armorUps = t.activeArmUpgrade[id];
		c[i].rings = t.activeRings[id];
		c[i].cov = t.curCov.covenant[id];
		c[i].items = t.activeItems[id];
		c[i].spells = t.activeSpells[id];
	}
	
	var data = t.staticFunctions.LZString.compressToBase64(JSON.stringify(c));
	t.elements.link.val(t.baseURL + "build/" + data.replace(/\//g,'===='));
	
	
}
Darksouls.prototype.genFromBase64 = function(){
	var base = this.buildHash;
	var t = this;
	if(base === false)
		return false;
		
	var data = false;
	try {
		data = JSON.parse(t.staticFunctions.LZString.decompressFromBase64(base));
	} catch(d) {
		data = this.parseFromOld();
	}

	if(data !== false){
		var charobs = [];
		
		for(var i = 0,len = data.length;i<len;i++) {
			charobs.push({});
			var c = charobs[i];
			var d = data[i];
			
			for(var key in d) {
				if(d.hasOwnProperty(key) && typeof d[key] == 'number') {
					c[key] = d[key];
				}
			}
			
			t.activeWeapons[i] = d.weaponIds
			t.activeWepPaths[i] = d.weaponPths;
			t.activeWepUpgrade[i] = d.weaponUps;
			t.activeArmor[i] = d.armorIds;
			t.activeArmUpgrade[i] = d.armorUps;
			t.activeRings[i] = d.rings;
			t.activeSpells[i] = d.spells;
			t.activeItems[i] = d.items;
			
		}
		return charobs;
	}
	
}
Darksouls.prototype.parseFromOld = function(){
	return 2;
}
Darksouls.prototype.staticFunctions = (function($){
	return {
		LZString : {
		  // private property
		  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		  _f : String.fromCharCode,
		  
		  compressToBase64 : function (input) {
			if (input == null) return "";
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
			
			input = this.compress(input);
			
			while (i < input.length*2) {
			  
			  if (i%2==0) {
				chr1 = input.charCodeAt(i/2) >> 8;
				chr2 = input.charCodeAt(i/2) & 255;
				if (i/2+1 < input.length)
				  chr3 = input.charCodeAt(i/2+1) >> 8;
				else
				  chr3 = NaN;
			  } else {
				chr1 = input.charCodeAt((i-1)/2) & 255;
				if ((i+1)/2 < input.length) {
				  chr2 = input.charCodeAt((i+1)/2) >> 8;
				  chr3 = input.charCodeAt((i+1)/2) & 255;
				} else
				  chr2=chr3=NaN;
			  }
			  i+=3;
			  
			  enc1 = chr1 >> 2;
			  enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			  enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			  enc4 = chr3 & 63;
			  
			  if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			  } else if (isNaN(chr3)) {
				enc4 = 64;
			  }
			  
			  output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				  this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
			  
			}
			
			return output;
		  },
		  
		  decompressFromBase64 : function (input) {
			if (input == null) return "";
			var output = "",
				ol = 0,
				output_,
				chr1, chr2, chr3,
				enc1, enc2, enc3, enc4,
				i = 0, f=this._f;
			
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			
			while (i < input.length) {
			  
			  enc1 = this._keyStr.indexOf(input.charAt(i++));
			  enc2 = this._keyStr.indexOf(input.charAt(i++));
			  enc3 = this._keyStr.indexOf(input.charAt(i++));
			  enc4 = this._keyStr.indexOf(input.charAt(i++));
			  
			  chr1 = (enc1 << 2) | (enc2 >> 4);
			  chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			  chr3 = ((enc3 & 3) << 6) | enc4;
			  
			  if (ol%2==0) {
				output_ = chr1 << 8;
				
				if (enc3 != 64) {
				  output += f(output_ | chr2);
				}
				if (enc4 != 64) {
				  output_ = chr3 << 8;
				}
			  } else {
				output = output + f(output_ | chr1);
				
				if (enc3 != 64) {
				  output_ = chr2 << 8;
				}
				if (enc4 != 64) {
				  output += f(output_ | chr3);
				}
			  }
			  ol+=3;
			}
			
			return this.decompress(output);
			
		  },

		  compressToUTF16 : function (input) {
			if (input == null) return "";
			var output = "",
				i,c,
				current,
				status = 0,
				f = this._f;
			
			input = this.compress(input);
			
			for (i=0 ; i<input.length ; i++) {
			  c = input.charCodeAt(i);
			  switch (status++) {
				case 0:
				  output += f((c >> 1)+32);
				  current = (c & 1) << 14;
				  break;
				case 1:
				  output += f((current + (c >> 2))+32);
				  current = (c & 3) << 13;
				  break;
				case 2:
				  output += f((current + (c >> 3))+32);
				  current = (c & 7) << 12;
				  break;
				case 3:
				  output += f((current + (c >> 4))+32);
				  current = (c & 15) << 11;
				  break;
				case 4:
				  output += f((current + (c >> 5))+32);
				  current = (c & 31) << 10;
				  break;
				case 5:
				  output += f((current + (c >> 6))+32);
				  current = (c & 63) << 9;
				  break;
				case 6:
				  output += f((current + (c >> 7))+32);
				  current = (c & 127) << 8;
				  break;
				case 7:
				  output += f((current + (c >> 8))+32);
				  current = (c & 255) << 7;
				  break;
				case 8:
				  output += f((current + (c >> 9))+32);
				  current = (c & 511) << 6;
				  break;
				case 9:
				  output += f((current + (c >> 10))+32);
				  current = (c & 1023) << 5;
				  break;
				case 10:
				  output += f((current + (c >> 11))+32);
				  current = (c & 2047) << 4;
				  break;
				case 11:
				  output += f((current + (c >> 12))+32);
				  current = (c & 4095) << 3;
				  break;
				case 12:
				  output += f((current + (c >> 13))+32);
				  current = (c & 8191) << 2;
				  break;
				case 13:
				  output += f((current + (c >> 14))+32);
				  current = (c & 16383) << 1;
				  break;
				case 14:
				  output += f((current + (c >> 15))+32, (c & 32767)+32);
				  status = 0;
				  break;
			  }
			}
			
			return output + f(current + 32);
		  },
		  

		  decompressFromUTF16 : function (input) {
			if (input == null) return "";
			var output = "",
				current,c,
				status=0,
				i = 0,
				f = this._f;
			
			while (i < input.length) {
			  c = input.charCodeAt(i) - 32;
			  
			  switch (status++) {
				case 0:
				  current = c << 1;
				  break;
				case 1:
				  output += f(current | (c >> 14));
				  current = (c&16383) << 2;
				  break;
				case 2:
				  output += f(current | (c >> 13));
				  current = (c&8191) << 3;
				  break;
				case 3:
				  output += f(current | (c >> 12));
				  current = (c&4095) << 4;
				  break;
				case 4:
				  output += f(current | (c >> 11));
				  current = (c&2047) << 5;
				  break;
				case 5:
				  output += f(current | (c >> 10));
				  current = (c&1023) << 6;
				  break;
				case 6:
				  output += f(current | (c >> 9));
				  current = (c&511) << 7;
				  break;
				case 7:
				  output += f(current | (c >> 8));
				  current = (c&255) << 8;
				  break;
				case 8:
				  output += f(current | (c >> 7));
				  current = (c&127) << 9;
				  break;
				case 9:
				  output += f(current | (c >> 6));
				  current = (c&63) << 10;
				  break;
				case 10:
				  output += f(current | (c >> 5));
				  current = (c&31) << 11;
				  break;
				case 11:
				  output += f(current | (c >> 4));
				  current = (c&15) << 12;
				  break;
				case 12:
				  output += f(current | (c >> 3));
				  current = (c&7) << 13;
				  break;
				case 13:
				  output += f(current | (c >> 2));
				  current = (c&3) << 14;
				  break;
				case 14:
				  output += f(current | (c >> 1));
				  current = (c&1) << 15;
				  break;
				case 15:
				  output += f(current | c);
				  status=0;
				  break;
			  }
			  
			  
			  i++;
			}
			
			return this.decompress(output);
			//return output;
			
		  },


		  
		  compress: function (uncompressed) {
			if (uncompressed == null) return "";
			var i, value,
				context_dictionary= {},
				context_dictionaryToCreate= {},
				context_c="",
				context_wc="",
				context_w="",
				context_enlargeIn= 2, // Compensate for the first entry which should not count
				context_dictSize= 3,
				context_numBits= 2,
				context_data_string="",
				context_data_val=0,
				context_data_position=0,
				ii,
				f=this._f;
			
			for (ii = 0; ii < uncompressed.length; ii += 1) {
			  context_c = uncompressed.charAt(ii);
			  if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
				context_dictionary[context_c] = context_dictSize++;
				context_dictionaryToCreate[context_c] = true;
			  }
			  
			  context_wc = context_w + context_c;
			  if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
				context_w = context_wc;
			  } else {
				if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
				  if (context_w.charCodeAt(0)<256) {
					for (i=0 ; i<context_numBits ; i++) {
					  context_data_val = (context_data_val << 1);
					  if (context_data_position == 15) {
						context_data_position = 0;
						context_data_string += f(context_data_val);
						context_data_val = 0;
					  } else {
						context_data_position++;
					  }
					}
					value = context_w.charCodeAt(0);
					for (i=0 ; i<8 ; i++) {
					  context_data_val = (context_data_val << 1) | (value&1);
					  if (context_data_position == 15) {
						context_data_position = 0;
						context_data_string += f(context_data_val);
						context_data_val = 0;
					  } else {
						context_data_position++;
					  }
					  value = value >> 1;
					}
				  } else {
					value = 1;
					for (i=0 ; i<context_numBits ; i++) {
					  context_data_val = (context_data_val << 1) | value;
					  if (context_data_position == 15) {
						context_data_position = 0;
						context_data_string += f(context_data_val);
						context_data_val = 0;
					  } else {
						context_data_position++;
					  }
					  value = 0;
					}
					value = context_w.charCodeAt(0);
					for (i=0 ; i<16 ; i++) {
					  context_data_val = (context_data_val << 1) | (value&1);
					  if (context_data_position == 15) {
						context_data_position = 0;
						context_data_string += f(context_data_val);
						context_data_val = 0;
					  } else {
						context_data_position++;
					  }
					  value = value >> 1;
					}
				  }
				  context_enlargeIn--;
				  if (context_enlargeIn == 0) {
					context_enlargeIn = Math.pow(2, context_numBits);
					context_numBits++;
				  }
				  delete context_dictionaryToCreate[context_w];
				} else {
				  value = context_dictionary[context_w];
				  for (i=0 ; i<context_numBits ; i++) {
					context_data_val = (context_data_val << 1) | (value&1);
					if (context_data_position == 15) {
					  context_data_position = 0;
					  context_data_string += f(context_data_val);
					  context_data_val = 0;
					} else {
					  context_data_position++;
					}
					value = value >> 1;
				  }
				  
				  
				}
				context_enlargeIn--;
				if (context_enlargeIn == 0) {
				  context_enlargeIn = Math.pow(2, context_numBits);
				  context_numBits++;
				}
				// Add wc to the dictionary.
				context_dictionary[context_wc] = context_dictSize++;
				context_w = String(context_c);
			  }
			}
			
			// Output the code for w.
			if (context_w !== "") {
			  if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
				if (context_w.charCodeAt(0)<256) {
				  for (i=0 ; i<context_numBits ; i++) {
					context_data_val = (context_data_val << 1);
					if (context_data_position == 15) {
					  context_data_position = 0;
					  context_data_string += f(context_data_val);
					  context_data_val = 0;
					} else {
					  context_data_position++;
					}
				  }
				  value = context_w.charCodeAt(0);
				  for (i=0 ; i<8 ; i++) {
					context_data_val = (context_data_val << 1) | (value&1);
					if (context_data_position == 15) {
					  context_data_position = 0;
					  context_data_string += f(context_data_val);
					  context_data_val = 0;
					} else {
					  context_data_position++;
					}
					value = value >> 1;
				  }
				} else {
				  value = 1;
				  for (i=0 ; i<context_numBits ; i++) {
					context_data_val = (context_data_val << 1) | value;
					if (context_data_position == 15) {
					  context_data_position = 0;
					  context_data_string += f(context_data_val);
					  context_data_val = 0;
					} else {
					  context_data_position++;
					}
					value = 0;
				  }
				  value = context_w.charCodeAt(0);
				  for (i=0 ; i<16 ; i++) {
					context_data_val = (context_data_val << 1) | (value&1);
					if (context_data_position == 15) {
					  context_data_position = 0;
					  context_data_string += f(context_data_val);
					  context_data_val = 0;
					} else {
					  context_data_position++;
					}
					value = value >> 1;
				  }
				}
				context_enlargeIn--;
				if (context_enlargeIn == 0) {
				  context_enlargeIn = Math.pow(2, context_numBits);
				  context_numBits++;
				}
				delete context_dictionaryToCreate[context_w];
			  } else {
				value = context_dictionary[context_w];
				for (i=0 ; i<context_numBits ; i++) {
				  context_data_val = (context_data_val << 1) | (value&1);
				  if (context_data_position == 15) {
					context_data_position = 0;
					context_data_string += f(context_data_val);
					context_data_val = 0;
				  } else {
					context_data_position++;
				  }
				  value = value >> 1;
				}
				
				
			  }
			  context_enlargeIn--;
			  if (context_enlargeIn == 0) {
				context_enlargeIn = Math.pow(2, context_numBits);
				context_numBits++;
			  }
			}
			
			// Mark the end of the stream
			value = 2;
			for (i=0 ; i<context_numBits ; i++) {
			  context_data_val = (context_data_val << 1) | (value&1);
			  if (context_data_position == 15) {
				context_data_position = 0;
				context_data_string += f(context_data_val);
				context_data_val = 0;
			  } else {
				context_data_position++;
			  }
			  value = value >> 1;
			}
			
			// Flush the last char
			while (true) {
			  context_data_val = (context_data_val << 1);
			  if (context_data_position == 15) {
				context_data_string += f(context_data_val);
				break;
			  }
			  else context_data_position++;
			}
			return context_data_string;
		  },
		  
		  decompress: function (compressed) {
			if (compressed == null) return "";
			if (compressed == "") return null;
			var dictionary = [],
				next,
				enlargeIn = 4,
				dictSize = 4,
				numBits = 3,
				entry = "",
				result = "",
				i,
				w,
				bits, resb, maxpower, power,
				c,
				f = this._f,
				data = {string:compressed, val:compressed.charCodeAt(0), position:32768, index:1};
			
			for (i = 0; i < 3; i += 1) {
			  dictionary[i] = i;
			}
			
			bits = 0;
			maxpower = Math.pow(2,2);
			power=1;
			while (power!=maxpower) {
			  resb = data.val & data.position;
			  data.position >>= 1;
			  if (data.position == 0) {
				data.position = 32768;
				data.val = data.string.charCodeAt(data.index++);
			  }
			  bits |= (resb>0 ? 1 : 0) * power;
			  power <<= 1;
			}
			
			switch (next = bits) {
			  case 0:
				  bits = 0;
				  maxpower = Math.pow(2,8);
				  power=1;
				  while (power!=maxpower) {
					resb = data.val & data.position;
					data.position >>= 1;
					if (data.position == 0) {
					  data.position = 32768;
					  data.val = data.string.charCodeAt(data.index++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				  }
				c = f(bits);
				break;
			  case 1:
				  bits = 0;
				  maxpower = Math.pow(2,16);
				  power=1;
				  while (power!=maxpower) {
					resb = data.val & data.position;
					data.position >>= 1;
					if (data.position == 0) {
					  data.position = 32768;
					  data.val = data.string.charCodeAt(data.index++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				  }
				c = f(bits);
				break;
			  case 2:
				return "";
			}
			dictionary[3] = c;
			w = result = c;
			while (true) {
			  if (data.index > data.string.length) {
				return "";
			  }
			  
			  bits = 0;
			  maxpower = Math.pow(2,numBits);
			  power=1;
			  while (power!=maxpower) {
				resb = data.val & data.position;
				data.position >>= 1;
				if (data.position == 0) {
				  data.position = 32768;
				  data.val = data.string.charCodeAt(data.index++);
				}
				bits |= (resb>0 ? 1 : 0) * power;
				power <<= 1;
			  }

			  switch (c = bits) {
				case 0:
				  bits = 0;
				  maxpower = Math.pow(2,8);
				  power=1;
				  while (power!=maxpower) {
					resb = data.val & data.position;
					data.position >>= 1;
					if (data.position == 0) {
					  data.position = 32768;
					  data.val = data.string.charCodeAt(data.index++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				  }

				  dictionary[dictSize++] = f(bits);
				  c = dictSize-1;
				  enlargeIn--;
				  break;
				case 1:
				  bits = 0;
				  maxpower = Math.pow(2,16);
				  power=1;
				  while (power!=maxpower) {
					resb = data.val & data.position;
					data.position >>= 1;
					if (data.position == 0) {
					  data.position = 32768;
					  data.val = data.string.charCodeAt(data.index++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				  }
				  dictionary[dictSize++] = f(bits);
				  c = dictSize-1;
				  enlargeIn--;
				  break;
				case 2:
				  return result;
			  }
			  
			  if (enlargeIn == 0) {
				enlargeIn = Math.pow(2, numBits);
				numBits++;
			  }
			  
			  if (dictionary[c]) {
				entry = dictionary[c];
			  } else {
				if (c === dictSize) {
				  entry = w + w.charAt(0);
				} else {
				  return null;
				}
			  }
			  result += entry;
			  
			  // Add w+entry[0] to the dictionary.
			  dictionary[dictSize++] = w + entry.charAt(0);
			  enlargeIn--;
			  
			  w = entry;
			  
			  if (enlargeIn == 0) {
				enlargeIn = Math.pow(2, numBits);
				numBits++;
			  }
			  
			}
		  }
		},
		capitalize : function(str) {
			return str.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
		}
	}
})(jQuery);


//(new Darksouls);


(function($){
	$('form').on('submit',function(){return false;});
})(jQuery);

