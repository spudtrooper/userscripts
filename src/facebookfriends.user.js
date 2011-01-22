// ==UserScript==
// @name          Facebook Friends
// @namespace     http://jeffpalm.com/facebookfriends
// @description   Helper for finding friend similarities
// @include       http://jeffpalm.com/facebookfriends/results.php*
// @include       http://www.jeffpalm.com/facebookfriends/results.php*
// ==/UserScript==

/*
 * Copyright 2009 Jeffrey Palm.
 */

var TESTING = false;
var uids;
var currentNum;
var names2counts;
var totalNumFriends;

function debug(s) {
  var el = document.getElementById('_debug');
  if (el) el.innerHTML = s;
}

function $n(tag,onto) {
  var newNode = document.createElement(tag);
  if (onto) onto.appendChild(newNode);
  return newNode;
}

function sortNames2Counts(a,b) {
  return b.count - a.count;
}

function showResults() {
  var tab = document.getElementById('tab');
	alert(tab);
  tab.innerHTML = '';
  var tr;
  tr = $n('tr',tab);
  var th;
  th = $n('th',tr);
  th.width = '120px';
  th.innerHTML = 'Friend';
  th = $n('th',tr);
  th.width = '80px';
  th.innerHTML = 'Total';
  th = $n('th',tr);
  th.width = '80px';
  th.innerHTML = 'Common<br/>Friends';
  th = $n('th',tr);
  th.width = '80px';
  th.innerHTML = '% Their\'s<br/>in Common';
  th = $n('th',tr);
  th.width = '80px';
  th.innerHTML = '% Yours<br/>in Common';
  var sorted = names2counts.sort(sortNames2Counts);
  for (var i=0; i<sorted.length; i++) {
    var n2c = sorted[i];
    var uid = n2c.uid;
    var name = n2c.name;
    var total = n2c.total;
    var count = n2c.count;
    tr = $n('tr',tab);
    var td;

    td = $n('td',tr);
    var url = 'http://www.facebook.com/profile.php?id=' + uid;
    td.innerHTML = '<a target="_" href="' + url + '">' + name + '</a>';

    td = $n('td',tr);
    td.innerHTML = total;

    td = $n('td',tr);
    td.innerHTML = count;

    td = $n('td',tr);
    td.innerHTML = Math.floor(100.0 * parseInt(count) / parseInt(total)) + '%';

    td = $n('td',tr);
    td.innerHTML = Math.floor(100.0 * parseInt(count) / parseInt(totalNumFriends)) + '%';
  }
}

function processUIDs() {
  if (currentNum%5 == 1) {
    showResults();
  }
  if ((TESTING && currentNum >= 10) || uids.length == 0) {
    return;
  }
  var uid = uids.shift();
  currentNum += 1;
  debug('[' + currentNum + '] Looking up ' + uid + '...');
  var url = 'http://www.facebook.com/profile.php?id=' + uid;
    GM_xmlhttpRequest({
      method:"GET",
          url: url,
          headers:{
          "User-Agent": "monkeyagent",
            "Accept":"text/html,text/monkey,text/xml,text/plain",
            },
          onload: function(details) {
          var txt = details.responseText;
          if (txt) {
            var numFriends = -1;
            var totalFriends = -1;
            var name = null;
            if (res = txt.match(/(\d+) friends? in common/)) {
              numFriends = res[1];
            }
            if (res = txt.match(/<h1 id="profile_name"[^>]*>([^<]+)<\/h1>/)) { 	
              name = res[1];
            }
            if (res = txt.match(/<a href.*friends[^>]*>(\d+) friends?/)) {
              totalFriends = res[1];
            }
            if (name && numFriends>-1 && totalFriends>-1) {
              names2counts.push( { uid:uid, name:name, count:numFriends, total:totalFriends } );
            }
            processUIDs();
          }
        }
      });
}

function main() {
  var hash = document.location.hash;
  hash = hash.replace(/#/,'');
  uids = hash.split(',');
  totalNumFriends = uids.length;
  names2counts = new Array();
  currentNum = 0;
  processUIDs();
}

try {main();} catch (e) {if (TESTING) alert(e);}
