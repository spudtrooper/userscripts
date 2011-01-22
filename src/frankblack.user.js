// ==UserScript==
// @name          FB (that doesn't stand for facebook)
// @namespace     http://jeffpalm.com/frankblack
// @description   Changes "What's on your mind?" to something else.
// @include       http://facebook.com/*
// @include       http://www.facebook.com/*
// ==/UserScript==

function main() {
  var divs = document.getElementsByTagName("TEXTAREA");
  if (!divs) return;
  for (var i=0; i<divs.length; i++) {
    var d = divs[i];
    if (!d.innerHTML || !d.innerHTML.match(/.*s on your mind.*/)) continue;
    d.innerHTML = 'Where is my mind?';
    break;
  }
}

main();