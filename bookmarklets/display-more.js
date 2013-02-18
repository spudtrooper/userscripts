/**
 * Displays all the results from various websites.
 */
(function() {

  const REPLACE_TOKEN = '${replace.token}';

  // ------------------------------------------------------------
  // Searcher
  // ------------------------------------------------------------
  var Searcher = function() {
    this.numPages_ = 0;
    this.numResults_ = 0;
    this.lastPage_ = -1;
    this.firstPage_ = 1;
  };

  /** @return {number} The total number of pages. */
  Searcher.prototype.getNumPages = function() {
    return this.numPages_;
  };

  /** @return {number} The last page. */
  Searcher.prototype.getLastPage = function() {
    return this.lastPage_;
  };

  /** @return {number} The first page. */
  Searcher.prototype.getFirstPage = function() {
    return this.firstPage_;
  };

  /** @return {number} The number of results so far. */
  Searcher.prototype.getNumResults = function() {
    return this.numResults_;
  };

  /**
   * @return {string} The name.
   */
  Searcher.prototype.getName = function() {
    throw new Error('Implement getName()');
  };

  /** 
   * Called before calling updateListings. 
   */
  Searcher.prototype.init = function() {
    throw new Error('Implement init()');
  };

  /** 
   * Update the listings with response element.
   * @param {Element} The response element.
   */
  Searcher.prototype.updateListings = function(resEl) {
    throw new Error('Implement updateListings(resEl)');
  };

  /**
   * Gets the url for a give page to search.
   * @param {number} page The page number.
   */
  Searcher.prototype.getUrl = function(page) {
    throw new Error('Implement getUrl(page)');
  };

  // ------------------------------------------------------------
  // CraigslistSearcher
  // ------------------------------------------------------------
  var CraigslistSearcher = function() {};
  CraigslistSearcher.prototype = new Searcher();
  CraigslistSearcher.prototype.constructor = CraigslistSearcher;

  CraigslistSearcher.prototype.getName = function() {
    return 'Craigslist';
  };

  CraigslistSearcher.prototype.init = function() {
    var lastPageAndLink = this.findLastPageAndLink_();
    if (!lastPageAndLink) {
      return false;
    }
    var lastPage = lastPageAndLink[0];
    var lastLink = lastPageAndLink[1];
    var template = lastLink.replace('=' + 100*(lastPage-1), 
				    '=' + REPLACE_TOKEN);
    this.template_ = template;
    this.lastPage_ = lastPage;
    return true;
  };

  CraigslistSearcher.prototype.updateListings = function(resEl) {
    var target = this.findTarget_();
    var resultsDiv = this.findResultsDiv_(resEl);
    var listingDivs = resultsDiv.getElementsByClassName('imggridrow');
    if (listingDivs) {
      var html = '';
      for (var i=0, N=listingDivs.length; i<N; i++) {
	this.numResults_++;
 	var listing = listingDivs[i];
 	html += '<div class=\'' + listing.className + '\'>' + 
	  listing.innerHTML + '</div>';
      }
      target.innerHTML += html;
    }
    this.numPages_++;
  };

  CraigslistSearcher.prototype.findTarget_ = function() {
    return this.findResultsDiv_(document);
  };

  CraigslistSearcher.prototype.getUrl = function(page) {
    return this.template_.replace(REPLACE_TOKEN, 100*(page-1));
  };

  CraigslistSearcher.prototype.findResultsDiv_ = function(el) {
    var els = el.getElementsByTagName('blockquote');
    for (var i = 0; i < els.length; i++) {
      if (els[i].id == 'toc_rows') {
	return els[i];
      }
    }
    return null;
  };

  /** @return [lastPage:number, lastLink:string] */
  CraigslistSearcher.prototype.findLastPageAndLink_ = function() {
    var lastPage = -1, link = null;
    var as = document.getElementsByTagName('a');
    for (var i=0; i<as.length; i++) {
      var a = as[i];
      if (!a.href) continue;
      var res = a.href.match(/search.*s=(\d+)/);
      if (res) {
	try {
	  var page = parseInt(res[1])/100 + 1;
	  if (page > lastPage) {
	    lastPage = page;
	    link = a.href;
	  }
	} catch (_) {}
      }
    }
    return link ? [lastPage, link] : null;
  };


  // ------------------------------------------------------------
  // NakedApartmentsSearcher
  // ------------------------------------------------------------
  const NAKEDAPARTMENTS_RESULTS_CLASS_NAME = 
    'listing-results floatLeft';
  const NAKEDAPARTMENTS_LISTING_CLASS_NAME = 
    'listing-row listing-row-standard clearfix';
  
  var NakedApartmentsSearcher = function() {};
  NakedApartmentsSearcher.prototype = new Searcher();
  NakedApartmentsSearcher.prototype.constructor = NakedApartmentsSearcher;

  NakedApartmentsSearcher.prototype.getName = function() {
    return 'NakedApartments';
  };

  NakedApartmentsSearcher.prototype.init = function() {
    var lastPageAndLink = this.findLastPageAndLink_();
    if (!lastPageAndLink) {
      return false;
    }
    var lastPage = lastPageAndLink[0];
    var lastLink = lastPageAndLink[1];
    var template = lastLink.replace('=' + lastPage, '=' + REPLACE_TOKEN);
    this.template_ = template;
    this.lastPage_ = lastPage;
    return true;
  };

  NakedApartmentsSearcher.prototype.updateListings = function(resEl) {
    var target = this.findTarget_();
    var resultsDiv = this.findResultsDiv_(resEl);
    var listingDivs = resultsDiv.getElementsByClassName(
      NAKEDAPARTMENTS_LISTING_CLASS_NAME);
    if (listingDivs) {
      var html = '';
      for (var i=0, N=listingDivs.length; i<N; i++) {
	this.numResults_++;
 	var listing = listingDivs[i];
 	html += '<div id=\'' + listing.id + '\' class=\'' +
 	  listing.className + '\'>' + listing.innerHTML + '</div>';
      }
      target.innerHTML += html;
    }
    this.numPages_++;
  };

  NakedApartmentsSearcher.prototype.findTarget_ = function() {
    return this.findResultsDiv_(document.body);
  };

  NakedApartmentsSearcher.prototype.getUrl = function(page) {
    return this.template_.replace(REPLACE_TOKEN, page);
  };

  NakedApartmentsSearcher.prototype.findResultsDiv_ = function(el) {
    var divs = el.getElementsByClassName(NAKEDAPARTMENTS_RESULTS_CLASS_NAME);
    if (!divs || !divs.length || divs.length != 1) return null;
    return divs[0];
  };

  /** @return [lastPage:number, lastLink:string] */
  NakedApartmentsSearcher.prototype.findLastPageAndLink_ = function() {
    var lastPage = -1, link = null;
    var as = document.getElementsByTagName('a');
    for (var i=0; i<as.length; i++) {
      var a = as[i];
      if (!a.href) continue;
      var res = a.href.match(/.*\/search\?.*page=(\d+)/);
      if (res) {
	try {
	  var page = parseInt(res[1]);
	  if (page > lastPage) {
	    lastPage = page;
	    link = a.href;
	  }
	} catch (_) {}
      }
    }
    return link ? [lastPage, link] : null;
  };


  // ------------------------------------------------------------
  // Controller
  // ------------------------------------------------------------
  var Controller = function(display, searcher) {
    this.display_ = display;
    this.searcher_ = searcher;
  };

  Controller.prototype.displayResults_ = function(page, text) {
    var div = document.createElement('div');
    div.innerHTML = text;
    this.searcher_.updateListings(div);
    this.display_.updateStatus(this.searcher_, page);
  };
    
  Controller.prototype.search_ = function(page) {
    var url = this.searcher_.getUrl(page);
    var thiz = this;
    log('Searching ' + url + ' ...');
    ajax(url, (function() {
      var page_ = page;
      return function(text) {
	thiz.displayResults_(page_, text);
      }
    })());
  };

  Controller.prototype.searchAll = function() {
    if (!this.searcher_.init()) {
      alert('Couldn\'t init');
      return;
    }
    this.display_.showInitialMessage(this.searcher_.getLastPage());
    for (var i = this.searcher_.getFirstPage(), 
	 N = this.searcher_.getLastPage(); i <= N; i++) {
      this.search_(i);
    }
  };


  // ------------------------------------------------------------
  // Display
  // ------------------------------------------------------------
  var Display = function() {};

  Display.prototype.updateStatus = function(searcher, page) {
    var html = '';
    var numPages = searcher.getNumPages();
    var lastPage = searcher.getLastPage();
    var numResults = searcher.getNumResults();
    if (numPages == lastPage) {
      html += 'Done. Showed ' + numPages + ' pages, ' +
	numResults + ' listings.';
    } else {
      html += 'Showing page ' + page + '...';
      html += '<br/>';
      html += '<em>' + numPages + ' / ' + lastPage + '</em> pages';
      html += '<br/>';
      html += '<em>' + numResults + '</em> results';
    }
    this.statusDiv().innerHTML = html;
  };

  Display.prototype.statusDiv = function(page) {
    var id = '_statusDiv';
    var statusDiv = document.getElementById(id);
    if (!statusDiv) {
      statusDiv = document.createElement('div');
      statusDiv.id = id;
      var statusDivStyle = {
	'position': 'fixed',
	'left': '10px',
	'top': '10px',
	'backgroundColor': '#ddd',
	'text-weight': 'bold',
	'border': '1px solid black',
	'padding': '5px',
	'zIndez': '1000000000'
      };
      setStyle(statusDiv, statusDivStyle);
      document.body.appendChild(statusDiv);
    }
    this.statusDiv_ = statusDiv;
    return this.statusDiv_;
  };

  Display.prototype.showInitialMessage = function(page) {
    this.statusDiv().innerHTML = '0 / ' + page;
  };

  // ------------------------------------------------------------
  // Misc
  // ------------------------------------------------------------

  /**
   * @param {string} url The url.
   * @param {function(String):} THe response function.
   */
  function ajax(url,f) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onreadystatechange = function() {
      var done = 4, ok = 200, url_ = url;
      if (request.readyState == done && request.status == ok) {
	if (request.responseText) {
	  log('Response from ' + url_);
	  f(request.responseText);
	}
      }
    };
    request.send(null);
  }

  function setStyle(el,style) {
    for (var i in style) {
      el.style[i] = style[i];
    }
  }

  function log(msg) {
    try {
      console.log(msg);
    } catch (_) {}
  }

  // ------------------------------------------------------------
  // Main
  // ------------------------------------------------------------

  function getSearcher() {
    var loc = String(document.location);
    log('Trying to find searcher for ' + loc);
    var regexpsToSearchers = {};
    regexpsToSearchers['nakedapartments\.com\/.*\/search'] = 
      function() {return new NakedApartmentsSearcher();};
    regexpsToSearchers['craigslist\.org.*\/search.*altView=imggrid'] = 
      function() {return new CraigslistSearcher();};
    
    for (var regexp in regexpsToSearchers) {
      log(' - trying ' + regexp);
      if (loc.match(new RegExp(regexp))) {
	log(' - found a match for ' + regexp);
	return regexpsToSearchers[regexp]();
      }
    }
    return null;
  }

  function main() {
    var searcher = getSearcher();
    if (!searcher) {
      alert('Couldn\'t find a searcher for this page');
      return;
    }
    log('Using searcher ' + searcher.getName() + '...');
    var controller = new Controller(new Display(), searcher);
    controller.searchAll();
  }

  main();

})();