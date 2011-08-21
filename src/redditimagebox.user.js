// ==UserScript==
// @name          Reddit Image Box
// @namespace     http://jeffpalm.com/redditimagebox
// @description	  Opens images in box on reddit.
// @include       http://*reddit.com/*
// ==/UserScript==

(function() {

  const IMAGE_EXTS = ['jpg','jpeg','bmp','png','gif'];
  // Taken from http://bit.ly/27Xogz
  const BLACK_OVERLAY_STYLE = {
    'display': 'none',
    'position': 'absolute',
    'top': '0%',
    'left': '0%',
    'width': '100%',
    'height': '1000%',
    'background-color': 'black',
    'z-index': '1001',
    '-moz-opacity': '0.8',
    'opacity': '.80',
    'filter': 'alpha(opacity=80)'
  };
  // Taken from http://bit.ly/27Xogz
  const LIGHT_PAD = 20;
  const WHITE_CONTENT_STYLE = {
    'display': 'none',
    'position': 'absolute',
    'top': LIGHT_PAD + 'px',
    'left': LIGHT_PAD + 'px',
    'padding': '16px',
    'border': '3px solid grey',
    'background-color': 'white',
    'z-index': '1002',
    'overflow': 'auto'
  };

  function isImage(s) {
    if (!s) return false;
    var ilast = s.lastIndexOf('.');
    if (ilast === -1) return false;
    var ext = s.substr(ilast+1).toLowerCase();
    var exts = IMAGE_EXTS;
    for (var i in exts) {
      if (ext === exts[i]) return true;
    }
    return false;
  }

  function getOrCreateElement(id,type) {
    var el = document.getElementById(id);
    if (!!el) return el;
    el = document.createElement(type);
    el.id = id;
    document.body.appendChild(el);
    return el;
  }

  function setStyle(el,style) {
    for (var i in style) {
      el.style[i] = style[i];
    }
  }

  function showImage(href) {
    var fade = getOrCreateElement('fade','div');
    var light = getOrCreateElement('light','div');
    setStyle(fade,BLACK_OVERLAY_STYLE);
    setStyle(light,WHITE_CONTENT_STYLE);
    light.style.display = 'block';
    fade.style.display = 'block';
    //
    // Reclculate based on current position, we need to scroll after
    // we put the two new elements in.
    //
    var scrollX = window.scrollX;
    var scrollY = window.scrollY;
    light.style.top = (LIGHT_PAD + scrollY) + 'px';
    var close = document.createElement('a');
    close.innerHTML = 'Close';
    close.href = '#';
    close.style.position = 'absolute';
    close.style.top = '15px';
    close.style.right = '15px';
    var lis = (function() {
      var _light = light;
      var _fade = fade;
      return function(e) {
	var x = scrollX;
	var y = scrollY;
	_light.innerHTML = '';
	_light.style.display = 'none';
	_fade.style.display = 'none';
	window.scrollTo(window.scroll,y);
	note('window.scrollTo:' + y);
      }})();
    close.addEventListener('click',lis,false);
    fade.addEventListener('click',lis,false);
    light.appendChild(close);
    light.appendChild(document.createElement('br'));
    light.appendChild(document.createElement('br'));
    var img = document.createElement('img');
    img.src = href;
    light.appendChild(img);
    light.focus();
    setTimeout('window.scrollTo('+window.scrollX+','+scrollY+')',200);
  }

  function addListener(a,href) {
    a.addEventListener('click',function(e) {
      showImage(href);
    },false);
    a.href = '#_' + href;
  }

  function note(msg) {
    try {
      console.log('[redditimagebox] ' + msg);
    } catch (e) {}
  }

  function main() {
    note('Starting');
    var as = document.getElementsByTagName('A');
    for (var i in as) {
      var a = as[i];
      if (!a.className) continue;
      if (!a.className.match(/title/)) continue;
      var href = a.href;
      if (href.match(/imgur.com\/\w+$/)) {
	href += '.jpg';
      }
      if (!isImage(href)) continue;
      addListener(a,href);
    }
  }

  main();

})();