// ==UserScript==
// @name          Digg cloud
// @namespace     http://jeffpalm.com/diggcloud
// @description    Makes the font a difference size based on points
// @include       http://*digg.com/*
// ==/UserScript==

/*
 * Copyright 2007 Jeffrey Palm.
 */

var VERSION = 0.1;

// --------------------------------------------------
// main
// --------------------------------------------------

function main() {
  changeSizes();
}

function changeSizes() {
  //
  // build a list of scores and titles
  //
  var trs = document.getElementsByTagName('h3');
  var scoresAndTitles = new Array();
  var min;
  var max;
  for (var i=0; i<trs.length; i++) {
    var tr = trs[i];

    // <h3 id="title0">
    if (!tr.id || !tr.id.match(/title\d+/)) continue;

    // <strong id="diggs-strong-0">
    scoreId = tr.id.replace(/title/,'diggs-strong-');
    scoreSpan = document.getElementById(scoreId);
    if (!scoreSpan) continue;
    score = parseInt(scoreSpan.innerHTML.replace(/\s+.*/,''));
    titleSpan = tr.firstChild;
    scoresAndTitles.push(score);
    scoresAndTitles.push(titleSpan);
    //
    // keep track of the min and max
    //
    if (!max || score>max) max = score;
    if (!min || score<min) min = score;
  }
  //
  // change the font on all of these
  // we want the min to have a font-size of 'LO' em and the
  // max 'HI' em y=m*x+b and we fit so
  //
  //  m*min+b =  LO
  //  m*max+b =  HI
  //
  var HI = 3;
  var LO = 1;
  var m = (HI-LO) / (max-min);
  var b = LO;
  for (var i=0; i<scoresAndTitles.length;) {
    var score = scoresAndTitles[i++];
    var title = scoresAndTitles[i++];
    var size = m*score + b;    
    title.style.fontSize = size + "em";
  }
}

main();
