// ==UserScript==
// @name          Google Plus
// @namespace     http://jeffpalm.com/googleplus/
// @description   Seaches googles first hit when you add a trailing '+'
// @include       http://*google.com/search*%2B
// ==/UserScript==

function main() {
  var as = document.getElementsByTagName("A");
  for (var i in as) {
    var a = as[i];
    if (a.className == "l") {
      document.location = a.href;
      break;
    }
  }
}

main();