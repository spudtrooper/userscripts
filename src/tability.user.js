// ==UserScript==
// @name          Tability
// @namespace     http://jeffpalm.com/tability
// @description    Tabiliterize your site
// @include       http://*
// ==/UserScript==

/*
 * Copyright 2006 Jeffrey Palm.
 */


var VERSION = "0.7";
var LOCAL = false; //!(document.location+"").match(/jeffpalm.com/);  
var DEBUG = false;
var BASE = LOCAL ? 'http://localhost/~jeff/tability/' : 'http://jeffpalm.com/tability/';

function createButton(target) {

  function addOption(select,name) {
    var option = $n('option');
    select.appendChild(option);
    option.value = name;
    option.appendChild($t(name));
  }

  var button = $n('span');
  
  // The type of graph
  var select = $n('select');
  addStyle(select);
  button.appendChild(select);

  addOption(select, 'Line');
  addOption(select, 'CSV');
  addOption(select, 'Table');
  //addOption(select, 'Bar');

  // The input
  var input = $n('input');
  addStyle(input);
  button.appendChild($t(" "));
  button.appendChild(input);
  input.type = 'submit';
  input.value = 'View';

  var onClick = function(event) {
    try {
      createEditable(select,target);
    } catch (e) {
      tabilityError(e);
    }
    return false;
  };

  input.addEventListener('click',onClick,true);

  return button;
}

function createEditable(select,table) {

  // Get the type of graph
  var type = select[select.selectedIndex].value;

  // Grab all the rows
  var trs = table.getElementsByTagName("tr");
  if (!trs || trs.length==0) return;

  // - get the length of the first row
  var len = trs[0].getElementsByTagName("td").length;

  // - determine which columns to use based on the
  //   the first row's check boxes
  // - create an array of rows to use
  var firstTR = trs[0];
  var firstTDs = firstTR.getElementsByTagName("td");
  var colsToUse = new Array();
  for (var i=0; i<len; i++) {
    var useThisCol = firstTDs[i].firstChild.checked;
    if (useThisCol) colsToUse.push(i);
  }
  //
  // Create the url and open up a new window
  //
  var options = {
    "cols": colsToUse,
    "type": type,
    "series": true,
    //"labels": true,
    "start_row": 2 // we created the first row
  };
  var url = createTable(table,options);
  var windowOptions = "width=510,height=510,resizable=1,scrollbars=1,location=" + (DEBUG ? "1" : "0");
  window.open(url, "tability", windowOptions);
}

// --------------------------------------------------
// API
// --------------------------------------------------

function tabiliterize(table,optionsIn) {
  //
  // We have to do this twice to make it easier to get the options
  //
  if (!optionsIn) optionsIn = new Array();
  //
  // We'll access these by name, so make sure they're lowercase
  //
  var options = new Array();
  for (var key in optionsIn) {
    options[key.toLowerCase()] = optionsIn[key];
  }
  var url;
  try {
    url = createTable(table,options);
  } catch (e) {tabilityError(e);}
  //
  // Decide whether to use an internal frame or img
  // Use an internal frame for CVS type
  if (options['type'] && options['type'].toLowerCase() != 'csv') {
    document.write('<iframe src="' + url + '"></iframe>');
  } else {
    document.write('<img src="' + url + '" />');
  }
}

/**
 * DOM[table] (String -> ?) -> String[url]
 */
function createTable(table,optionsIn) {
  // --------------------------------------------------
  // Options
  // -------------------------------------------------- 
  if (!optionsIn) optionsIn = new Array();
  //
  // We'll access these by name, so make sure they're lowercase
  //
  var options = new Array();
  for (var key in optionsIn) {
    options[key.toLowerCase()] = optionsIn[key];
  }
  //
  // Get the options and check them (a bit)
  //
  // This used to be int->boolean, but now it's just ints
  // so we'll flip it
  //
  colsToUseIn = options["cols"];
  //
  // colsToUse is 0 for 'use' all columns of an array of (int[row] -> true)
  //
  var colsToUse; 
  if (!colsToUseIn) {
    colsToUse = 0;
  } else {
    colsToUse = new Array();
    for (var i in toArray(colsToUseIn)) {
      colsToUse[colsToUseIn[i]] = true;
    }
  }
  type = options["type"];
  if (!type) type = "Line";
  //
  // Maybe the table is an ID, not an element
  //
  if (typeof table == "string") {
    var s = table;
    table = document.getElementById(s);
    if (!table) {
      tabilityError("Cannot find a table for '" + s + "'");
    }
  }
  //
  // Use the labels on the first series
  //
  var labels = options["labels"];

  // --------------------------------------------------
  // Process
  // -------------------------------------------------- 

  // 
  // Grab all the rows
  //
  var trs = table.getElementsByTagName("tr");
  var rows = new Array();
  if (!trs || trs.length==0) return;
  // Skip the first row, we've put that in
  // Skip the second row, because that should be titles
  var startRow = options["start_row"];
  if (!startRow) startRow = 1;

  for (var i=startRow; i<trs.length; i++) {
    var tr = trs[i];
    var tds = tr.getElementsByTagName("td");
    if (!tds || tds.length==0) tds = tr.getElementsByTagName("th");
    if (tds && tds.length>0) {
      var row = new Array();
      for (var j=0; j<tds.length; j++) {
        var val = tds[j].innerHTML;
        row.push(val);
      }
      rows.push(row);
    }
  }
  //
  // Get the length of the first row
  //
  if (rows.length==0) return;
  var row = rows[0];
  var len = row.length;
  //
  // Create the columns and the request skip the first col
  //
  var url = BASE + VERSION + "/graph.php?type=" + type;
  //
  // First check if we're using labels
  //
  if (isTrue(labels) || (colsToUse || colsToUse[0])) {
    url += "&labels=";
    for (var j=0; j<rows.length; j++) {
      var row = rows[j];
      var val = row[0];
      // Just replace ,s because we use those as meta-characters
      var newVal = val.replace(/,/g,'');
      url += newVal;
      if (j<rows.length-1) url += ",";
    }
  }
  //
  // Now fill with the data
  //
  url += "&data=";
  // skip the first one
  for (var i=1; i<len; i++) {
    //
    // check whether we want to use this column
    //
    var useThisCol = !colsToUse || colsToUse[i];
    if (!useThisCol) continue;
    url += "|";
    for (var j=0; j<rows.length; j++) {
      var row = rows[j];
      var val = row[i];
      // remove non numeric things
      var newVal = val.replace(/[^\d]/g,'');
      url += newVal;
      if (j<rows.length-1) url += ",";
    }
  }
  //
  // Now add all the other options
  //
  for (i in options) {
    if (i == "type") continue;
    if (i == "cols") continue;
    if (i == "series") continue;
    url += "&" + i + "=" + urlencode(options[i]);
  }
  //
  // Now add the series labels
  //
  if (isTrue(options["series"])) {
    url += "&series=";
    var tds = trs[startRow-1].getElementsByTagName("td");
    if (!tds || tds.length==0) tds = trs[startRow-1].getElementsByTagName("th");
    if (tds && tds.length>0) {
      var row = new Array();
      // skip the first one
      var seriesStart = isTrue(labels) ? 1 : 0;
      for (var j=seriesStart; j<tds.length; j++) {
        if (!colsToUse || colsToUse[j]) {
          var lab = tds[j].innerHTML;
          url += urlencode(lab);
          if (j<tds.length-1) url += ",";
        }
      }
    }
  }
  return url;
}

// --------------------------------------------------
// Misc
// --------------------------------------------------

function isTrue(b) {
  return toBoolean(b);
}

function toBoolean(b) {
  if (!b) return false;
  if (typeof b == "string") {
    var s = b.toLowerCase();
    return s == "true" || s == "1" || s == "yes";
  }
  return b;
}

function toArray(s) {
  if (!s) return new Array();
  if (typeof s != "string") return s;
  return s.split(",");
}

function addStyle(el) {
  el.style.border = "rgb(102,102,102) 1px solid";
  el.style.font = "11px/1.6em 'Lucida Grande', LucidaGrande, Lucida, Helvetica, Arial, sans-serif";
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

function replaceChild(target,newNode) {
  insertAfter(newNode,target);
  removeChild(target);
}

function removeChild(n) {
  n.parentNode.removeChild(n);
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

/*
 * Insert a row of check boxes into the first row of the table
 */
function insertCheckBoxes(table) {
  //
  //  determine the number of rows based on the last row
  //
  var trs = table.getElementsByTagName("tr");
  if (!trs || trs.length==0) return;
  var tr = trs[trs.length-1];
  var tds = tr.getElementsByTagName("td");
  if (!tds || tds.length==0) return;
  var numCols = tds.length;
  //
  // Insert the new row
  //
  var newTR = $n("tr");
  var first = trs[0];
  insertBefore(newTR,first);
  for (var i=0; i<numCols; i++) {
    var td = $n("td");
    td.style.textAlign = "center";
    newTR.appendChild(td);
    var checkBox = $n("input");
    td.appendChild(checkBox);
    checkBox.type = "checkbox";
    checkBox.checked = true;
    addStyle(checkBox);
  }
}

function removeCheckBoxes(table) {
  var trs = table.getElementsByTagName("tr");
  if (!trs || trs.length==0) return;
  var tr = trs[0];
  tr.parentNode.removeChild(tr);
}

// We'll remember the links so we can hide them
// also need to remember to tables
var links = new Array();
var tables = new Array();
function hideLinks() {
  for (var i=0; i<links.length; i++) {
    var button = links[i];
    button.parentNode.removeChild(button);
  }
  for (var i=0; i<tables.length; i++) {
    var table = tables[i];
    removeCheckBoxes(table);
  }
  links = new Array();
  tables = new Array();
}
function showLinks() {
  var ts = document.getElementsByTagName('table');
  if (!ts || !ts.length) return;
  for (var i=0; i<ts.length; i++) {
    //
    // Create the button
    //
    var table = ts[i];
    var b = createButton(table);
    insertBefore(b,table);
    //
    // Insert the check boxes in the table
    //
    insertCheckBoxes(table);
    //
    // Now save these for later
    //
    links.push(b);
    tables.push(table);
  }
}

function main() {
  //
  // First check whether there are any tables, only then
  // will we put the tag at the top
  //
  try {
    var tables = document.getElementsByTagName("table");
    if (!tables || tables.length<=0) return;
  } catch (e) {return;}
  toggle();
}

var showing = false;
function toggle() {
  if (showing) {
    toggleOff();
    showing = false;
  } else {
    toggleOn();
    showing = true;
  }
}

var toggleNode;
function insertToggleNode(name,f) {
  //
  // Create the new node
  //
  var span = $n("span");
  
  span.appendChild($t("["));
  
  var a = $n("a");
  span.appendChild(a);
  a.href = "#";
  a.addEventListener('click',f,true);
  a.appendChild($t(name));
  
  span.appendChild($t("]"));
  //
  // If we haven't inserted the toggle node in, insert it
  // otherwise remove it's
  //
  if (!toggleNode) {
    toggleNode  = $n("span");
    var bodys = document.getElementsByTagName("body");
    var body = bodys[0];
    var firstChild = body.firstChild;
    body.insertBefore(toggleNode,firstChild);    
  } else {
    toggleNode.removeChild(toggleNode.firstChild);
  }
  //
  // Now, add the good stuff
  //
  toggleNode.appendChild(span);
}

function toggleOff() {
  insertToggleNode("Untabiliterize", function (e) {hideLinks(); toggleOn();});
}

function toggleOn() {
  insertToggleNode("Tabiliterize", function (e) {showLinks(); toggleOff();});
}

// ====================================================================
//       URLEncode and URLDecode functions
//
// Copyright Albion Research Ltd. 2002
// http://www.albionresearch.com/
//
// You may copy these functions providing that 
// (a) you leave this copyright notice intact, and 
// (b) if you use these functions on a publicly accessible
//     web site you include a credit somewhere on the web site 
//     with a link back to http://www.albionresarch.com/
//
// If you find or fix any bugs, please let us know at albionresearch.com
//
// SpecialThanks to Neelesh Thakur for being the first to
// report a bug in URLDecode() - now fixed 2003-02-19.
// ====================================================================
function urlencode( plaintext )
{
  // The Javascript escape and unescape functions do not correspond
  // with what browsers actually do...
  var SAFECHARS = "0123456789" +          // Numeric
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +  // Alphabetic
          "abcdefghijklmnopqrstuvwxyz" +
          "-_.!~*'()";          // RFC2396 Mark characters
  var HEX = "0123456789ABCDEF";

  var encoded = "";
  for (var i = 0; i < plaintext.length; i++ ) {
    var ch = plaintext.charAt(i);
      if (ch == " ") {
        encoded += "+";        // x-www-urlencoded, rather than %20
    } else if (SAFECHARS.indexOf(ch) != -1) {
        encoded += ch;
    } else {
        var charCode = ch.charCodeAt(0);
      if (charCode > 255) {
          tabilityError( "Unicode Character '" 
                        + ch 
                        + "' cannot be encoded using standard URL encoding.\n" +
                  "(URL encoding only supports 8-bit characters.)\n" +
              "A space (+) will be substituted." );
        encoded += "+";
      } else {
        encoded += "%";
        encoded += HEX.charAt((charCode >> 4) & 0xF);
        encoded += HEX.charAt(charCode & 0xF);
      }
    }
  } // for

  return encoded;
};

function tabilityError(msg) {
  alert("*** TABILITY: " + msg);
}



// --------------------------------------------------
// Main entry point
// --------------------------------------------------

// We want to use this file for the api, too, so we'll
// check that we're actually in greasemonkey before doing
// this
try {
  if (GM_registerMenuCommand) main();
} catch (e) {
  var oldOnLoad = window.onload;
  if (!oldOnLoad) oldOnLoad = function(e) {};
  myOnload = function(e) {
    //
    // If we get an exception then search for elements of type span
    // whose attribute tability is true and turn these into graphs
    //
    var spans = document.getElementsByTagName("span");
    var spansToReplace = new Array();
    for (var i=0; i<spans.length; i++) {
      var span = spans[i];
      var t = span.getAttribute("tability");
      if (t && t.toLowerCase() != 'false') spansToReplace.push(span);
    }
    var N = spansToReplace.length;
    for (var i=0; i<N; i++) {
      var span = spansToReplace[i];
      var table = span.getAttribute("table");
      if (!table) {
        tabilityError("You must specify an attribute 'table'");
      }
      //
      // Build the array of options from the child nodes of this span
      //
      var options = new Array();
      var kids = span.childNodes;
      if (kids) {
        for (var j=0; j<kids.length; j++) {
          var n = kids[j];
          if (n.nodeName == "#text") continue; // skip the empty text nodes
          var txt = text(n);
          options[n.nodeName.toLowerCase()] = txt;
        }
      }
      //
      // Get the new URL and create an image to replace this span
      //
      var loading = $t("Loading...");
      replaceChild(span,loading);
      var url;
      try {
        url = createTable(table,options);
      } catch (e) {tabilityError(e);}
      //
      // Decide whether to use an iframe for csv or img for any other graph
      //
      var newNode;
      if (options['type'] && options['type'].toLowerCase() == 'csv') {
        newNode = $n("iframe");
        newNode.src = url;
      } else if (options['type'] && options['type'].toLowerCase() == 'table') {
        newNode = $n("iframe");
        newNode.width = 450;
        newNode.src = url;
      } else {
        newNode = $n("img");
        newNode.src = url;
      }
      replaceChild(loading,newNode);
    }
  };
  window.onload = function(e) {
    try {
      oldOnLoad(e);
    } catch (ex) {}
    myOnload(e);
  };
}

