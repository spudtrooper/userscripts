// ==UserScript==
// @name          Twitter Hover
// @namespace     http://jeffpalm.com/twitterhover/
// @description   Puts more information in the mouse over pop up for Twitter users
// @include       http://*twitter.com/*
// ==/UserScript==

/*
 * Copyright 2009 Jeffrey Palm.
 */
const TESTING = true;
var usernames2msgs = new Array();

function newFunction(_a,_username) {
    var a = _a;
    var username = _username;
    return function(e) {
	var url = a.href;
	GM_xmlhttpRequest({
		method: 'GET',
		    url: url,
		    headers: {},
		    onload: function(response) {
		    if (!response.responseXML) {
			response.responseXML = 
			    new DOMParser().parseFromString
			    (response.responseText, "text/xml");
		    }
		    function nl(title,value) {
			if (value) msg += title + ": " + value + " -- ";
		    }
		    function getCount(id,title) {
			var el = doc.getElementById(id);
			if (!el) return;
			var count = el.innerHTML;
			nl(title,count);
		    }
		    var msg = usernames2msgs[username];
		    if (!msg) {
			msg = "";
			msg += username + " -- ";
			var doc = response.responseXML;
			getCount("following_count","Following");
			getCount("follower_count","Followers");
			getCount("update_count","Tweets");
			var spans = doc.getElementsByTagName("span");
			for (var i=0; i<spans.length; i++) {
			    var s = spans[i];
			    if (s.className == "fn") {
				nl("Name",s.innerHTML);
			    } else if (s.className == "adr") {
				nl("Location",s.innerHTML);
			    } else if (s.className == "url") {
				nl("Web",s.innerHTML);
			    } else if (s.className == "bio") {
				nl("Bio",s.innerHTML);
			    }
			}
			usernames2msgs[username] = msg;
		    }
		    a.title = msg;
		}
	    });	
    }
}

function main() {
    var as = document.getElementsByTagName("A");
    for (var i=0; i<as.length; i++) {
	var a = as[i];
	var href = a.href;
	if (!href) continue;
	var res;
	if (res = href.match(/http\:\/\/twitter\.com\/([^\/]+)/)) {
	    var username = res[1];
	    a.addEventListener('mouseover',newFunction(a,username),true);
	}
    }
}

try {main();} catch (e) {if (TESTING) alert("ERROR:" + e);}