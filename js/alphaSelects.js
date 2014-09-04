;(function( $, window, document, undefined ) {
	var plugInName = 'alphaSelects'
	
		
	
	var alphaAbstracted = function( obj, data ) {
	
		this.options = {
			data: false,
			baseTemplate: '<div class="alpha-select alpha-select-container" data-index="{index}" id="alpha-select-{id}" style="position: absolute;width: {width}px; top: {top}px; left: {left}px;"> {displayTemplate} <div class="alpha-select-dropout"><div class="alpha-search-container hide-on-mobile"><div class="alpha-search-box"><input type="text" autocomplete="off"></div></div><div class="alpha-results-box"> {optionTemplate} </div></div></div>',
			optionTemplate: '<div data-for="{index}"><img src="{srcImg}" style="background-image: url({imageSprite}); background-position: {offset}"><div class="alpha-results-text">{name}</div><div class="alpha-results-text alpha-sub-text">Req ({str}/{dex}/{mag}/{fai}) :: {weight} Weight</div></div>',
			displayTemplate: '<div class="alpha-select-text"><div class="alpha-image"><img src="{srcImg}" style="background-image: url({imageSprite}); background-position: {offset}"></div><span class="alpha-text">{name}</span><div class="alpha-arrow"></div></div>',
			searchThreshold: 10,
			spriteColumns: 10,
			spriteRows: 0,
			spriteImageWidth: 20,
			spriteImageHeight: 20,
			srcImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi+P//PwNAgAEACPwC/tuiTRYAAAAASUVORK5CYII=',
			imageSprite: '',
			backgroundImage: false,
			delayOptions: true,
			optionProps: false,
			sortFunction: false,
			dataforkey: false,
			groupBy: false,
			groupTitles: false
		};
	
		this.optionChildren = [];
		
		var opts = $.extend(true,this.options,data);
		this.init(opts, obj);
		
		this.test = function(){
			return 1;
		}
	}
	
	
	
	alphaAbstracted.prototype.init = function( data, obj ) {
		//console.log( data, obj );
		if(false === data.data)
			data.data = this.buildFromOptions(obj);
		
		var str = this.buildSelectBase(data.data, obj);
		if(false === data.delayOptions)
			str = this.fmt(str,this.buildSelectOptions(data.data, obj));
			
		obj.after(str);
		
		this.boundEvents(obj, data);
		
	}
	alphaAbstracted.prototype.buildSelectBase = function( data, obj ){
		var value = obj.val();

		var tmpval = parseInt(value);
		var index = (typeof tmpval == 'number' && tmpval >= 0 ? value : obj[0].selectedIndex);
		
		var pos = obj.position(),
			width = obj.outerWidth(),
			shift = obj.outerWidth(true) - width;
			
		obj[0].style.visibility = 'hidden';
		
		var map = {id: obj[0].id, displayTemplate: this.buildSelectDisplay( data, obj , value , index ), top: pos.top, left: pos.left + shift, width: width,index: index};
		
		return this.fmt(this.options.baseTemplate,map);
		
	}
	alphaAbstracted.prototype.buildSelectDisplay = function( data, obj , value, index ){
		
		var selected = (data.hasOwnProperty(value) ? data[value] : data[index]);
		var map = {name: selected.name, srcImg: this.options.srcImg, offset: this.genOffset(index),imageSprite: this.options.imageSprite,index: index }
		
		return this.fmt(this.options.displayTemplate,map);
		
	}
	alphaAbstracted.prototype.buildSelectOptions = function(data, obj){
		
		var holder = '';
		var grouper = {};
		
		
		if(this.options.sortFunction !== false) {
			
		}
		
		
		
		var opts = this.options.optionProps;
		for(var i = 0, length = data.length;i<length;i++){
			var map = {name: data[i].name, srcImg: this.options.srcImg, offset: this.genOffset(i),imageSprite: this.options.imageSprite,index: i }
			if(this.options.optionProps !== false) {
				for(var key in opts){
					if(opts.hasOwnProperty(key) && data[i].hasOwnProperty(key)) {
						map[key] = data[i][key];
					}
				}
			}
			

			if(this.options.groupBy !== false && data[i].hasOwnProperty(this.options.groupBy)) {
				var tyt = data[i][this.options.groupBy];
				if(grouper.hasOwnProperty('f' + tyt)){
				
					grouper['f'+tyt] += this.fmt(this.options.optionTemplate,map);
				}	else
					grouper['f'+tyt] = [this.fmt(this.options.optionTemplate,map)];
			
			} else
				holder += this.fmt(this.options.optionTemplate,map);
			
		}
		if(this.options.groupBy !== false && grouper) {
			if(grouper.hasOwnProperty('ffirst')){
				holder += grouper.ffirst;
				grouper.ffirst = '';
			}
			
			for(var i = 0, length = this.options.groupTitles.length;i<length;i++){
				if(grouper.hasOwnProperty('f'+i)){
					holder += '<div class="alpha-results-group-title">'+this.options.groupTitles[i]+'</div>';
					holder += grouper['f'+i];
					grouper['f'+i] = '';
				}
			}
			
		}
		return {optionTemplate: holder};
		
	}
	alphaAbstracted.prototype.boundEvents = function(obj, data){
		var $target = obj.next('.alpha-select'),
			$body = $('body'),
			$dropout = $target.find('.alpha-select-dropout'),
			$searchBox = $target.find('.alpha-search-container'),
			$input = $searchBox.find('input'),
			$textBox = $target.find('.alpha-select-text'),
			$scrollbox = $target.find('.alpha-results-box'),
			id = $target[0].id,
			index = $target[0].getAttribute('data-index'),
			$t = this;
		
		this.target = $target;
		this.dropout = $dropout;
		this.searchBox = $searchBox;
		this.input = $input;
		this.scrollBox = $scrollbox;
		this.textBox = $textBox;
			
		if(data.data.length <= data.searchThreshold)
			$searchBox.hide();
			
		
			
		if(!$.data($body,'alpha-selects')){
			$.data($body,'alpha-selects',true)
			$body.on('alpha.clear',function(event, obj) {
				var obs = $('.alpha-select-dropout:visible','.alpha-select');
				var cid = obj || false;
				if(cid) {
					cid = cid.parent()[0].id;
					for(var i=0,len=obs.length;i<len;i++) {
						if(obs.parent()[0].id != cid)
							obj.hide();
					}
				} else
					obs.hide();
			});
			
			$body.on('mouseup',function(){
				if($body.hasClass('alpha-active')) {
					$body.trigger('alpha.clear');
					$body.removeClass('alpha-active');
				}
			});
		}
		
		
		if(true === data.delayOptions)
			$target.one('mousedown',function(event){
				event.stopPropagation();
				$('.alpha-select-dropout:visible','.alpha-select').hide();
				$scrollbox.html($t.buildSelectOptions(data.data,obj).optionTemplate);
				$t.reposition($dropout,$target);
				$dropout.show();
				
				$body.trigger('alpha.clear',[obj]);
				$body.addClass('alpha-active');

				$t.scrollToPos($scrollbox);
				
			});
			
		$target.on('mouseup','.alpha-select-text',function(event) {
			if(!$dropout.is(':visible')) {
				event.stopPropagation();
				$('.alpha-select-dropout:visible','.alpha-select').hide();
				$body.addClass('alpha-active')
				
				$t.reposition($dropout,$target);
				
				if($t.optionChildren.length>0)
					$t.optionChildren.show();
				
				$dropout.show();
				$t.scrollToPos($scrollbox)
				//console.log(1);
			}
		});
		$target.on('mouseup','.alpha-select-text',function(event) {
			event.stopPropagation();
			$input.val('').focus();
		});
		
		$target.on('click mousedown mouseup','.alpha-select-dropout', function(event){
			event.stopPropagation();
		});
		
		
		$target.on('click','.alpha-results-box > div', function(event){
			var tt = $(this),
				newVal = tt.attr('data-for'),
				truVal = newVal;
			if($t.dataforkey !== false)
				truVal = (data.data[newVal].hasOwnProperty(data.dataforkey) ? data.data[newVal][data.dataforkey] : newVal);
			
			var val = tt.find('.alpha-results-text:first').text(),
				pos = tt.find('img').css('background-position');
				
			$textBox.find('img').css('background-position',pos);
			$textBox.find('.alpha-text').text(val);
			
			obj.val(truVal);
			obj.change();
			$target.attr('data-index',newVal);
			
			$t.optionChildren.show();
			$input.val('');
			
			$dropout.hide();
		});	
		
		$target.on('keyup','input', function(event){
			
			var val = this.value.replace(/\{.*/i,'');
			var orival = this.value;
			var els = $dropout.find('.alpha-results-text:first-of-type')
			var patt= new RegExp(val,'i');
			var specail = /\{[\d\.]+\|[a-zA-Z]+\|[a-zA-Z]+\}/i;
			var capture = specail.exec(orival);
			
			els.filter(function(){
				var g = $(this);
				if(orival.search(specail) !== -1) {
					
					console.log(1,capture);
				}
				if(patt.test(g.text())){
					g.parent().css('display','block');
					return false;
				} else 
					return true;
			}).parent().css('display','none');
			
			
		});	
		
	}
	alphaAbstracted.prototype.scrollToPos = function(obj) {

		var $scrollbox = obj;
		var index = obj.parent().parent()[0].getAttribute('data-index');
		
		var ndiv;
		
		if(this.optionChildren.length === 0) {
			var opts = obj.children('div');
			ndiv = opts;
			this.optionChildren = opts;
		
		}else
			ndiv = this.optionChildren;

		var topar = ndiv.eq(0).parent();
		var topos = topar.find('[data-for="'+index+'"]');
		
		var potr = topar.scrollTop();
		var poty = topos.position(true).top;
		
		if(potr == 0 && poty != 0)
			$scrollbox.scrollTop(poty);
		else if(potr > 0 && poty < 0) {
			$scrollbox.scrollTop(Math.max(0,(potr + poty)));
		}
		else if(potr != 0 && poty > 0) {
			$scrollbox.scrollTop(potr + poty);
		}
	}
	alphaAbstracted.prototype.reposition = function(obj,base){
		
		var w = {width: $(window).width(), height: $(window).height()};
		
		
		var pos = base.offset();
		var width = obj.outerWidth(true) + 30;
		var height = obj.outerHeight(true) + 30;
		
		if(pos.left + width > w.width)
			obj.addClass('right');
		else
			obj.removeClass('right');
		
		if(pos.top + height > w.height)
			obj.addClass('up');
		else
			obj.removeClass('up');
		
	}
	alphaAbstracted.prototype.genOffset = function(index){
		
		var topOffest = (this.options.spriteRows !== false && this.options.spriteRows > 0 ? Math.floor(index / this.options.spriteColumns) * this.options.spriteImageHeight : 0);
		var leftOffset = index * this.options.spriteImageHeight;
		
		return "-"+leftOffset+"px "+topOffest+"px";
		
	}
	alphaAbstracted.prototype.buildFromOptions = function( obj ){
		
		
	}
	
	
	/* 
	 * While all methods are exposed, these are specifically meant for external use
	 * 
	 * 
	 */
	
	alphaAbstracted.prototype.hide = function( obj ){
		this.target.hide();
	}
	alphaAbstracted.prototype.show = function( obj ){
		this.target.show();
	}
	alphaAbstracted.prototype.getCurrentIndex = function( obj ){
		return this.target[0].getAttribute('data-index');
	}
	alphaAbstracted.prototype.visibility = function( obj ){
		return this.target.is(':visible');
	}
	alphaAbstracted.prototype.setToIndex = function( obj, value ){
		var tt = this.target.find('div[data-for="'+value+'"]');
		var val,pos;
		if(tt.length == 1) {
			//console.info('Found Index #' + value + '');
			val = tt.find('.alpha-results-text:first').text(),
			pos = tt.find('img').css('background-position');	
		} else {
			//console.info('Unable to find Index #' + value + ', pulling from data');
			val = this.options.data[value].name,
			pos = this.genOffset(value);	
		}
		
		this.textBox.find('img').css('background-position',pos);
		this.textBox.find('.alpha-text').text(val);
		this.target.attr('data-index',value);
	}
	
	
	alphaAbstracted.prototype.fmt = function (string,hash) {
		var string = string, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string;
	}
	$.fn[plugInName] = function ( options, value ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + plugInName)) {
				$.data(this, 'plugin_' + plugInName, 
				new alphaAbstracted( $(this) , options ));
			} else {
				if(typeof options == 'string'){
					
					var instance = $.data(this, 'plugin_' + plugInName);
					if(typeof instance[options] != 'undefinded' && Object.prototype.toString.call(instance[options]) == '[object Function]') {
						//console.info('Call to ' + options + ' made');
						return instance[options](this, value);
					}
				}
			}
		});
	}
	
}( jQuery, window, document ));