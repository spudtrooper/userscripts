// ==UserScript==
// @name          No Farmville
// @namespace     http://jeffpalm.com/nofarmville
// @description   Removes status updates about farmville
// @include       http://*facebook.com/*
// ==/UserScript==

function main() {

  var divs = document.getElementsByTagName("DIV");
  var targets = [];
  for (var i in divs) {
    var d = divs[i];
    if (d.id.match(/^div\_story\_.*/)) {
	var c = d.innerHTML;
	if (c.match(/apps\.facebook\.com\/onthefarm/) ||
	    c.match(/farmville/i)) {
	  targets.push(d);
	}
      }
  }
  
  var count = 0;
  for (var i in targets) {
    var node = targets[i];
    node.parentNode.removeChild(node);
  }
}

main();
