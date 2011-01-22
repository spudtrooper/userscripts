// ==UserScript==
// @name          Page Up + Page Down
// @namespace     http://jeffpalm.com/pageuppagedown/
// @description   Assigns page up/down to the left/right arrows when possible.
// @include       *
// ==/UserScript==

function noHorizontalScroll() {
  var root = document.compatMode=='BackCompat'? 
    document.body : document.documentElement;
  var isHorizontalScrollbar = root.scrollWidth > root.clientWidth;
  return !isHorizontalScrollbar;
}

function main() {
  window.addEventListener('keydown',function(e) {
      if        (e.keyCode == 37 && noHorizontalScroll()) {
	window.scrollByPages(-1);
      } else if (e.keyCode == 39 && noHorizontalScroll()) {
	window.scrollByPages(+1);
      }
    },true);
}

main();