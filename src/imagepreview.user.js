// ==UserScript==
// @name          Image preview
// @namespace     http://jeffpalm.com/imagepreview
// @description   Preview all the images on a page
// @include       http://*
// ==/UserScript==

/*
 * Copyright 2006 Jeffrey Palm.
 */

var VERSION = 0.1;

// --------------------------------------------------
// misc
// --------------------------------------------------

/**
 * String[tag] (Node) -> Node
 * Creates a new node.
 */
function $n(tag,on) {
  var e = document.createElement(tag);
  if (on) on.appendChild(e);
  return e;
}

/**
 * String[text] (Node) -> Node
 * Creates a new text node.
 */
function $t(text,on) {
  var e = document.createTextNode(text);
  if (on) on.appendChild(e);
  return e;
}

// --------------------------------------------------
// main
// --------------------------------------------------

/**
 * String(imageName) -> Boolean
 */
function isImage(src) {
  if (!src) return 0;
  var res = [
             /\.jpg$/i,
             /\.png$/i,
             /\.bmp$/i,
             /\.gif$/i,
             ];
  for (i=0; i<res.length; i++) {
    var re = res[i];
    if (src.match(re)) return 1;
  }
  return 0;
}


function previewImages(e) {
  //
  // find all the images on the page
  //
  var as = document.getElementsByTagName("a");
  if (!as) return; // sanity check
  //
  // only do 10
  //
  for (var i=0; i<as.length; i++) {
    var a = as[i];
    if (a.href && isImage(a.href)) {
      var img = $n("img");
      img.src = a.href;
      if (img.style) {
        img.style.width = "100px";
        img.style.height = "100px";
        img.style.verticalAlign = "top";
      }
      $t(" ",a);
      a.appendChild(img);
    }
  }
}

function main() {
  //
  // add the menu item
  //
  GM_registerMenuCommand("Image preview", previewImages);
}

main();

