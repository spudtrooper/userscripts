// ==UserScript==
// @name          JIRA links
// @namespace     http://jeffpalm.com/jiralinke/
// @description   Adds convenient links when you use JIRA
// @include       https://issue-tracking.amazon.com/*
// ==/UserScript==

var linksAndNames = 
	[
	 "/secure/CreateIssue.jspa?pid=12154&issuetype=1", "CREATE BUG",
	 "/secure/CreateIssue.jspa?pid=12154&issuetype=2", "CREATE FEATURE",
	 "/secure/IssueNavigator.jspa?reset=true&mode=hi"+
	 "de&pid=12154&assigneeSelect=issue_current_user"+
	 "&resolution=-1", "                                ASSIGNED TO ME"
	 ];

function $n(tag,on) {
  var e = document.createElement(tag);
  if (on) on.appendChild(e);
  if (arguments.length > 2) setId(e,arguments[2]);
  return e;
}

function main() {

	var mainNav = document.getElementById("main-nav");
	if (!mainNav) return;

	for (var i=0; i<linksAndNames.length; i+=2) {
		var link = linksAndNames[i+0];
		var name = linksAndNames[i+1];
		var li = $n("li",mainNav);
		var lia = $n("a",li);
		lia.innerHTML = name;
		lia.href = link;
	}	

}

main();