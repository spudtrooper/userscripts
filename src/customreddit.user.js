// ==UserScript==
// @name          Custom Reddit
// @namespace     http://jeffpalm.com/customreddit/
// @description   Customize the reddits you don't want to see
// @include       http://*reddit.com*
// ==/UserScript==

/*
 * Copyright 2009 Jeffrey Palm.
 */

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

const TESTING = true;
var reddits;
var removedReddits = 0;

// ----------------------------------------------------------------------
// Values
// ----------------------------------------------------------------------

const KEY_PREFIX = "_customreddit_";

function getValue(key,defaultValue) {
  if (!defaultValue) defaultValue = "";
  var res = GM_getValue(KEY_PREFIX+key,defaultValue);
  if (typeof res == "undefined") res = defaultValue;
  return res;
}

function setValue(key,value) {
  GM_setValue(KEY_PREFIX+key,value);
}

function getReddits() {
  var urlsString = getValue("reddits","");
  var urls = urlsString.split(/[, ]/);
  var res = new Array();
  for (var i=0; i<urls.length; i++) {
      var u = urls[i];
      if (!u) continue;
      u = u.replace(/^\s+/,'');
      u = u.replace(/\s+$/,'');
      res.push(u);
  }
  return res;
}

// ----------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------

function showMessage(msg) {
    if (true) return;
    var div = document.getElementById("_message");
    if (!div) {
	div = document.createElement("P");
	div.innerHTML = msg;
	document.body.appendChild(div);
	div.id = "_message";
	div.style.position = "absolute";
	div.style.top = "0px";
	div.style.left = "0px";
	div.style.filter = "alpha(opacity=50);";
	div.style.opacity = "0.50";
	div.style.background = "#000";
	div.style.width = "300px";
	div.style.height = "150px";
	div.style.color = "#fff";
	div.style.fontWeight = "bold";
    }
    div.style.display = "normal";
    div.innerHTML = msg;
    setTimeout("var div = document.getElementById('_message');div.innerHTML = '';div.style.display = 'none';",3000);
    
}

function removeMessage() {
    var div = document.getElementById("_message");
    div.innerHTML = "";
    div.style.display = "none";
}

function showPreferences() {
    var newReddits = prompt("Don't want these reddits...Put unwanted domains and hit OK",
			    getValue("reddits",""));
    setValue("reddits",newReddits);
    reddits = getReddits();
}

function removeReddits() {
    var spans = document.getElementsByTagName("SPAN");
    for (var j=0; j<spans.length; j++) {
	if (spans[j].className != "domain") continue;
	var domain = spans[j].innerHTML;
	domain = domain.replace(/\(/g,'');
	domain = domain.replace(/\)/g,'');
	domain = domain.replace(/<[^>]*>/g,'');
	var removeIt = false;
	for (var i=0; i<reddits.length; i++) {
	    var r = reddits[i];
	    if (r == domain) {
		removeIt = true;
		break;
	    }
	}
	if (removeIt) removeArticleWithChild(domain,spans[j]);
    }
    if (removedReddits>0) {
	showMessage(removedReddits + " article" + (removedReddits==1 ? "" : "s") + " removed");
    }
}

function removeArticleWithChild(domain,n) {
    for (var trav = n; trav;trav = trav.parentNode) {
	if (trav.className && trav.className.match(/thing/)) {
	    if (trav.parentNode) trav.parentNode.removeChild(trav);
	    removedReddits++;
	    break;
	}
    }
}

function getNextLink(doc) {
    if (!doc) doc = document;
    var as = document.getElementsByTagName("A");
    for (var i=0; i<as.length; i++) {
	var a =as[i];
	if (a.innerHTML == 'next') return a.href;
    }
    return null;
}

function main() {
    GM_registerMenuCommand("Customize Reddit", showPreferences);
    reddits = getReddits();
    removeReddits();
    removeReddits();
}

try {main();} catch (e) {if (TESTING) alert("ERROR:" + e);}