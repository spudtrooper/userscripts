// ==UserScript==
// @name          Y Combinator colorizer
// @namespace     http://jeffpalm.com/ycombinatorcolor/
// @description   Colorizes the y combinator news scores
// @include       http://*news.ycombinator.com/*
// ==/UserScript==

/*
 * Copyright 2010 Jeffrey Palm.
 */

var TESTING = false;


function main() {
  var divs = document.getElementsByTagName("SPAN");
  var scores = [];
  var min;
  var max;
  for (var i=0; i<divs.length; i++) {
    var d = divs[i];
    if (d.id && d.id.match(/score_\d+/)) {
      var s = d.innerHTML;
      var res;
      if (res = s.match(/(\d+)/)) {
	var n = res[0];
	var score = parseInt(n);
	scores.push(d);
	if (!min || score<min) min = score;
	if (!max || score>max) max = score;
      }
    }
  }
  for (var i=0; i<scores.length; i++) {
    var d = scores[i];
    var v = parseInt(d.innerHTML);
    var cval = Math.floor(0xff - 0xee*(max-v)/(max-min));
    var color = cval.toString(16) + "0000";
    d.style.color = "#" + color;
  }
}

try {main();} catch (e) {if (TESTING) alert('Error: ' + e);}
