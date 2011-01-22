// ==UserScript==
// @name          Meetoogle
// @namespace     http://jeffpalm.com/meetoogle/
// @description   Creates a preview pane out of selected links
// @include       http://www.google.com/search*
// ==/UserScript==

/*
 * Copyright 2008 Jeffrey Palm.
 */


function $n(tag,on) {
	var e = document.createElement(tag);
	if (on) on.appendChild(e);
	return e;
}
function addResult(ol,link,name,query) {
  var li = $n('li',ol);
  var a = $n('a',li);
  a.href = link;
  a.innerHTML = name;
}

function addResults(tr,txt,query) {
  // This sucks!
  var lines = txt.split(/\n/);
  var cnt = 0;
  var par = null;
  for (var i=0, cnt=0; i<lines.length && cnt<10; i++) {
    var line = lines[i];
    if (res = line.match(/<a href=\"([^\"]+)\" class=\"omnCamp omngj_sj2\">([^<]+)<\/a>/)) {
      var link = res[1];
      var name = res[2];
      if (!par) {
        var td = $n('td');
        tr.insertBefore(td,tr.firstChild);
        // <td id="rhsline" style="border-left: 1px solid rgb(201, 215, 241); padding-left: 10px;" class="std">
        td.style.borderLength = "1px solid rgb(201, 215, 241)";
        td.style.paddingLength = "10px";
        td.style.verticalAlign = "top";
        td.className = "std";
        // <h2 style="margin: 0pt; padding: 0pt; text-align: center;">Sponsored Links</h2>
        var h2 = $n('h2',td);
        h2.style.margin = "0pt";
        h2.style.padding = "0pt";
        h2.style.textAlign = "center";
        h2.innerHTML = "Meetup Links";
        // <ol onmouseover="return true" class="nobr">
        var ol = $n('ol',td);
        par = ol;
      }
      addResult(par,link,name,query);
      cnt++;
    }
  }
}

/**
 * Place three results.
 */
function placeResults(txt,query) {
  //
  // Place a new cell over the cell with id 'rhsline'
  //
  var tds = document.getElementsByTagName("TD");
  for (var i=0; i<tds.length; i++) {
    var td = tds[i];
    if (td.id == 'rhsline') {
      if (td.parentNode) {
        addResults(td.parentNode,txt,query);
        break;
      }
    }
  }
}

function newFunctionsearchMeetup(res,_query) {
  var query = _query;
  return function(res) {
    var txt = res.responseText;
    if (txt) placeResults(txt,query);
  }
}

function searchMeetup(query,zipcode) {
  // http://www.meetup.com/search/?keywords=pugs&radius=25&country=us&zip=10019
  var moddedQuery = query.replace(/\s+/,'+');
  var url = 'http://www.meetup.com/search/?keywords=' + moddedQuery + '&radius=25&country=us&zip=' + zipcode;
  GM_xmlhttpRequest({
    method:"GET",
        url: url, 
        headers:{
        "User-Agent": "monkeyagent",
          "Accept":"text/html,text/monkey,text/xml,text/plain",
          },
        onload: newFunctionsearchMeetup(res,query)
        });
}

function newFunctionFindMoreDetails(_query) {
  var query = _query;
  return function(res) {
    //
    // Grab the zip code
    //
    var txt = res.responseText;
    if (txt && (res = txt.match(/(\d{5})<\/b>\./))) {
      var zipcode = res[1];
      if (zipcode) {
        searchMeetup(query,zipcode);
      }
    }
  };
}

function findMoreDetails(query,a) {
  GM_xmlhttpRequest({
    method:"GET",
        url: a.href,
        headers:{
        "User-Agent": "monkeyagent",
          "Accept":"text/html,text/monkey,text/xml,text/plain",
          },
        onload: newFunctionFindMoreDetails(query)
        });
}


function main() {

  // Get the search
  var path = document.location.search;
  if (!path) return;

  // Get the query
  var query;
  if (res = path.match(/\&q=([^\&]+)/)) {
    query = res[1];
  }
  if (!query) return;

  // Find the more details link
  var as = document.getElementsByTagName("A");
  for (var i=0; i<as.length; i++) {
    var a = as[i];
    if (a.innerHTML == 'More details') {
      findMoreDetails(query,a);
    }
  }

}

main();
