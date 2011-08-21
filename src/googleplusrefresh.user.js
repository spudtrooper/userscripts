// ==UserScript==
// @name          Refresh Google+
// @namespace     http://jeffpalm.com/googleplusrefresh/
// @description   Refreshes Google+ periodically and shows 
//                unread articles in the title
// @include       https://plus.google.com/*

// ==/UserScript==

//
// Copyright 2011 Jeffrey Palm.
//

(function() {

  const PERIOD = 5 * 60 * 1000;
  var readUpdateIds = [];
  var originalTitle = null;
  var numUnreadUpdates = 0;

  /**
   * f: Element -> Void
   */
  function iterateOnUpdateDivs(f) {
    var divs = document.getElementsByTagName('div');
    for (var i=0; i<divs.length; i++) {
      var div = divs[i];
      var res;
      if (!!div.id && (res = div.id.match(/^update-(.*)/))) {
	f(div);
      }
    }
  }

  function updateTitle() {
    if (numUnreadUpdates == 0) {
      document.title = originalTitle;
    } else {
      document.title = originalTitle + ' (' + numUnreadUpdates + ')';
    }

  function update() {
    iterateOnUpdateDivs(function(div) {
      var _div = div;
      if (!!div.id && readUpdateIds.indexOf(div.id) != -1) {
	numUnreadUpdates++;
	_div.addEventListener('mouseover',function(e) {
	  if (readUpdateIds.indexOf(_div.id) != -1) {
	    readUpdateIds.push(_div.id);
	    updateTitle();
	  }
	});
	updateTitle();
      }
    });
  }

  function init() {
    iterateOnUpdateDivs(function(div) {
      readUpdateIds.push(div.id);
    });
    originalTitle = document.title;
    numUnreadUpdates = 0;
  }

  function main() {
    init();
    update();
    setInterval(update,PERIOD);
  }

  main();

})();