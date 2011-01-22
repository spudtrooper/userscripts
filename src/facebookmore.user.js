// ==UserScript==
// @name          Facebook more
// @namespace     http://jeffpalm.com/facebookmore/
// @description   Adds an ajax paginator on your home page
// @include       http://*facebook.com/home.php*
// ==/UserScript==

/*
 * Copyright 2009 Jeffrey Palm.
 */

const TESTING = false;
const SCROLL_Y_DIFF = 600;
var maxY = 0;

function findPosX(obj) {
  var curleft = 0;
  if (!obj) return curtop;
  if(obj.offsetParent)
    while(1) 
      {
	curleft += obj.offsetLeft;
	if(!obj.offsetParent)
	  break;
	obj = obj.offsetParent;
      }
  else if(obj.x)
    curleft += obj.x;
  return curleft;
}

function findPosY(obj) {
  var curtop = 0;
  if (!obj) return curtop;
  if(obj.offsetParent)
    while(1)
      {
	curtop += obj.offsetTop;
	if(!obj.offsetParent)
	  break;
	obj = obj.offsetParent;
      }
  else if(obj.y)
    curtop += obj.y;
  return curtop;
}

function getLastNextLink() {
  var as = document.getElementsByTagName("A");
  for (var i in as) {
    var a = as[i];
    if (a.innerHTML.match(/Older Posts/)) return a;
  }
  return null;
}

function fireEvent(obj,evt){
  var fireOnThis = obj;
  if( document.createEvent ) {
    var evObj = document.createEvent('MouseEvents');
    evObj.initEvent( evt, true, false );
    fireOnThis.dispatchEvent(evObj);
  } else if( document.createEventObject ) {
	  fireOnThis.fireEvent('on'+evt);
  }
}

function expandLink(nextLink) {
  fireEvent(nextLink,'click');
}

function checkMaxY() {
  //
  // Find the next link and calculate the next Y coordinate that will
  // trigger a load
  //
  var nextLink = getLastNextLink();
  if (!nextLink) return;
  var y = findPosY(nextLink);
  var curY = window.scrollY;
  if (y > maxY) maxY = y;
  if (curY+SCROLL_Y_DIFF >= maxY) expandLink(nextLink);
}

function main() {
  checkMaxY();
  setInterval(checkMaxY,3000);
}

try {main();} catch (e) {if (TESTING) alert('Error: ' + e);}
