// ==UserScript==
// @name          Scroll again
// @namespace     http://jeffpalm.com/scrollagain
// @description   Scroll again to the same location
// @include       http://*
// ==/UserScript==

/*
 * Copyright 2007 Jeffrey Palm.
 */

// --------------------------------------------------
// Misc
// --------------------------------------------------

var PREFIX = "*scrollagain*.";

function setValue(key,val) {
  return GM_setValue(PREFIX + key,val);
}

function getValue(key,defaultValue) {
  var res = GM_getValue(PREFIX + key);
  if (!res) res = defaultValue;
  return res;
}

function scrollAgain() {
  
  // Get the scroll location
  var y = window.pageYOffset;
  setValue("y",y);
}

function scrollNever() {
  setValue("y",0);
}

function main() {
  GM_registerMenuCommand("Scroll again", scrollAgain);
  GM_registerMenuCommand("Scroll never", scrollNever);
  var y = getValue("y",0);
  if (y) {
    var x = window.pageXOffset;
    window.scrollTo(x,y);
  }
}

try {main();} catch (e) {}
