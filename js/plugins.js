window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var a=[].slice.call(arguments);(typeof console.log==="object"?log.apply.call(console.log,console,a):console.log.apply(console,a))}};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());
/*!
* ZeroClipboard
* The ZeroClipboard library provides an easy way to copy text to the clipboard using an invisible Adobe Flash movie and a JavaScript interface.
* Copyright (c) 2014 Jon Rohan, James M. Greene
* Licensed MIT
* http://zeroclipboard.org/
* v1.3.2
*/
!function(){"use strict";function a(a){return a.replace(/,/g,".").replace(/[^0-9\.]/g,"")}function b(b){return parseFloat(a(b))>=10}var c,d={bridge:null,version:"0.0.0",disabled:null,outdated:null,ready:null},e={},f=0,g={},h=0,i={},j=null,k=null,l=function(){var a,b,c,d,e="ZeroClipboard.swf";if(document.currentScript&&(d=document.currentScript.src));else{var f=document.getElementsByTagName("script");if("readyState"in f[0])for(a=f.length;a--&&("interactive"!==f[a].readyState||!(d=f[a].src)););else if("loading"===document.readyState)d=f[f.length-1].src;else{for(a=f.length;a--;){if(c=f[a].src,!c){b=null;break}if(c=c.split("#")[0].split("?")[0],c=c.slice(0,c.lastIndexOf("/")+1),null==b)b=c;else if(b!==c){b=null;break}}null!==b&&(d=b)}}return d&&(d=d.split("#")[0].split("?")[0],e=d.slice(0,d.lastIndexOf("/")+1)+e),e}(),m=function(){var a=/\-([a-z])/g,b=function(a,b){return b.toUpperCase()};return function(c){return c.replace(a,b)}}(),n=function(a,b){var c,d,e;return window.getComputedStyle?c=window.getComputedStyle(a,null).getPropertyValue(b):(d=m(b),c=a.currentStyle?a.currentStyle[d]:a.style[d]),"cursor"!==b||c&&"auto"!==c||(e=a.tagName.toLowerCase(),"a"!==e)?c:"pointer"},o=function(a){a||(a=window.event);var b;this!==window?b=this:a.target?b=a.target:a.srcElement&&(b=a.srcElement),I.activate(b)},p=function(a,b,c){a&&1===a.nodeType&&(a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c))},q=function(a,b,c){a&&1===a.nodeType&&(a.removeEventListener?a.removeEventListener(b,c,!1):a.detachEvent&&a.detachEvent("on"+b,c))},r=function(a,b){if(!a||1!==a.nodeType)return a;if(a.classList)return a.classList.contains(b)||a.classList.add(b),a;if(b&&"string"==typeof b){var c=(b||"").split(/\s+/);if(1===a.nodeType)if(a.className){for(var d=" "+a.className+" ",e=a.className,f=0,g=c.length;g>f;f++)d.indexOf(" "+c[f]+" ")<0&&(e+=" "+c[f]);a.className=e.replace(/^\s+|\s+$/g,"")}else a.className=b}return a},s=function(a,b){if(!a||1!==a.nodeType)return a;if(a.classList)return a.classList.contains(b)&&a.classList.remove(b),a;if(b&&"string"==typeof b||void 0===b){var c=(b||"").split(/\s+/);if(1===a.nodeType&&a.className)if(b){for(var d=(" "+a.className+" ").replace(/[\n\t]/g," "),e=0,f=c.length;f>e;e++)d=d.replace(" "+c[e]+" "," ");a.className=d.replace(/^\s+|\s+$/g,"")}else a.className=""}return a},t=function(){var a,b,c,d=1;return"function"==typeof document.body.getBoundingClientRect&&(a=document.body.getBoundingClientRect(),b=a.right-a.left,c=document.body.offsetWidth,d=Math.round(b/c*100)/100),d},u=function(a,b){var c={left:0,top:0,width:0,height:0,zIndex:A(b)-1};if(a.getBoundingClientRect){var d,e,f,g=a.getBoundingClientRect();"pageXOffset"in window&&"pageYOffset"in window?(d=window.pageXOffset,e=window.pageYOffset):(f=t(),d=Math.round(document.documentElement.scrollLeft/f),e=Math.round(document.documentElement.scrollTop/f));var h=document.documentElement.clientLeft||0,i=document.documentElement.clientTop||0;c.left=g.left+d-h,c.top=g.top+e-i,c.width="width"in g?g.width:g.right-g.left,c.height="height"in g?g.height:g.bottom-g.top}return c},v=function(a,b){var c=null==b||b&&b.cacheBust===!0&&b.useNoCache===!0;return c?(-1===a.indexOf("?")?"?":"&")+"noCache="+(new Date).getTime():""},w=function(a){var b,c,d,e=[],f=[],g=[];if(a.trustedOrigins&&("string"==typeof a.trustedOrigins?f.push(a.trustedOrigins):"object"==typeof a.trustedOrigins&&"length"in a.trustedOrigins&&(f=f.concat(a.trustedOrigins))),a.trustedDomains&&("string"==typeof a.trustedDomains?f.push(a.trustedDomains):"object"==typeof a.trustedDomains&&"length"in a.trustedDomains&&(f=f.concat(a.trustedDomains))),f.length)for(b=0,c=f.length;c>b;b++)if(f.hasOwnProperty(b)&&f[b]&&"string"==typeof f[b]){if(d=D(f[b]),!d)continue;if("*"===d){g=[d];break}g.push.apply(g,[d,"//"+d,window.location.protocol+"//"+d])}return g.length&&e.push("trustedOrigins="+encodeURIComponent(g.join(","))),"string"==typeof a.jsModuleId&&a.jsModuleId&&e.push("jsModuleId="+encodeURIComponent(a.jsModuleId)),e.join("&")},x=function(a,b,c){if("function"==typeof b.indexOf)return b.indexOf(a,c);var d,e=b.length;for("undefined"==typeof c?c=0:0>c&&(c=e+c),d=c;e>d;d++)if(b.hasOwnProperty(d)&&b[d]===a)return d;return-1},y=function(a){if("string"==typeof a)throw new TypeError("ZeroClipboard doesn't accept query strings.");return a.length?a:[a]},z=function(a,b,c,d){d?window.setTimeout(function(){a.apply(b,c)},0):a.apply(b,c)},A=function(a){var b,c;return a&&("number"==typeof a&&a>0?b=a:"string"==typeof a&&(c=parseInt(a,10))&&!isNaN(c)&&c>0&&(b=c)),b||("number"==typeof L.zIndex&&L.zIndex>0?b=L.zIndex:"string"==typeof L.zIndex&&(c=parseInt(L.zIndex,10))&&!isNaN(c)&&c>0&&(b=c)),b||0},B=function(a,b){if(a&&b!==!1&&"undefined"!=typeof console&&console&&(console.warn||console.log)){var c="`"+a+"` is deprecated. See docs for more info:\n    https://github.com/zeroclipboard/zeroclipboard/blob/master/docs/instructions.md#deprecations";console.warn?console.warn(c):console.log(c)}},C=function(){var a,b,c,d,e,f,g=arguments[0]||{};for(a=1,b=arguments.length;b>a;a++)if(null!=(c=arguments[a]))for(d in c)if(c.hasOwnProperty(d)){if(e=g[d],f=c[d],g===f)continue;void 0!==f&&(g[d]=f)}return g},D=function(a){if(null==a||""===a)return null;if(a=a.replace(/^\s+|\s+$/g,""),""===a)return null;var b=a.indexOf("//");a=-1===b?a:a.slice(b+2);var c=a.indexOf("/");return a=-1===c?a:-1===b||0===c?null:a.slice(0,c),a&&".swf"===a.slice(-4).toLowerCase()?null:a||null},E=function(){var a=function(a,b){var c,d,e;if(null!=a&&"*"!==b[0]&&("string"==typeof a&&(a=[a]),"object"==typeof a&&"length"in a))for(c=0,d=a.length;d>c;c++)if(a.hasOwnProperty(c)&&(e=D(a[c]))){if("*"===e){b.length=0,b.push("*");break}-1===x(e,b)&&b.push(e)}},b={always:"always",samedomain:"sameDomain",never:"never"};return function(c,d){var e,f=d.allowScriptAccess;if("string"==typeof f&&(e=f.toLowerCase())&&/^always|samedomain|never$/.test(e))return b[e];var g=D(d.moviePath);null===g&&(g=c);var h=[];a(d.trustedOrigins,h),a(d.trustedDomains,h);var i=h.length;if(i>0){if(1===i&&"*"===h[0])return"always";if(-1!==x(c,h))return 1===i&&c===g?"sameDomain":"always"}return"never"}}(),F=function(a){if(null==a)return[];if(Object.keys)return Object.keys(a);var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b},G=function(a){if(a)for(var b in a)a.hasOwnProperty(b)&&delete a[b];return a},H=function(){var a=!1;if("boolean"==typeof d.disabled)a=d.disabled===!1;else{if("function"==typeof ActiveXObject)try{new ActiveXObject("ShockwaveFlash.ShockwaveFlash")&&(a=!0)}catch(b){}!a&&navigator.mimeTypes["application/x-shockwave-flash"]&&(a=!0)}return a},I=function(a,b){return this instanceof I?(this.id=""+f++,g[this.id]={instance:this,elements:[],handlers:{}},a&&this.clip(a),"undefined"!=typeof b&&(B("new ZeroClipboard(elements, options)",L.debug),I.config(b)),this.options=I.config(),"boolean"!=typeof d.disabled&&(d.disabled=!H()),d.disabled===!1&&d.outdated!==!0&&null===d.bridge&&(d.outdated=!1,d.ready=!1,M()),void 0):new I(a,b)};I.prototype.setText=function(a){return a&&""!==a&&(e["text/plain"]=a,d.ready===!0&&d.bridge&&d.bridge.setText(a)),this},I.prototype.setSize=function(a,b){return d.ready===!0&&d.bridge&&d.bridge.setSize(a,b),this};var J=function(a){d.ready===!0&&d.bridge&&d.bridge.setHandCursor(a)};I.prototype.destroy=function(){this.unclip(),this.off(),delete g[this.id]};var K=function(){var a,b,c,d=[],e=F(g);for(a=0,b=e.length;b>a;a++)c=g[e[a]].instance,c&&c instanceof I&&d.push(c);return d};I.version="1.3.2";var L={swfPath:l,trustedDomains:window.location.host?[window.location.host]:[],cacheBust:!0,forceHandCursor:!1,zIndex:999999999,debug:!0,title:null,autoActivate:!0};I.config=function(a){"object"==typeof a&&null!==a&&C(L,a);{if("string"!=typeof a||!a){var b={};for(var c in L)L.hasOwnProperty(c)&&(b[c]="object"==typeof L[c]&&null!==L[c]?"length"in L[c]?L[c].slice(0):C({},L[c]):L[c]);return b}if(L.hasOwnProperty(a))return L[a]}},I.destroy=function(){I.deactivate();for(var a in g)if(g.hasOwnProperty(a)&&g[a]){var b=g[a].instance;b&&"function"==typeof b.destroy&&b.destroy()}var c=N(d.bridge);c&&c.parentNode&&(c.parentNode.removeChild(c),d.ready=null,d.bridge=null)},I.activate=function(a){c&&(s(c,L.hoverClass),s(c,L.activeClass)),c=a,r(a,L.hoverClass),O();var b=L.title||a.getAttribute("title");if(b){var e=N(d.bridge);e&&e.setAttribute("title",b)}var f=L.forceHandCursor===!0||"pointer"===n(a,"cursor");J(f)},I.deactivate=function(){var a=N(d.bridge);a&&(a.style.left="0px",a.style.top="-9999px",a.removeAttribute("title")),c&&(s(c,L.hoverClass),s(c,L.activeClass),c=null)};var M=function(){var a,b,c=document.getElementById("global-zeroclipboard-html-bridge");if(!c){var e=I.config();e.jsModuleId="string"==typeof j&&j||"string"==typeof k&&k||null;var f=E(window.location.host,L),g=w(e),h=L.moviePath+v(L.moviePath,L),i='      <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="global-zeroclipboard-flash-bridge" width="100%" height="100%">         <param name="movie" value="'+h+'"/>         <param name="allowScriptAccess" value="'+f+'"/>         <param name="scale" value="exactfit"/>         <param name="loop" value="false"/>         <param name="menu" value="false"/>         <param name="quality" value="best" />         <param name="bgcolor" value="#ffffff"/>         <param name="wmode" value="transparent"/>         <param name="flashvars" value="'+g+'"/>         <embed src="'+h+'"           loop="false" menu="false"           quality="best" bgcolor="#ffffff"           width="100%" height="100%"           name="global-zeroclipboard-flash-bridge"           allowScriptAccess="'+f+'"           allowFullScreen="false"           type="application/x-shockwave-flash"           wmode="transparent"           pluginspage="http://www.macromedia.com/go/getflashplayer"           flashvars="'+g+'"           scale="exactfit">         </embed>       </object>';c=document.createElement("div"),c.id="global-zeroclipboard-html-bridge",c.setAttribute("class","global-zeroclipboard-container"),c.style.position="absolute",c.style.left="0px",c.style.top="-9999px",c.style.width="15px",c.style.height="15px",c.style.zIndex=""+A(L.zIndex),document.body.appendChild(c),c.innerHTML=i}a=document["global-zeroclipboard-flash-bridge"],a&&(b=a.length)&&(a=a[b-1]),d.bridge=a||c.children[0].lastElementChild},N=function(a){for(var b=/^OBJECT|EMBED$/,c=a&&a.parentNode;c&&b.test(c.nodeName)&&c.parentNode;)c=c.parentNode;return c||null},O=function(){if(c){var a=u(c,L.zIndex),b=N(d.bridge);b&&(b.style.top=a.top+"px",b.style.left=a.left+"px",b.style.width=a.width+"px",b.style.height=a.height+"px",b.style.zIndex=a.zIndex+1),d.ready===!0&&d.bridge&&d.bridge.setSize(a.width,a.height)}return this};I.prototype.on=function(a,b){var c,e,f,h={},i=g[this.id]&&g[this.id].handlers;if("string"==typeof a&&a)f=a.toLowerCase().split(/\s+/);else if("object"==typeof a&&a&&"undefined"==typeof b)for(c in a)a.hasOwnProperty(c)&&"string"==typeof c&&c&&"function"==typeof a[c]&&this.on(c,a[c]);if(f&&f.length){for(c=0,e=f.length;e>c;c++)a=f[c].replace(/^on/,""),h[a]=!0,i[a]||(i[a]=[]),i[a].push(b);h.noflash&&d.disabled&&R.call(this,"noflash",{}),h.wrongflash&&d.outdated&&R.call(this,"wrongflash",{flashVersion:d.version}),h.load&&d.ready&&R.call(this,"load",{flashVersion:d.version})}return this},I.prototype.off=function(a,b){var c,d,e,f,h,i=g[this.id]&&g[this.id].handlers;if(0===arguments.length)f=F(i);else if("string"==typeof a&&a)f=a.split(/\s+/);else if("object"==typeof a&&a&&"undefined"==typeof b)for(c in a)a.hasOwnProperty(c)&&"string"==typeof c&&c&&"function"==typeof a[c]&&this.off(c,a[c]);if(f&&f.length)for(c=0,d=f.length;d>c;c++)if(a=f[c].toLowerCase().replace(/^on/,""),h=i[a],h&&h.length)if(b)for(e=x(b,h);-1!==e;)h.splice(e,1),e=x(b,h,e);else i[a].length=0;return this},I.prototype.handlers=function(a){var b,c=null,d=g[this.id]&&g[this.id].handlers;if(d){if("string"==typeof a&&a)return d[a]?d[a].slice(0):null;c={};for(b in d)d.hasOwnProperty(b)&&d[b]&&(c[b]=d[b].slice(0))}return c};var P=function(a,b,c,d){var e=g[this.id]&&g[this.id].handlers[a];if(e&&e.length){var f,h,i,j=b||this;for(f=0,h=e.length;h>f;f++)i=e[f],b=j,"string"==typeof i&&"function"==typeof window[i]&&(i=window[i]),"object"==typeof i&&i&&"function"==typeof i.handleEvent&&(b=i,i=i.handleEvent),"function"==typeof i&&z(i,b,c,d)}return this};I.prototype.clip=function(a){a=y(a);for(var b=0;b<a.length;b++)if(a.hasOwnProperty(b)&&a[b]&&1===a[b].nodeType){a[b].zcClippingId?-1===x(this.id,i[a[b].zcClippingId])&&i[a[b].zcClippingId].push(this.id):(a[b].zcClippingId="zcClippingId_"+h++,i[a[b].zcClippingId]=[this.id],L.autoActivate===!0&&p(a[b],"mouseover",o));var c=g[this.id].elements;-1===x(a[b],c)&&c.push(a[b])}return this},I.prototype.unclip=function(a){var b=g[this.id];if(b){var c,d=b.elements;a="undefined"==typeof a?d.slice(0):y(a);for(var e=a.length;e--;)if(a.hasOwnProperty(e)&&a[e]&&1===a[e].nodeType){for(c=0;-1!==(c=x(a[e],d,c));)d.splice(c,1);var f=i[a[e].zcClippingId];if(f){for(c=0;-1!==(c=x(this.id,f,c));)f.splice(c,1);0===f.length&&(L.autoActivate===!0&&q(a[e],"mouseover",o),delete a[e].zcClippingId)}}}return this},I.prototype.elements=function(){var a=g[this.id];return a&&a.elements?a.elements.slice(0):[]};var Q=function(a){var b,c,d,e,f,h=[];if(a&&1===a.nodeType&&(b=a.zcClippingId)&&i.hasOwnProperty(b)&&(c=i[b],c&&c.length))for(d=0,e=c.length;e>d;d++)f=g[c[d]].instance,f&&f instanceof I&&h.push(f);return h};L.hoverClass="zeroclipboard-is-hover",L.activeClass="zeroclipboard-is-active",L.trustedOrigins=null,L.allowScriptAccess=null,L.useNoCache=!0,L.moviePath="ZeroClipboard.swf",I.detectFlashSupport=function(){return B("ZeroClipboard.detectFlashSupport",L.debug),H()},I.dispatch=function(a,b){if("string"==typeof a&&a){var d=a.toLowerCase().replace(/^on/,"");if(d)for(var e=c?Q(c):K(),f=0,g=e.length;g>f;f++)R.call(e[f],d,b)}},I.prototype.setHandCursor=function(a){return B("ZeroClipboard.prototype.setHandCursor",L.debug),a="boolean"==typeof a?a:!!a,J(a),L.forceHandCursor=a,this},I.prototype.reposition=function(){return B("ZeroClipboard.prototype.reposition",L.debug),O()},I.prototype.receiveEvent=function(a,b){if(B("ZeroClipboard.prototype.receiveEvent",L.debug),"string"==typeof a&&a){var c=a.toLowerCase().replace(/^on/,"");c&&R.call(this,c,b)}},I.prototype.setCurrent=function(a){return B("ZeroClipboard.prototype.setCurrent",L.debug),I.activate(a),this},I.prototype.resetBridge=function(){return B("ZeroClipboard.prototype.resetBridge",L.debug),I.deactivate(),this},I.prototype.setTitle=function(a){if(B("ZeroClipboard.prototype.setTitle",L.debug),a=a||L.title||c&&c.getAttribute("title")){var b=N(d.bridge);b&&b.setAttribute("title",a)}return this},I.setDefaults=function(a){B("ZeroClipboard.setDefaults",L.debug),I.config(a)},I.prototype.addEventListener=function(a,b){return B("ZeroClipboard.prototype.addEventListener",L.debug),this.on(a,b)},I.prototype.removeEventListener=function(a,b){return B("ZeroClipboard.prototype.removeEventListener",L.debug),this.off(a,b)},I.prototype.ready=function(){return B("ZeroClipboard.prototype.ready",L.debug),d.ready===!0};var R=function(f,g){f=f.toLowerCase().replace(/^on/,"");var h=g&&g.flashVersion&&a(g.flashVersion)||null,i=c,j=!0;switch(f){case"load":if(h){if(!b(h))return R.call(this,"onWrongFlash",{flashVersion:h}),void 0;d.outdated=!1,d.ready=!0,d.version=h}break;case"wrongflash":h&&!b(h)&&(d.outdated=!0,d.ready=!1,d.version=h);break;case"mouseover":r(i,L.hoverClass);break;case"mouseout":L.autoActivate===!0&&I.deactivate();break;case"mousedown":r(i,L.activeClass);break;case"mouseup":s(i,L.activeClass);break;case"datarequested":var k=i.getAttribute("data-clipboard-target"),l=k?document.getElementById(k):null;if(l){var m=l.value||l.textContent||l.innerText;m&&this.setText(m)}else{var n=i.getAttribute("data-clipboard-text");n&&this.setText(n)}j=!1;break;case"complete":G(e)}var o=i,p=[this,g];return P.call(this,f,o,p,j)};"function"==typeof define&&define.amd?define(["require","exports","module"],function(a,b,c){return j=c&&c.id||null,I}):"object"==typeof module&&module&&"object"==typeof module.exports&&module.exports?(k=module.id||null,module.exports=I):window.ZeroClipboard=I}();