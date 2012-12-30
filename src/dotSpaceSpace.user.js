// ==UserScript==
// @name          Dot space space
// @namespace     http://jeffpalm.com/dotspacespace/
// @description   Alerts when you type two spaces after a period.
// @include       http://*
// @include       https://*
// ==/UserScript==

(function() {

  const KEY_DOT = 190;
  const KEY_SPACE = 32;
  const DOT_SPACE_SPACE_MASK = (KEY_SPACE << 16) | (KEY_SPACE << 8) | KEY_DOT;

  var buf = 0;

  function keyPress(e) {
    buf >>= 8;
    buf |= (e.keyCode & 0xff) << 16;
    if (buf == DOT_SPACE_SPACE_MASK) {
      alert('Don\'t type two spaces after a period!');
      buf = 0;
    }
  }
  
  function main() {
    window.addEventListener('keydown',keyPress,true);
  }

  main();

})();