// ==UserScript==
// @name          YouTubed
// @namespace     http://jeffpalm.com/youtube
// @description    Marks YouTube videos as read
// @include       http://*youtube.com/*
// ==/UserScript==

/*
 * Copyright 2006 Jeffrey Palm.
 */


var BETA = true;
var DEBUG = true;
var PREFIX = "*youtubed*.";

// --------------------------------------------------
// Misc
// --------------------------------------------------

function $n(tag,on) {
  var e = document.createElement(tag);
  if (on) on.appendChild(e);
  return e;
}

function $t(text,on) {
  var e = document.createTextNode(text);
  if (on) on.appendChild(e);
  return e;
}

// --------------------------------------------------
// Main
// --------------------------------------------------

/**
 * String[url] -> ( String[id] | 0 )
 */
function getId(url) {
  results = page.match(/youtube\.com\/.*watch\?v\=([^\&]+)/);
  if (!results || results.length<0) return 0;
  id = results[1];
  return id;
}

function savePage() {
  //
  // get the page id
  //
  // http://www.youtube.com/watch?v=ttT7Zbx2m4I&mode=related&search=
  page = document.location;
  if (!page) return;
  page += "";
  id = getId(page);
  if (!id) return;
  //
  // save the id and increment it
  //
  val = getValue(id);
  val = val ? (parseInt(val) + 1) : "1";
  setValue(id,val);
  return id;
}

function addViewed(a,id) {
  $n("br",a.parentNode);
  times = getValue(id);
  if (!times) times = "0";
  s = "viewed " + times + " time";
  if (times != "1") s += "s";
  $t(s,a.parentNode);
}

function highlightClips(pageId) {
  //
  // search for all the clips and highlight them
  //
  // <a href="/watch?v=ttT7Zbx2m4I&mode=related&search="
  as = document.getElementsByTagName("a");
  if (as) {
    for (var i=0; i<as.length; i++) {
      a = as[i];
      href = a.getAttribute("href");
      if (!href) continue;
      if (results = href.match(/watch\?v\=([^\&]+)/)) {
        if (results.length<1) continue;
        id = results[1];     
        addViewed(a,id);
      }
    }
  }
}

/**
 * String[id] -> ( String[value] | 0 )
 */
function getValue(s) {
  return GM_getValue(PREFIX + s);
}

/**
 * String[id] String[value] -> ( String[value] | 0 )
 */
function setValue(s,val) {
  GM_setValue(PREFIX + s,val);
}



function showError(str) {
  alert("ERROR: " + str);
}

function handle(e) {
  alert("ERROR: " + e);
}

function main() {
  highlightClips(savePage());
}

try {main();} catch (e) {alert(e);}
