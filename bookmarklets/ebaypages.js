//
// Displays a window listing the first item in every page for a
// paginated ebay query.  This allows you to jump into the desired
// section of en ebay query, rather than browsing through pages and
// pages.  For example, you search for an item yielding 1000s of pages
// of results with bidding periods ranging from seconds to days, and
// you're willing to wait a couple days -- so you sort by 'time left'.
// Instead of clicking through the pages until you find the results
// that have a couple days, you could directly to that page.  There is
// more here:
//
//   http://www.jeffpalm.com/blog/archives/002214.html
//
(function() {

  // Taken from http://bit.ly/27Xogz
  const BLACK_OVERLAY_STYLE = {
    'display': 'none',
    'position': 'absolute',
    'top': '0%',
    'left': '0%',
    'width': '100%',
    'height': '1000%',
    'background-color': 'black',
    'z-index': '1001',
    '-moz-opacity': '0.8',
    'opacity': '.80',
    'filter': 'alpha(opacity=80)'
  };
  // Taken from http://bit.ly/27Xogz
  const LIGHT_PAD = 20;
  const WHITE_CONTENT_STYLE = {
    'display': 'none',
    'position': 'absolute',
    'top': LIGHT_PAD + 'px',
    'left': LIGHT_PAD + 'px',
    'padding': '16px',
    'border': '3px solid grey',
    'background-color': 'white',
    'z-index': '1002',
    'overflow': 'auto',
    // added by me
    'min-height': '300px',
    'min-width': '300px'
  };

  var numFails = 0;

  function $n(tag,onto) {
    var el = document.createElement(tag);
    if (!!onto) onto.appendChild(el);
    return el;
  }

  function fail(msg) {
    numFails++;
    if (numFails == 1) {
      alert(msg);
    } else {
      try {
	console.log('Error #' + numFails + ': ' + msg);
      } catch (_) {}
    }
  }
  
  function findNormalizedLocation() {
    var loc = String(document.location);
    var res;
    if (res = loc.match(/(.*)&_pgn=\d+(.*)/)) {
      loc = res[1];
      if (typeof res[3] !== 'undefined') {
	loc += res[3];
      }
    }
    return loc;
  }
  
  function findTotalNumItems() {
    // <li class="toppg-t">Page 5 of 6</li>
    var els = document.getElementsByClassName('toppg-t');
    if (!els || els.length != 1) {
      return -1;
    }
    var el = els[0];
    if (!el) {
      return -1;
    }
    var res = el.innerHTML.match(/Page\s+\d+\s*of\s*(\d+)/i);
    if (res) {
      return parseInt(res[1]);
}
    return -1;
  }
  
  function ajax(url,f) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function() {
      var done = 4, ok = 200;
      if (request.readyState == done && request.status == ok) {
	if (request.responseText) {
	  f(request.responseText);
	}
      }
    };
    request.send(null);
  }

  function findFirstTable(el) {
    var tabs = el.getElementsByClassName('li');
    if (tabs.length == 1) {
      return tabs[0];
    }
    for (var i in tabs) {
      if (!!tabs[i].nodeName && tabs[i].nodeName.toLowerCase() === 'table') {
	return tabs[i];
      }
    }
    return null;
  }

  function extractFirstLine(url,id,el,into) {
    var tab = findFirstTable(el);
    if (!tab) {
      fail('Could not find a table in ' + id + ':' + el.innerHTML);
      return;
    }
    var html = tab.innerHTML;
    tab.parentNode.removeChild(tab);
    ///
    // Insert this into the correct table rather than appending so we
    // keep the order
    //
    var into = document.getElementById(id);
    into.innerHTML = html;
    //
    // Change all links to point to the target url
    //
    var as = into.getElementsByTagName('a');
    for (var i in as) {
      as[i].href = url;
    }
  }

  function getDivId(pageNum) {
    return '_div_' + pageNum;
  }

  /**
   * Append a paginated section into the DOM as a div, and allow the
   * javascript to render.
   */
  function addPageScript(url,pageNum,text,into) {
    var html = text;
    html = html.replace(/.*<body[^>]*>/im,'');
    html = html.replace(/<\/body.*/im,'');
    var div = $n('div',document.body);
    var id = getDivId(pageNum);
    div.id = id;
    div.innerHTML = html;
    setTimeout(function() {
      //
      // Wait for the elements to render, then extract the innards and
      // create a new table element in the top left
      //
      extractFirstLine(url,id,div,into);
    },1000);
  }
  
  function setStyle(el,style) {
    for (var i in style) {
      el.style[i] = style[i];
    }
  }
  
  function getOrCreateElement(id,type) {
    var el = document.getElementById(id);
    if (!!el) {
      return el;
    }
    el = $n(type,document.body);
    el.id = id;
    return el;
  }
  
  function createLightBox() {
    var fade = getOrCreateElement('fade','div');
    var light = getOrCreateElement('light','div');
    setStyle(fade,BLACK_OVERLAY_STYLE);
    setStyle(light,WHITE_CONTENT_STYLE);
    light.style.display = 'block';
    fade.style.display = 'block';
    var lis = (function() {
      var _light = light;
      var _fade = fade;
      return function(e) {
	var x = scrollX;
	var y = scrollY;
	_light.innerHTML = '';
	_light.style.display = 'none';
	_fade.style.display = 'none';
      }})();
    fade.addEventListener('click',lis,false);
    light.focus();
    return light;
  }

  function createLightBoxTarget() {
    var box = createLightBox();
    var res = $n('div',box);
    res.className = 'lview';
    return res;
  }

  function createTargetTables(totalNumItems,target) {
    for (var i=1; i<=totalNumItems; i++) {
      var table = $n('table',target);
      table.setAttribute('cellspacing','0');
      table.className = 'li';
      table.setAttribute('r',i);
      table.id = getDivId(i);
      var a = $n('a',target);
      var name = 'item' + Math.floor(Math.random() * 0xfffff);
      a.setAttribute('name',name);
    }
  }

  function addPageTables(loc,totalNumItems,target) {
    for (var i=1; i<=totalNumItems; i++) {
      var url = loc + '&_pgn=' + i;
      ajax(url,(function() {
	var pageNum = i;
	var into = target;
	var _url = url
	return function(text) {
	  addPageScript(_url,pageNum,text,into);
	};
      })());
    }
  }
  
  function main() {
    var loc = findNormalizedLocation();
    if (!loc) {
      fail('Cannot find normalized location');
      return;
    }
    var totalNumItems =  findTotalNumItems();
    if (totalNumItems == -1) {
      fail('Cannot find total number of items');
      return;
    }
    var target = createLightBoxTarget();

    // Create the table elements, so we can add them sorted
    createTargetTables(totalNumItems,target);
    addPageTables(loc,totalNumItems,target);
  }
  
  main();

})();