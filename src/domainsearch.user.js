// ==UserScript==
// @name          Domain Search
// @namespace     http://jeffpalm.com/domainsearch
// @description   Helps you out when you search for a domain name instead of just typing it into the address bar
// @include       http://*google*/search?q=*
// ==/UserScript==


function main() {
    var loc = String(document.location);
    var res;
    if (res = loc.match(/q=([^\&]+)/)) {
	var q = res[1].replace(/\+/g," ");
	if (q.match(/^(\w+:\/\/)?[\w-_]+(\.[\w-_]+)*\.\w\w?\w?\w?\w?$/)) {
	    var url = q;
	    alert("Type it in the fucking address bar:\n\n" + url);
	    if (!url.match(/^\w+:\/\//)) {
		url = "http://" + url;
	    }
	    document.location = url;
	}
    }
}

main();
