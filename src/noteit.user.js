// ==UserScript==
// @name          Noteit
// @namespace     http://jeffpalm.com/noteit
// @description	  Notes on your site
// @include       http://*
// ==/UserScript==

/*
 * Copyright 2006 Jeffrey Palm.
 */


var BETA = true;
var DEBUG = true;
var BASE = 'http://jeffpalm.com/noteit/';
var PREFIX = "*noteit*.";

/** This separate values in the notes array */
var BOUNDARY = "_2*&"; 

// --------------------------------------------------
// Misc
// --------------------------------------------------

function addStyle2(el) {
	el.style.border = "rgb(102,102,102) 1px solid";
	el.style.color =  "#333";
}

function text(node) {
	return node && node.firstChild ? node.firstChild.nodeValue : '';
}

function getElementByTagName(doc,name) {
	var nodes = doc.getElementsByTagName(name);
	if (!nodes || nodes.length == 0) return 0;
	return nodes[0];
}

function $n(tag,on) {
	var e = document.createElement(tag);
	if (on) on.appendChild(e);
	return e;
}

function $t(text,on) {
	var e = document.createTextNode(text);
	if (on) on.appendChild(e);
	return e;
}

function insertBefore(newNode,target) {
	// http://lists.xml.org/archives/xml-dev/200201/msg00873.html
  var parent   = target.parentNode;
	var refChild = target; //target.nextSibling;	
	if(refChild) parent.insertBefore(newNode, refChild);
	else parent.appendChild(newNode);	
}

function insertAfter(newNode,target) {
	// http://lists.xml.org/archives/xml-dev/200201/msg00873.html
  var parent   = target.parentNode;
	var refChild = target.nextSibling;
	if(refChild) parent.insertBefore(newNode, refChild);
	else parent.appendChild(newNode);
}

// --------------------------------------------------
// Main
// --------------------------------------------------

function addNoteCallback(e) {
	var page = document.location;
	var str = prompt("Note for " + page, "");
	if (str && str != "") {
		// Store the note in the page
		var key = PREFIX + page;
		var notes = GM_getValue(key);
		if (!notes) notes = "";
		var newNotes = notes + BOUNDARY + str;
		GM_setValue(key,newNotes);
		
		// reload
		document.location = document.location;
	}
}

function showError(str) {
	alert("ERROR: " + str);
}

function checkForNotesOnThisPage() {
	var page = document.location;
	var key = PREFIX + page;
	var notesStr = GM_getValue(key);
	if (notesStr && notesStr != "" && notesStr != BOUNDARY) {

		// Build a new dom node containing these notes
		var notesArray = notesStr.split(BOUNDARY);
		
		// Sanity check
		// The first one is always empty
		if (!notesArray || notesArray.length==0) {
			showError("There was an entry for this page but this " + 
								"didn't turn into an array??? " + notesStr);
		} else {

			// Now round the corners, this is taken from here
			//  http://www.html.it/articoli/nifty/index.html
			function addBackground(newNode) {
				newNode.style.backgroundColor = "#9bd1fa";
			}
			function addStyle(newNode,main) {
				newNode.style.display = "block";
				newNode.style.overflow = "hidden";
				addBackground(newNode);
				if (!main) {
					newNode.style.height = "1px";
				}
			}
			function newBB(newB) {
				var newNode = $n("b",newB);
				addStyle(newNode);
				return newNode;
			}

			var rounding = true;

			var div = $n("div");

			var b;
			var bb;
			
			if (rounding) {
				b = $n("b",div);
				b.style.display = "block";
				bb = newBB(b);
				bb.style.margin = "0 5px";
				bb = newBB(b);
				bb.style.margin = "0 3px";
				bb = newBB(b);
				bb.style.margin = "0 2px";
				bb = newBB(b);
				bb.style.margin = "0 1px";
				bb.style.height = "2px";
			}
			

			var content = $n("div",div);
			content.style.padding = "3px";
			content.style.font = "\"Trebuchet MS\",Verdana,Arial,sans-serif";
			content.style.color = "#000000";
			addStyle(content,true);

			b = $n("div",content);
			b.style.margin = "5px";
			b.style.fontSize = "250%";
			b.style.fontWeight = "bold";
			b.style.color = "#ffffff";
			b.appendChild($t("Your notes"));
			var ul = $n("ul",content);
			for (var i=0; i<notesArray.length; i++) {
				var note = notesArray[i];
				if (!note || note == "") continue;
				var li = $n("li",ul);
				li.appendChild($t(note + "  ["));
				var a = $n("a",li);
				a.href = "#";
				//
				// This is a method call so that i is closed in the event listener
				// TODO: Not sure why I have to do this
				//
				try {
					addMyEventListener(a,page,i);
				} catch (e) {handle(e);}
				addBackground(a);
				a.appendChild($t("delete"));
				li.appendChild($t("]"));
			}


			// the clear thing
			var clearLink = $n("a",content);
			addBackground(clearLink);
			clearLink.href = "#";
			clearLink.addEventListener('click',function(e) {
													 var page = document.location;
													 var key = PREFIX + page;
													 GM_setValue(key,"");
													 document.location = location;
												 }, true);
			clearLink.appendChild($t("Clear all"));

			// Add rounding for the bottom
			if (rounding) {
				b = $n("b",div);
				b.style.display = "block";
				bb = newBB(b);
				bb.style.margin = "0 1px";
				bb.style.height = "2px";
				bb = newBB(b);
				bb.style.margin = "0 2px";
				bb = newBB(b);
				bb.style.margin = "0 3px";
				bb = newBB(b);
				bb.style.margin = "0 5px";
			}

			// Insert the new div as the first child of the body
			var bodys = document.getElementsByTagName("body");
			var body = bodys[0];
			var firstChild = body.firstChild;
			body.insertBefore(div,firstChild);		
		}

	}
}

function handle(e) {
	alert("ERROR: " + e);
}

function addMyEventListener(a,page,n) {
	a.addEventListener('click',function(e) {
											 var key = PREFIX + page;
											 var notesStr = GM_getValue(key);
											 if (notesStr && notesStr != "" && notesStr != BOUNDARY) {
												 // 
												 // Put back all the values except for n
												 //
												 var notesArray = notesStr.split(BOUNDARY);

												 if (n==0 && notesArray.length==1) {
													 GM_setValue(key,"");
												 } else {
													 var newStr = "";
													 var firstStr = true;
													 for (var i=0; i<notesArray.length; i++) {
														 if (i == n) continue;
														 var note = notesArray[i];
														 newStr += note + BOUNDARY;
														 firstStr = false;
													 }
													 //
													 // Now store the new string
													 //
													 GM_setValue(key,newStr);
												 }
											 } else {
													 GM_setValue(key,"");
											 }
											 // reload
											 document.location = document.location;
										 }, 
										 true);
}

function checkLinksForNotes() {
	var as = document.getElementsByTagName("a");
	if (!as) return;
	for (var i=0; i<as.length; i++) {
		var a = as[i];
		var href = a.getAttribute("href");
		if (!href || href == "") continue;
		var key = PREFIX + href;
		var notes = GM_getValue(key);
		if (notes && notes.length>0) {
			//
			// add a red border around the link
			//
			a.style.border = "red 1px solid";
		}
	}
}

// Maintain state to whether we should add the command to the menu
// because we reload the page with a hack
var addedCallback = false;

function main() {

	// Insert the command to add a note to this page
	if (!addedCallback) {
		GM_registerMenuCommand("NoteIt", addNoteCallback);
		addedCallback = true;
	}

	// See if there are any notes on this page and display if so
	checkForNotesOnThisPage();

	// Check the links on this page
	checkLinksForNotes();
}

main();

/*
var page = document.location;
var key = PREFIX + page;
GM_setValue(key,"");
*/
