/**
 * Displays all the results from nakedapartments.com.
 */
(function() {

  const REPLACE_TOKEN = '${replace.token}';
  const RESULTS_CLASS_NAME = 'listing-results floatLeft';
  const LISTING_CLASS_NAME = 'listing-row listing-row-standard clearfix';

  /**
   * @param {string} url The url.
   * @param {function(String):} THe response function.
   */
  function ajax(url,f) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
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
  
  /** 
   * @return [lastPage:number, lastLink:string] 
   */
  function findLastPageAndLink() {
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
  }

  function findTarget() {
    return findResultsDiv(document.body);
  }
  
  function findResultsDiv(el) {
    var divs = el.getElementsByClassName(RESULTS_CLASS_NAME);
    if (!divs || !divs.length || divs.length != 1) return null;
    return divs[0];
  }

  function setStyle(el,style) {
    for (var i in style) {
      el.style[i] = style[i];
    }
  }

  var Searcher = function(template, lastPage) {
    this.template_ = template;
    this.lastPage_ = lastPage;
    this.numPages_ = 0;
    this.numResults_ = 0;
  };

  Searcher.prototype.searchAll = function() {
    var id = '_statusDiv';
    var statusDiv = document.getElementById(id);
    if (!statusDiv) {
      statusDiv = document.createElement('div');
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
    this.statusDiv_.innerHTML = '0 / ' + this.lastPage_;
    for (var i=1; i<=this.lastPage_; i++) {
      this.search_(i);
    }
  };

  Searcher.prototype.displayResults_ = function(page, text) {
    var target = findTarget();
    if (!target) return;
    var div = document.createElement('div');
    div.innerHTML = text;
    var resultsDiv = findResultsDiv(div);
    var listingDivs = resultsDiv.getElementsByClassName(LISTING_CLASS_NAME);
    if (listingDivs) {
      var html = '';
      for (var i=0, N=listingDivs.length; i<N; i++) {
	this.numResults_++;
	this.updateStatus_(page);
 	var listing = listingDivs[i];
 	html += '<div id="' + listing.id + '" class="' +
 	  listing.className + '">' + listing.innerHTML + '</div>';
      }
      target.innerHTML += html;
    }
    this.numPages_++;
    this.updateStatus_(page);
  };
  
  Searcher.prototype.updateStatus_ = function(page) {
      var html = '';
    if (this.numPages_ == this.lastPage_) {
      html += 'Done. Showed ' + this.numPages_ + ' pages, ' +
	this.numResults_ + ' listings.';
    } else {
      html += 'Showing page ' + page + '...';
      html += '<br/>';
      html += '<em>' + this.numPages_ + ' / ' + this.lastPage_ + '</em> pages';
      html += '<br/>';
      html += '<em>' + this.numResults_ + '</em> results';
    }
    this.statusDiv_.innerHTML = html;
  };
  
  Searcher.prototype.search_ = function(page) {
    var url = this.template_.replace(REPLACE_TOKEN, page);
    var thiz = this;
    log('Searching ' + url + ' ...');
    ajax(url, (function() {
      var page_ = page;
      return function(text) {
	thiz.displayResults_(page_, text);
      }
    })());
  };

  function log(msg) {
    try {
      console.log(msg);
    } catch (_) {}
  }

  function main() {
    var lastPageAndLink = findLastPageAndLink();
    if (!lastPageAndLink) {
      alert('Couldn\'t find last page');
      return;
    }
    var lastPage = lastPageAndLink[0];
    var lastLink = lastPageAndLink[1];
    var template = lastLink.replace('=' + lastPage, '=' + REPLACE_TOKEN);
    var searcher = new Searcher(template,lastPage);
    searcher.searchAll();
  }

  main();

})();