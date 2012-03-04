// ==UserScript==
// @name          Google + DuckDuckGo
// @namespace     http://jeffpalm.com/googleduckduckgo/
// @description   Redirects google searches starting with bang to duckduckgo.com
// @include       https://www.google.com/*
// @include       http://www.google.com/*
// ==/UserScript==

(function() {

    function cgiParams(url) {
	var path = url.replace(/.*\?/,'');
	var pairs = path.split(/&/);
	var res = {};
	for (var i=0; i<pairs.length; i++) {
	    var p = pairs[i].split(/=/);
	    var k,v;
	    if (p.length == 2) {
		k = p[0];
		v = p[1];
	    } else {
		k = p[0];
		v = "";
	    }
	    res[k] = v;
	}
	return res;
    }
    
    function main() {
	var url = String(document.location);
	var params = cgiParams(url);
	var q = params['q'];
	if (!!q) {
	    if (q.match(/^!/)) {
		document.location = 'https://duckduckgo.com/?q=' + q;
	    }
	}
    }
    
    main();
    
})();