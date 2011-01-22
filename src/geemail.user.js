// ==UserScript==
// @name          GeeMail
// @namespace     http://jeffpalm.com/geemail
// @description   Use site-specific email address
// @include       *
// ==/UserScript==

var PREFIX = "_email_";

function getValue(key) {
  return GM_getValue(PREFIX+key);
}

function setValue(key,val) {
  GM_setValue(PREFIX+key,val);
}

function shouldAddEmail(inp) {
  var n;
  n = inp.name;
  if (n && n.match(/email/i)) return true;
  n = inp.id;
  if (n && n.match(/email/i)) return true;
  return false;
}

function modEmail(email) {
  var parts = email.split(/@/);
  if (!parts) return "";
  var host = document.location.hostname;
  if (!host) return "";
  host = host.replace(/:.*/,"");
  host = host.replace(/^www\./,"");
  var res = parts[0] + "+" + host;
  if (parts.length == 1) {
    res += "@gmail.com";
  } else {
    for (var i=1; i<parts.length; i++) {
      res += parts[i];
    }
  }
  return res;
}

function inspectInput(inp) {
  if (!inp) return;
  var email = getValue("email");
  if (shouldAddEmail(inp)) {
    if (!email) {
      email = prompt("Please enter your gmail address");
      if (email) setValue("email",email);
    }
    if (!email || email=="") return false;
    inp.value = modEmail(email);
  }
  
  return true;
}
  

function main() {
  var loc = String(document.location);
  if (loc.match(/resetGeemailUsername/)) {
    alert("GeeMail: email reset");
    setValue("email",null);
  }
  var inputs = document.getElementsByTagName("INPUT");
  for (var i in inputs) {
    if (!inspectInput(inputs[i])) break;
  }
}

main();
