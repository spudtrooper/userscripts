// ==UserScript==
// @name          Seamless web tip suggestions
// @namespace     http://jeffpalm.com/seamlesstip
// @description   Adds an additional tip based on current weather conditions
// @include       http://www.seamless.com/food-delivery/*
// ==/UserScript==

(function() {

  const API_KEY = 'b96d9f3b9d9ad40c';
  const GEOLOOKUP_URL = 'http://api.wunderground.com/api/' + API_KEY + '/geolookup/q/';
  const CONDITIONS_URL = 'http://api.wunderground.com/api/' + API_KEY + '/conditions/q/';

  function useWeather(data) {
    console.log('data');
    console.log(data);
  }

  function useCoords(pos) {
    var c = pos.coords;
    var lat = c.latitude;
    var lng = c.longitude;
    log('Searching for location of ' + lat + ',' + lng);
    var url = GEOLOOKUP_URL + lat + ',' + lng + '.json';
    ajax(url,useLocation);
  }

  function useLocation(json) {
    var res = JSON.parse(json);
    var location = res['location'];
    var city = location['city'].replace(/ /,'_');
    var state = location['state'].replace(/ /,'_');
    log('Searching for weather for ' + city + ',' + state);
    var url = CONDITIONS_URL + state + '/' + city + '.json';
    ajax(url,useConditions);
  }
  
  function Increase() {
    this.inc = 0;
    this.reasons = [];
  }
  
  Increase.prototype = {
    addInc: function(inc,reason) {
      this.inc += inc;
      this.reasons.push(reason);
    },
    getReasons: function() {
      return this.reasons;
    },
    getInc: function() {
      return this.inc;
    }
  };

  function checkLt(inc,val,min,what,n) {
    n = n || 25;
    if (val <= min) {
      var reason = 'The ' + what + ' is low';
      inc.addInc(n,reason);
    }
  }
  function checkGt(inc,val,max,what,n) {
    n = n || 25;
    if (val >= max) {
      var reason = 'The ' + what + ' is high';
      inc.addInc(n,reason);
    }
  }

  // min:Integer max:Integer what:String
  var CRITERIA = [

  ];

  function useConditions(json) {
    var res = JSON.parse(json);
    var obs = res['current_observation'];
    var temp_f = parseFloat(obs['temp_f']); // 86.1
    var wind_mph = parseFloat(obs['wind_mph']); // 2
    var heat_index_f = parseFloat(obs['heat_index_f']); // 89
    var visibility_mi = parseFloat(obs['visibility_mi']); // 10.0
    var precip_1hr_in =  parseFloat(obs['precip_1hr_in']); // 0.0
    var precip_today_in = parseFloat(obs['precip_today_in']); // 0.0

    log('temp_f=' + temp_f);
    log('wind_mph=' + wind_mph);
    log('heat_index_f=' + heat_index_f);
    log('visibility_mi=' + visibility_mi);
    log('precip_1hr_in=' + precip_1hr_in);
    log('precip_today_in=' + precip_today_in);

    var inc = new Increase();

    checkLt(inc,temp_f,30,'Temperature');
    checkGt(inc,heat_index_f,85,'Heat index');
    checkGt(inc,wind_mph,15,'Wind');
    checkLt(inc,visibility_mi,0.25,'Visibility');
    checkGt(inc,precip_1hr_in,1.0,'Precipitation',15);
    checkGt(inc,precip_today_in,6.0,'Precipitation',15);
    
    resetTip(inc);
  }

  function resetTip(inc) {
    if (inc.getInc() == 0) {
      log('No increase');
      return;
    }
    var tip = findTip();
    var newTip = tip * (1 + (inc.getInc() / 100.0));
    var roundedTip = ( (100*newTip/4) * 4 ) / 100.0;
    var realTip = setNewTip(roundedTip);
    var msg = 'Upped the tip from $' + tip + ' to $' + realTip + ' because:';
    var reasons = inc.getReasons();
    for (var i=0; i<reasons.length; i++) {
      msg += "\n" + ' - ' + reasons[i];
    }
    alert(msg);
  }

  function setNewTip(tip) {
    log('Setting tip to ' + tip);
    var sel = tipAmountSel();
    var opt = null; // Reset the last one if none is selected
    for (var i=0; i<sel.options.length; i++) {
      var opt = sel.options[i];
      if (parseFloat(opt.value) >= tip) {
	break;
      }
    }
    if (!!opt) {
      opt.selected = true;
      var js = 'javascript:tipChanged("/Food-Delivery");void(0);';
      document.location = js;
    }
    return parseFloat(opt.value);
  }

  function tipAmountSel() {
    return document.getElementById('tipAmount');
  }
  
  function findMaxTip() {
    var sel = tipAmountSel();
    var opt = sel.options[sel.options.length-1];
    return dollar(opt);
  }

  function dollar(opt) {
    return String(opt.innerHTML).replace(/\$/,'');
  }

  function findTip() {
    var sel = tipAmountSel();
    return parseFloat(sel.value);
  }

  function log(msg) {
    try {
      console.log(msg);
    } catch (e) {}
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
  function waitForTipAmount() {
    log('Waiting for tip amount...');
    var sel = tipAmountSel();
    if (!sel) {
      setTimeout(waitForTipAmount,1000);
    } else {
      go();
    }
  }

  function go() {
    log('go');
    var geo = navigator.geolocation;
    if (geo) {
      geo.getCurrentPosition(useCoords, errorLocation, {
	enableHighAccuracy: true,
	maximumAge: 600000
      });
    } else {
      alert("Couldn't create geolocation");
    }
  }

  function main() {
    waitForTipAmount();
  }

  main();

})();