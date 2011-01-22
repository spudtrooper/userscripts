// ==UserScript==
// @name          Skip ads
// @namespace     http://jeffpalm.com/skipads
// @description   Skip New York Times ads
// @include       http://*.nytimes.com/*
// ==/UserScript==

/*
 * Copyright 2008 Jeffrey Palm.
 */

var TESTING = false;

function main() {

  // Check for the 'skip this ad' thingy
  var imgs = document.getElementsByTagName("img");
  var haveIt = false;
  for (var i=0; i<imgs.length; i++) {
    var img = imgs[i];
    if (img.src && img.src == 'http://graphics8.nytimes.com/ads/interstitial/skip_0.gif') {
      haveIt = true;
      break;
    }
  }
  if (!haveIt) return;

  // Grab a link with an 'onMouseOver' attribute
  var as = document.getElementsByTagName("a");
  var link = null;
  for (var i=0; i<as.length; i++) {
    var a = as[i];
    if (a.href && a.href.match(/.*\/pages\/.*/)) {
      link = a;
      break;
    }
  }
  if (!link) return;

  document.location = link.href;
}

try {main();} catch (e) {if (TESTING) alert(e);}
