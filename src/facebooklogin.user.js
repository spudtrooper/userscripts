// ==UserScript==
// @name          Facebook login
// @namespace     http://jeffpalm.com/facebooklogin/
// @description   Automatically submits the login form for facebook so you don't have to click it.
// @include       http://facebook.com/*
// @include       http://www.facebook.com/*
// @include       http://facebook.com/index.php*
// @include       http://www.facebook.com/index.php*
// @include       http://facebook.com/login.php*
// @include       http://www.facebook.com/login.php*
// ==/UserScript==

/*
 * Copyright 2009 Jeffrey Palm.
 */


function main() {
  var loc = document.location + "";
  if (loc.match(/.*login.php.*/)) {
    realMain('login','email','pass',true);
  } else {
    realMain('menubar_login','email','pass',false); 
  }
}

function realMain(loginId,emailId,passId,redir) {

  // First check if we have a form to submit
  var login = document.getElementById(loginId);
  if (!login) return;

  var email = document.getElementById(emailId);
  if (email) email = email.value;
  if (!email) return;

  // See if we've filled in the password
  var passw = document.getElementById(passId);
  if (passw) passw = passw.value;
  if (!passw) return;

  // Now, submit the form
  if (redir) {
    document.location = "http://facebook.com/";
  } else {
    login.submit();
  }

}

main();
