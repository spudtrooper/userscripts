// ==UserScript==
// @name          FullImage
// @namespace     http://jeffpalm.com/fullimage
// @description   Provides links to the full image on Google's image search
// @include       http://images.google.com/images*
// @include       http://google.com/images*
// @include       http://www.google.com/images*
// ==/UserScript==

/*
 * Copyright 2010 Jeffrey Palm.
 */

var TESTING = false;

/** http://javascript.internet.com/snippets/insertafter.html */
function insertAfter(parent, node, referenceNode) {
  parent.insertBefore(node, referenceNode.nextSibling);
}

function main() {
  var as = document.getElementsByTagName('a');
  for (var i=0; i<as.length; i++) {
    var a = as[i];
    if (res = a.href.match(/\?imgurl=([^&]+)&/)) {
      var link = res[1];
      var par = a.parentNode;
      var newLink = document.createElement('A');
      newLink.style.color = '#770000';
      newLink.style.fontSize = '.8em';
      newLink.innerHTML = 'full image';
      newLink.href = link;
      insertAfter(par,newLink,a);
      insertAfter(par,document.createElement('BR'),a);
    }
  }
}

try {main();} catch (e) {if (TESTING) alert(e);}
