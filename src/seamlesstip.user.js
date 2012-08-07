// ==UserScript==
// @name          Seamless web tip suggestions
// @namespace     http://jeffpalm.com/seamlesstip
// @description   Adds an additional tip based on current weather conditions
// @include       http://www.seamless.com/food-delivery/*
// ==/UserScript==

(function() {

  function useLocation(pos) {
    var c = pos.coords;
    var lat = c.latitude;
    var lng = c.longitude;
    console.log('lat:' + lat);
    console.log('lng:' + lng);
  }

  function errorLocation(error) {
    alert(error.code + ":" + error.message);
  }

  function main() {
    
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