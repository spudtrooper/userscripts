// ==UserScript==
// @name          WhatsMyWeather!
// @namespace     http://whatsmyweather.com/userscripts
// @description	  Gives weather for colleges.
// @include       http://bu.edu/*
// @include       http://www.bu.edu/*
// ==/UserScript==


// todo check for different colleges


var a = document.createElement("a");
a.setAttribute("href", "http://whatsmyweather.com/bu.html");
a.appendChild(document.createTextNode("WhatsMyWeather!"));

var li = document.createElement("li");
li.appendChild(a);

var tab = document.getElementById("sidenav");

tab.firstChild.appendChild(li);

