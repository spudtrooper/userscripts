// ==UserScript==
// @name          Facebook poll
// @namespace     http://jeffpalm.com/facebookpoll
// @description   Finds users who like Mitt Romney
// @include       https://www.facebook.com/*
// ==/UserScript==

(function() {

  const KEY = '_facebookPoll';
  const FRIEND_URL = '_friendUrl';
  const INTERVAL = 3000;
  const TRUE = 'true';
  const FALSE = 'false';

  function shuffle(s) {
    var a = s.split(""), n = a.length;
    for(var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join("");
  }
  
  function dohaveIt(a) {
    a.style.color = '#aa0000';
    a.style.textDecoration = 'line-through';
    a.style.strike = true;
  }
  
  function dontHaveIt(a) {
    a.style.color = '#00aa00';
  }

  function checkFriends() {
    log('checkFriends');
    var as = document.getElementsByTagName("A");
    var link = null;
    for (var i=0; i<as.length; i++) {
      var a = as[i];
      if (!!a.href && !a.href.match(/pages/) && 
	  !!a.getAttribute('data-hovercard')) {
	var key = String(a.href);
	var haveIt = getValue(key);
	log('haveIt ' + key + ":" + haveIt);
	if (!haveIt || (!!haveIt && (haveIt == TRUE || haveIt == FALSE))) {
	  if (haveIt == TRUE) {
	    dohaveIt(a);
	  } else {
	    dontHaveIt(a);
	  }
	} else {
	  if (!link) {
	    link = a.href;
	  }
	}
      }
    }
    if (!!link) {
      if (String(document.location).match(/\?id=/)) {
	document.location = link + '&sk=favorites';
      } else {
	document.location = link + '/favorites';
      }
    } else {
      log('Done');
    }
  }
    
 function checkFavorites() {
   log('checkFavorites');
   var check = getValue('check');
   if (!check) {
     check = 'Mitt Romney';
   }
   var html = String(document.body.innerHTML);
   var haveIt = html.match(check);
   var key = String(document.location).replace(/\/favorites\/?/,'');
   setValue(key, haveIt ? TRUE : FALSE);
   document.location = getValue(FRIEND_URL);
 }

  function log(msg) {
    try {
      console.log(msg);
    } catch (_) {}
  }

  function setValue(key,v) {
    localStorage.setItem(KEY + key, v);
  }

  function getValue(key) {
    return localStorage.getItem(KEY + key);
  }

  function main() {
    realMain();
    setInterval(realMain, INTERVAL);
  }

  function realMain() {
    console.log('starting...');
    var loc = String(document.location);
    if (loc.match(/\/friends/)) {
      setValue(FRIEND_URL, loc);
      checkFriends();
    } else if (loc.match(/\/favorites/) || loc.match(/sk=favorites/)) {
      checkFavorites();
    }
  }

  main();
})();