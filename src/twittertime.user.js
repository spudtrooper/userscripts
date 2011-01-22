// ==UserScript==
// @name          Twitter time
// @namespace     http://jeffpalm.com/twittertime
// @description   Shows the actual time for posts
// @include       http://*twitter.com/*
// ==/UserScript==

/*
 * Copyright 2009 Jeffrey Palm.
 */
const TESTING = true;

function changeArray(arr,target,dx) {
  for (var i=0; i<arr.length; i++) {
    if (arr[i] == target) {
      var newI = i+dx;
      if (newI > arr.length) {
	newI -= arr.length;
      } else if (newI < 0) {
	newI += arr.length;
      }
      return arr[newI];
    }
  }
  return target;
}

function changeMonth(mon,dx) {
  var mons = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return changeArray(mons,mon,dx);
}

function changeDay(day,dx) {
  var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return changeArray(days,day,dx);
}

function daysInTheMonth(month) {
  if (month == "Feb") {
    return 28;
  }
  if (month == "Jan" ||
      month == "Mar" || month == "May" || month == "Jul" ||
      month == "Aug" || month == "Oct" || month == "Dec") {
    return 31;
  }
  return 30;
}

function convertDate(d) {
  var now = new Date();
  var offset = now.getTimezoneOffset();
  var offsetHours = offset/60;
  //
  // Tue Oct 27 05:57:56 +0000 2009
  //
  // This is now a fucking nightmare, I'm not sure how to shift the
  // time zone so we'l do it manually (argh!)
  //
  var res;
  if (res = d.match(/(\w{3}) (\w{3}) (\d{2}) (\d{2}):(\d{2}):(\d{2}) \+0000 (\d{4})/)) {
    var dow = res[1];
    var mon = res[2];
    var dom = parseInt(res[3]);
    var hrs = parseInt(res[4]);
    var min = parseInt(res[5]);
    var sec = parseInt(res[6]);
    var yrs = parseInt(res[7]);

    hrs = hrs-offsetHours;
    if (hrs < 0 || hrs > 23) {
      // Stupid Java-like mods!
      if (hrs < 0) {
	hrs += 23;
      } else {
	hrs -= 23;
      }
      var dx = offsetHours > 0 ? -1 : 1;
      dow = changeDay(dow,dx);
      dom = dom+dx;
      var daysInThisMonth = daysInTheMonth(mon);
      //
      // Maybe change the month and year
      //
      if (dom < 1 || dom > daysInThisMonth) {
	mon = changeMonth(mon,dx);
	dom = dom<1 ? daysInThisMonth(mon) : 1;
	if (mon == "Jan") {
	  yrs++;
	} else if (mon == "Dec") {
	  yrs--;
	}
      }
    }
    // Tue Oct 27 05:57:56 +0000 2009
    return dow + " " + mon + " " + dom + " " + hrs + ":" + min + ":" + sec + " " + yrs;
  }
  return d;
}

function main() {
  var spans = document.getElementsByTagName("span");
  for (var i=0; i<spans.length; i++) {
    var s = spans[i];
    if (s.className != "published timestamp") continue;
    var data = s.getAttribute("data");
    var res;
    if (res = data.match(/'([^\']+)'/)) {
      var date = res[1].replace(/\'/,'');
      var em = document.createElement("em");
      s.innerHTML += " at ";
      em.innerHTML = convertDate(date);
      s.appendChild(em);
    }
  }
}

try {main();} catch (e) {if (TESTING) alert("ERROR:" + e);}