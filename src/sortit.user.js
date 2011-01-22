// ==UserScript==
// @name          Reddit sorter
// @namespace     http://jeffpalm.com/sortit
// @description    Sorts reddit articles inline
// @include       http://*reddit.com/*
// ==/UserScript==

/*
 * Copyright 2006 Jeffrey Palm.
 */

var VERSION = 0.3;

// --------------------------------------------------
// misc
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

function insertBefore(newNode,target) {
  // http://lists.xml.org/archives/xml-dev/200201/msg00873.html
  var parent   = target.parentNode;
  var refChild = target; //target.nextSibling;  
  if(refChild) parent.insertBefore(newNode, refChild);
  else parent.appendChild(newNode);  
}

// --------------------------------------------------
// main
// --------------------------------------------------

function main() {
  addLinkAtTop();
}

function addLinkAtTop() {
  //
  // Create the new node
  //
  var span = $n("span");
  span.appendChild($t("[ sort by "));
  span.style.verticalAlign = "middle";

  function space(s) {
    s.appendChild($t(" "));
  }

  function addLink(type) {
    var a = $n("a");
    span.appendChild(a);
    a.href = "#";
    a.addEventListener('click',function() {_type=type; doSorting(_type);},true);
    a.appendChild($t(type));
    space(span);
  }
  
  addLink('points');
  addLink('time');
  addLink('comments');

  space(span);
  $t(" reverse? ",span);
  rev = $n("input",span);
  rev.type = "checkbox";
  rev.id = "reverse";
  rev.style.verticalAlign = "middle";


  $t(" ] ",span);
  
  msgSpan = $n("span",span);
  msgSpan.id = "msgSpan";

  tab = document.getElementById("topbar");
  tr = $n("tr",tab);
  td = $n("td",tab);
  td.appendChild(span);
  tab.insertBefore(tr,tab.firstChild);
}

function doUnsorting() {
  window.location = window.location;
}


function doSorting(type) {
  //
  // we'll keep those trs with a parent with id=siteTable
  // and is=site* or class=(even|odd)Row
  // we'll keep them together so the first element will
  // be the 'site' tr, the second the 'row' tr
  //
  var siteTR;
  var rowTR1 = 0;
  var rowTR2 = 0;
  var trs = document.getElementsByTagName("tr");
  var scores2trs = new Array(); // this holds pairs of trs and a score
  var debug = true;

  document.getElementById("msgSpan").innerHTML = "sorting by <em>" + type + "</em>";

  function reset() {
    rowTR1 = 0;
    rowTR2 = 2;
    siteTR = 0;
  }

  /**
   * Int String -> String
   */
  function convertTime(num,units) {
    res = num;
    //
    // we want this to be in reverse order
    //
    res = 60-res;
    if      (units.match(/hour/))    res *= 60;
    else if (units.match(/minute/))  res *= 60*60;
    return ""+res;
  }
  //
  // need to manage duplicates
  //
  scores2dups = [];
  /**
   * DOM -> (String[score] || 0)
   */
  var parseFunction;
  if (type == 'points') {
    //
    // <span id="score1008506">316 points</span>
    //
    parseFunction = function(tr) {
      scoreId = siteTR.id.replace(/site/,'score');
      scoreSpan = document.getElementById(scoreId);
      if (scoreSpan) {
        return scoreSpan.innerHTML.replace(/\s+.*/,''); // take away the points
      } else {
        return 0;
      }
    }
  } else if (type == 'time') {
    parseFunction = function(tr) {
      if (res = tr.innerHTML.match(/posted (\d+)\s+(\w+) ago by/)) {
        return convertTime(parseInt(res[1]),res[2]);
      } else {
        return 0;
      }
    }
  } else if (type == 'comments') {
    parseFunction = function(tr) {
      if (res = tr.innerHTML.match(/(\d+)\s+comment/)) {
        return res[1];
      } else {
        return 0;
      }
    }
  } else {
    alert("invalid type: " + type);
  }

  for (i=0; i<trs.length; i++) {
    var tr = trs[i];
    //
    // make sure we're in the right table
    //
    if (!tr.parentNode) continue;
    if (!tr.parentNode.id == "siteTable") continue;
    //
    // decide which TR this is
    //
    if (tr.id && tr.id.match(/^site.*/)) {
      siteTR = tr;
    } else if (tr.className && (tr.className == "oddRow" || tr.className == "evenRow")) {
      //
      // the first 'row' tr will NOT have the points
      //
      if (rowTR1 == 0) {
        rowTR1 = tr;
      } else {
        rowTR2 = tr;
        if (!(score = parseFunction(tr))) reset();
      }
    } else if (tr.firstChild && tr.firstChild.className && 
               (tr.firstChild.className == "oddRow spacing" ||
                tr.firstChild.className == "evenRow spacing")) {
      //
      // eliminate duplicates: just at another low-order digit
      // to any duplicates because this is really a partial ordering
      //
      newScore = parseFloat(score+".1");
      for (;;) {
        if (scores2dups[newScore]) {
          newScore = parseFloat(newScore+"1");
        } else {
          scores2dups[newScore] = 1;
          break;
        }
      }
      // if we both row TRs and a site TR this one is spacing
      //
      spacingTR = tr;
      scores2trs[newScore] = new Array(siteTR,rowTR1,rowTR2,spacingTR);
      //
      // reset the values
      //
      siteTR = 0;
      rowTR1 = 0;
      rowTR2 = 0;
      score  = 0;
    }
  }
  //
  // everyone's parent
  // set on the first go round
  //
  var parent;
  //
  // go three the pairs and remove each and then
  // add in order of their score
  //
  for (i in scores2trs) {
    group = scores2trs[i];
    //
    // remember the parent
    //
    if (!parent) parent = group[0].parentNode;
    //
    // remove the kids
    //
    for (j in group) {
      if (group[j].parentNode) group[j].parentNode.removeChild(group[j]);
    }
  }
  //
  // sort them by scores
  // http://www.javascriptkit.com/javatutors/arraysort3.shtml
  //
  scores = new Array();
  for (i in scores2trs) scores.push(i);
  rev = document.getElementById("reverse").checked;
  scores.sort(rev ? function (a,b) {return a-b;} : function (a,b) {return b-a;});
  //
  // add all the groups to parent
  //
  for (i=0; i<scores.length; i++) {
    //
    // this is ugly but i'm not sure (for <v> in ...)
    // is assured to do things in order
    //
    group = scores2trs[scores[i]];
    siteTR    = group[0];
    rowTR1    = group[1];
    rowTR2    = group[2];
    spacingTR = group[3];
    parent.appendChild(siteTR);
    parent.appendChild(rowTR1);
    parent.appendChild(rowTR2);
    parent.appendChild(spacingTR);
  }
}

try {main();} catch (e) {}

