// ==UserScript== 
// @name Feedly Next/Prev
// @description Adds next/previous buttons to feedly.com
// @namespace http://jeffpalm.com/feedly-nextprev
// @include http://feedly.com/*
// @include http://www.feedly.com/*
// ==/UserScript==

(function() {

  var curLink = -1;
  var locWhenWeCreatedLinks = null;
  var links = null;

  function move(inc) {
    var links = getLinks();
    if (curLink == -1) {
      inc = 1;
    }
    nextLink = curLink + inc;
    if (nextLink >= 0 && nextLink < links.length) {
      curLink = nextLink;
      showLink(curLink,links);
    }
  }

  function fireEvent(obj,evt){
    var fireOnThis = obj;
    if(document.createEvent) {
      var evObj = document.createEvent('MouseEvents');
      evObj.initEvent(evt,true,false);
      fireOnThis.dispatchEvent(evObj);
    } else if (document.createEventObject) {
      fireOnThis.fireEvent('on'+evt);
    }
  }
    
  function showLink(curLink,links) {
    var a = links[curLink];
    a.focus();
    fireEvent(a,'mouseover'); 
    setTimeout(function(e) {fireEvent(a,'mousedown');},300);
      
  }

  function getLinks() {
    var loc = String(document.location);
    if (!links || locWhenWeCreatedLinks != loc) {
      links = [];
      var as = document.getElementsByTagName('A');
      for (var i=0; i<as.length; i++) {
	var a = as[i];
	if (a.id && a.id.match(/_main_title$/)) {
	  links.push(a);
	}
      }
      locWhenWeCreatedLinks = loc;
      curLink = -1;
    }
    return links;
  }

  function main() {
    window.addEventListener('keydown',function(e) {
      switch (e.keyCode) {
	case 37: move(-1); break;
	case 39: move(+1); break;
      }
    },true);
  }

  main();

})();