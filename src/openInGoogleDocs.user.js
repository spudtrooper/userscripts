// ==UserScript==
// @name          Open in google docs
// @namespace     http://jeffpalm.com/
// @description   Provides link to open in google docs
// @include       http://*
// @include       https://*
// @include       ftp://*
// ==/UserScript==

/*
 * Copyright 2011 Jeffrey Palm.
 */

(function() {

  const EXTENSIONS_PATTERN =
    "\.(pdf|doc|txt|html|rtf|odt|xls|csv|ods|ppt)$"

  function googleDocsUrl(url) {
    return 
    "http://docs.google.com/?DocAction=updoc&formsubmitted=true&uploadURL=" +
      escape(url);
  }

  function main() {
    var as = documents.getElementsByTagName("A");
    if (as.length < 0) return;
    var re = new Regex(EXTENSIONS_PATTERN,'i');
    for (var i=0; i<as.length; i++) {
      var a = as[i];
      var href = a.href;
      if (!href) continue;
      if (re.test(href)) {
	alert(href);
	break;
      }
    }
  }

  main();

})();