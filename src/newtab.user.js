// ==UserScript==
// @name          Double click new tab
// @namespace     http://jeffpalm.com/newtab
// @description   Opens links in a new tab when you double click
// @include       *
// ==/UserScript==

const WAIT_TIME = 200;
var dblClickFlag = false;
var savedA = null;
var savedHref = null;

function checkOnDblClick() {
  if (dblClickFlag) {
    savedA.href = savedHref;
    dblClickFlag = false;
    document.location = savedHref;
    return true;
  }
  return false;
}

function newDblClickFunction(a) {
  var a_ = a;
  return function(e) {
    if (dblClickFlag) {
      window.open(savedHref,"_");
      dblClickFlag = false;
    }
    return false;
  };
}

function newClickFunction(a) {
  if (dblClickFlag) return false;
  var a_ = a;
  return function(e) {
    savedA = a_;
    savedHref = a_.href;
    a_.href = "#";
    dblClickFlag = true;
    setTimeout(checkOnDblClick,WAIT_TIME);
    return false;
  };
}

function main() {
  var nextId = 0;
  var as = document.getElementsByTagName("A");
  for (var i=0; i<as.length; i++) {
    var a = as[i];
    var href = a.href;
    if (!href || href == "#") continue;
    if (!href.match(/^\w+\:\/\//)) continue;
    var span = document.createElement("span");
    span.stylezIndex = 10;
    var next = a.nextSibling;
    var par = a.parentNode;
    par.removeChild(a);
    span.appendChild(a);
    if (next == null) {
      par.appendChild(span);
    } else {
      par.insertBefore(span,next);
    }
    span.addEventListener("click",newClickFunction(a),true);
    span.addEventListener("dblclick",newDblClickFunction(a),true);
  }
}

main();