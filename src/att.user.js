// ==UserScript==
// @name          Bypass AT&T Paperless Billing Question
// @namespace     http://jeffpalm.com/code/
// @description   Automatically selects 'ask you later', and then next when logging into AT&T wireless site.
// @include       https://www.wireless.att.com/olam/dashboardAction.olamexecute
// @include       https://www.wireless.att.com/olam/loginAction.olamexecute

// ==/UserScript==

/*
 * Copyright 2009 Jeffrey Palm.
 */

var TESTING = String(document.location).match(/jeffpalm.com\/att/);

function main() {

  // Find the form input and make it checked, we want the last one,
  // because I can't seem to access the attributes of the input elements
  var inputs = document.getElementsByTagName("input");
  var count = 0;
  var haveAnInput = false;
  for (var i=0; i<inputs.length; i++) {
    var input = inputs[i];
    if (input.type == "radio") {
      input.checked = true;
      haveAnInput = true;
  }
  }
  
  // Submit it if we're on the right page, because this form will
  // submit the same URL
  if (haveAnInput) document.forms[0].submit();
}

try {main();} catch (e) {if (TESTING) alert(e);}
