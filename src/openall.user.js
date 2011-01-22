// ==UserScript==
// @name          Open all
// @namespace     http://jeffpalm.com/openall
// @description	  Opens all reddit articles
// @include       http://*reddit.com/*
// ==/UserScript==

/*
 * Copyright 2007 Jeffrey Palm.
 */

var VERSION = 0.1;

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

// --------------------------------------------------
// main
// --------------------------------------------------

function main() {
	addLinkAtTop();
}

function addLinkAtTop() {

  // Find the stats node
  as = document.getElementsByTagName("a");
  statsNode = 0;
  for (i=0; i<as.length; i++) {
    a = as[i];
    if (a.className && a.className == "menu-item" &&
        a.innerHTML && a.innerHTML == "stats") {
      statsNode = a;
      break;
    }
  }
  
  if (!statsNode) return;
  
  // Create the new node
  // <a class='menu-item' href='/stats'>stats</a>
  span = $n("span",statsNode.parentNode);
  span.className = "menu-item";
  a = $n("a",span);
	a.href = "#";
  a.innerHTML = "open all";
	a.addEventListener('click',openAll,true);

  // Create the limiter choice drop down
  c = $n("select",span);
  c.className = "txt";
  c.id = "limitChoice";
  for (i=1; i<=27; i++) {
    o = $n("option",c);
    o.className = "txt";
    o.value = i;
    o.innerHTML = i;
    o.style.backgroundColor = "#ffffff";
  }

  // reverse option
  $t(" reverse? ",span);
  rev = $n("input",span);
  rev.type = "checkbox";
  rev.id = "reverse";
  rev.className = "txt";
  rev.style.verticalAlign = "middle";

}

function openAll() {

  // First get the limit
  limit = -1;
  c = document.getElementById("limitChoice");
  if (c) {
    sel = c.options[c.selectedIndex].value;
    if (sel.match(/\d+/)) limit = sel;
  }
  
  as = document.getElementsByTagName("a");
  scores2nodes = new Array();
  for (i=0; i<as.length; i++) {
    a = as[i];
    if (a.href && a.id && a.id.match(/title\d+/)) {
      // get the score
      scoreNode = document.getElementById(a.id.replace(/title/,"score"));
      // take away the points
      score = scoreNode.innerHTML.replace(/\s+.*/,""); 
      scores2nodes[score] = a;
    }
  }

  // sort by points
  // http://www.javascriptkit.com/javatutors/arraysort3.shtml
  scores = new Array();
  for (i in scores2nodes) scores.push(i);
  rev = document.getElementById("reverse").checked;
  scores.sort(rev ? function (a,b) {return a-b;} : function (a,b) {return b-a;});
  

  for (i=0, openned=0; i<scores.length; i++) {
    a = scores2nodes[scores[i]];
    GM_openInTab(a.href);
    openned++;
    if (limit != -1 && openned >= limit) break;
  }
}

try {main();} catch (e) {alert(e);}

