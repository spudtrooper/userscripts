// ==UserScript==
// @name          Ornage FR
// @namespace     http://jeffpalm.com/orangefr
// @description   Bypasses the log in screen for orange.fr wifi
// @include       https://hautdebitmobile.orange.fr:8443/home*
// ==/UserScript==
(function() {
  
  function main() {
    var els;
    els = document.getElementsByTagName('input');
    for (var i=0; i<els.length; i++) {
      var inp = els[i];
      if (inp.name === 'ck') {
	inp.checked = true;
	break;
      }
    }
    var els = document.getElementsByTagName('a');
    for (var i=0; i<els.length; i++) {
      var a = els[i];
      if (a.href && a.href.match(/^javascript:validate*/)) {
	// Emulate a click the ghetto way
	document.location = a.href;
      }
    }
  }
  
  // Let your auto-fillin names show up, then call main
  setTimeout(main,1000);

})();