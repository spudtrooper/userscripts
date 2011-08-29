// ==UserScript==
// @name          Gmail Title
// @namespace     http://jeffpalm.com/gmailtitle
// @description   Makes the gmail title somewhat useful
// @include       https://mail.google.com/mail/*
// ==/UserScript==

(function() {

  const FUDGE_KEY = 'fudge.factor';
  var ignoreNextChange = false;

  /** 
   * Set this fudge factor to the positive integer number of un-read
   * messages that you don't care about so that the title can show 0
   * messages, even if you have more than that. 
   */
  function getTotalFudgeFactor() {
    var fudgeKey = FUDGE_KEY;
    var res = 0;
    try {
      res = parseInt(localStorage.getItem(FUDGE_KEY));
      if (res < 0) {
	note('You called localStorage.setItem("' + 
	     fudge_key + '",' + res + ') with an invalid value.' +
	     'Please call localStorage.setItem("' + fudgeKey + '",v) ' +
	     'where \'v\' >= 0');
	return 0;
      }
    } catch (e) {}
    return res;
  }

  function note(str) {
    try {
      console.log('[gmail little] ' + str);
    } catch (e) {}
  }

  function changeTitle() {
    note('[changeTitle] enter');
    if (ignoreNextChange) {
      ignoreNextChange = false;
      return;
    }
    var t = String(document.title);
    var res = t.match(/([^\(]+)(\(\d+\))(.*)/);
    if (res) {
      ignoreNextChange = true;
      var fudge = getTotalFudgeFactor();
      var realTotal = parseInt(res[2].replace(/\D/g,""));
      var total = realTotal;
      if (fudge > 0) {
	total -= fudge;
	note('Fudging the total with fudge factor \'' + fudge + 
	     '\' from ' + realTotal + ' -> ' + total);
      }
      var title = total + " - " + res[1] + res[3];
      document.title = title;
    }
  }
  function main() {
    var titleEl = document.getElementsByTagName("title")[0];
    var docEl = document.documentElement;
    if (docEl && docEl.addEventListener) {
      docEl.addEventListener("DOMSubtreeModified", function(evt) {
        var t = evt.target;
        if (t === titleEl || (t.parentNode && t.parentNode === titleEl)) {
	  changeTitle();
        }
      }, false);
    } else {
      document.onpropertychange = function() {
        if (window.event.propertyName == "title") {
          changeTitle();
        }
      };
    }
    changeTitle();
  }
  main();
})();