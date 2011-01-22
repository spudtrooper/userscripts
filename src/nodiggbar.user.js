// ==UserScript==
// @name          Select
// @namespace     http://jeffpalm.com/nodiggbar
// @description   Removes Digg Bar from web pages
// @include       http://digg.com/*
// @include       http://www.digg.com/*
// ==/UserScript==

/*
 * Copyright 2009 Jeffrey Palm.
 */

function main() {
  var frame = document.getElementById('diggiFrame');
  if (!frame) return;
  var url = frame.src;
  document.location.href = url;
}

main();
