// ==UserScript==
// @name          Seamless web tip suggestions
// @namespace     http://jeffpalm.com/seamlesstip
// @description   Adds an additional tip based on current weather conditions
// @include       http://www.seamless.com/food-delivery/*
// ==/UserScript==

(function() {

  function useWeather(data) {
    console.log('data');
    console.log(data);
  }

  function useLocation(pos) {
    var c = pos.coords;
    var lat = c.latitude;
    var lng = c.longitude;
    
    // Look up weather
    var url = 
      'http://api.wunderground.com/api/b96d9f3b9d9ad40c/geolookup/q/'
      + lat + ',' + lng + '.json';
    ajax(url,useWeather);
  }

  function ajax(url,f) {
    var xmlHttp = new XMLHttpRequest(); 
    xmlHttp.onreadystatechange = function () { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) { 
	f.call(this,xmlHttp.responseText); 
      } 
    }; 	
    xmlHttp.open('GET',url,true);
    xmlHttp.send(null);
  }

  function errorLocation(error) {
    alert(error.code + ":" + error.message);
  }

  function main() {
    
    // Find location
    var geo = navigator.geolocation;
    if (geo) {
      geo.getCurrentPosition(useLocation, errorLocation, {
	enableHighAccuracy: true,
	maximumAge: 600000
      });
    } else {
      alert("Couldn't create geolocation");
    }
  }

  main();
})();