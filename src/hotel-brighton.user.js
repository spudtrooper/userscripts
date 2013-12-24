// ==UserScript==
// @name          Hotel Brighton WiFi
// @namespace     http://jeffpalm.com/hotel-brighton
// @description   Bypasses the log in screen for hotel brighton wifi
// @include       http://192.168.*.1/cgi-bin/hotspotlogin.cgi*res=notyet*
// ==/UserScript==
(function() {
    
  const ROOM = 401;
  const LAST_NAME = 'palm';
  
  function main() {
    var inputs = document.getElementsByTagName('input');
    var button = null;
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (input.name == 'UserName') {
	input.value = ROOM;
      }
      if (input.name == 'Password') {
	input.value = LAST_NAME;
      }
      if (input.type == 'submit') {
	button = input;
      }
    }
    if (!button) {
      alert("Couldn't find a submit button!");
      return;
    }
    button.click();
  }
  
  main();
  
})();
