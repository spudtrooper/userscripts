(function() {
  /*
   * Bookmarklet to view reddit with a sidebar, so you don't have to use tabs.
   *
   * jsfiddle: http://jsfiddle.net/h0s9jnds/
   * screen shot: http://imgur.com/rdDTTnq
   */

  /**
   * Thing ::=
   *   { el: Element, a: Element, url: string}
   */

  function findTitleA(el) {
    var els = el.getElementsByTagName('a');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.className && el.className.match(/title/)) {
	return el;
      }
    }
    return null;
  }

  function log(msg) {
    window.console && window.console.log(msg);
  }

  /** Returns an array of Thing. */
  function findThings() {
    var els = document.getElementsByTagName('div');
    var things = [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.className && el.className.match(/thing/)) {
	var a = findTitleA(el);
	if (a) {
	  var thing = {el: el, a: a, url: a.srcurl ? a.srcurl : a.href};
	  things[things.length] = thing;
	}
      }
    }
    log('Found ' + things.length + ' things');
    return things;
  }

  function newNode(tagName, parent) {
    var el = document.createElement(tagName);
    parent.appendChild(el);
    return el;
  }

  Clicker = function(iframe) {
    /** @private {!Element} */
    this.iframe_ = iframe;

    /** @private {{el: !Element, style: !Object}} */
    this.lastClicked_ = null;
  };

  Clicker.prototype.clickThing = function(thing) {
    this.iframe_.src = thing.url;
    // Restore the previously-clicked link.
    if (this.lastClicked_) {
      this.lastClicked_.el.style.background = this.lastClicked_.elBackground;
    }
    // Set the new style.
    var el = thing.el;
    this.lastClicked_ = {el: el, elBackground: el.style.background};
    el.style.background = '#ddd';
  };

  function main() {
    var things = findThings();

    document.body.innerHTML = '';
    
    var container = newNode('div', document.body);
    container.style.position = 'relative';
    container.style.margin = '0';
    container.style.padding = '0';
    container.style.width = '100%';
    container.style.height = '100%';

    var sidebarEl = newNode('div', container);
    sidebarEl.style.position = 'fixed';
    sidebarEl.style.float = 'left';
    sidebarEl.style.width = '30%';
    sidebarEl.style.height = '100%';
    sidebarEl.style.overflowY = 'scroll';

    var mainEl = newNode('div', container);
    mainEl.style.width = '70%';
    mainEl.style.height = '100%';
    mainEl.style.float = 'right';

    var iframe = newNode('iframe', mainEl);
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    sidebarEl.style.overflow = 'both';

    var clicker = new Clicker(iframe);

    for (var i = 0; i < things.length; i++) {
      var thing = things[i];
      var el = thing.el;
      sidebarEl.appendChild(el);
      var a = thing.a;
      var newA = document.createElement('a');
      newA.innerHTML = a.innerHTML;
      newA.style = a.style;
      newA.href = '#';
      a.parentNode.replaceChild(newA, a);
      (function() {
	var thing_ = thing;
	newA.addEventListener("click", 
			   function(e) {
			     clicker.clickThing(thing_);
			     return true;
			   },
			   true);
      })();
    }
  };

  main();

})();
