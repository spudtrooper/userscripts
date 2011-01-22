// ==UserScript==
// @name          Wikipedia Appeals
// @namespace     http://jeffpalm.com/wikipedia
// @description   Remove personal appeals from wikipedia pages.
// @include       http://*wikipedia.org/*
// ==/UserScript==

function main() {
  setTimeout('var d = document.getElementById("centralNotice"); d.style.display = "none";',1000);
}

main();