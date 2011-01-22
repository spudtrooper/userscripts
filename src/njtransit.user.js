// ==UserScript==
// @name          NJ Transit
// @namespace     http://jeffpalm.com/njtransit
// @description   Automatically start at the station you want
// @include       http://*njtransit.com/sf/sf_servlet.srv?hdnPageAction=TrainTo*
// ==/UserScript==

function setLocations() {
  const SEL_ORIGIN = '106_BNTN';
  const SEL_DESTINATION = '105_BNTN';
  var selOrigin = SEL_ORIGIN;
  var selDestination = SEL_DESTINATION;
  var sels = document.getElementsByTagName('SELECT');
  for (var i in sels) {
    var s = sels[i];
    if (s.name == 'selOrigin') {
      s.value = selOrigin;
    } else if (s.name == 'selDestination') {
      s.value = selDestination;
    }
  }
}

function main() {
  var js =
    "javascript:const SEL_ORIGIN='106_BNTN';const SEL_DESTINATION='105_BNTN';var selOrigin=SEL_ORIGIN;var selDestination=SEL_DESTINATION;var sels=document.getElementsByTagName('SELECT');for (var i in sels) {var s=sels[i];if (s.name=='selOrigin') {s.value=selOrigin;} else if (s.name=='selDestination') {s.value=selDestination;}};if ((String(document.location)).match(/_go_/)) {document.forms.frm_tr_schedules.submit();}void(0);";
  setTimeout('document.location = "' + js + '";',1000);
}

main();