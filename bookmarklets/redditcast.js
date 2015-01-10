(function() {
  /*
   * Bookmarklet to view reddit with a sidebar and send the images to a chrome 
   * cast. To use:
   *
   *   1. Go to http://reddit.com/r/pics
   *   2. Start casting
   *   3. Click the link in http://jsfiddle.net/erkdp48b/
   *
   *   When you click links on the left, the images will be sent to your
   *   chrome cast.
   *
   * jsfiddle: http://jsfiddle.net/erkdp48b/
   * screen shot: https://imgur.com/mdLHsuj
   */

  /**
   * Thing ::= { el: Element, a: Element, url: string, title: string}
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
	  var thing = {
	    el: el, a: a, url: a.srcurl ? a.srcurl : a.href,
	    title: 'Reddit casting'
	  };
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


  /**
   * Maintains state of the last item clicked.
   */
  ClickerState = function(iframe) {
    /** @private {!Element} */
    this.iframe_ = iframe;

    /** @private {{el: !Element, style: !Object}} */
    this.lastClicked_ = null;
  };

  ClickerState.prototype.clickThing = function(thing) {
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


  /**
   * Access to a local ChromeCast.
   */
  ChromeCast = function() {
    /** @private {Object} The chromecast API session. */
    this.session_ = null;
  };

  /** Initializes the chromecast. */
  ChromeCast.prototype.init = function() {
    var self = this;
    var onGCastApiAvailable = window['__onGCastApiAvailable'];
    window['__onGCastApiAvailable'] = function(loaded, errorInfo) {
      if (loaded) {
	self.initializeCastApi();
      } else {
	console.log(errorInfo);
      }
      if (onGCastApiAvailable) {
	onGCastApiAvailable(loaded, errorInfo);
      }
    };
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js';
    document.body.appendChild(script);
  };
    
  /** Called after the Cast API has loaded. */
  ChromeCast.prototype.initializeCastApi = function() {
    var self = this;
    var sessionRequest = new chrome.cast.SessionRequest(
      chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
    var sessionListener = function(e) {
      log('Have chromecast session=' + JSON.stringify(e));
      self.session_ = e;
    };
    var receiverListener = function(e) {
      console.log(e);
    };
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
					      sessionListener,
					      receiverListener);
    var onError = function(e) {
      console.log(e);
      debugger; // todo
    };
    chrome.cast.initialize(apiConfig, this.onInitSuccess, onError);
  };

  ChromeCast.prototype.onInitSuccess = function(e) {
    console.log('onInitSuccess');
    chrome.cast.requestSession(this.onRequestSessionSuccess, 
			       this.onLaunchError);
  };

  ChromeCast.prototype.onRequestSessionSuccess = function(e) {
     log('onRequestSessionSuccess ' + JSON.stringify(e));
  };

  ChromeCast.prototype.onLoadMediaError = function(e) {
     log('onLoadMediaError ' + JSON.stringify(e));
  };

  /**
   * Shows the thing on the chromecast.
   * @param {!Thing}
   */
  ChromeCast.prototype.display = function(thing) {
    log('ChromeCast display url' + thing.url + ' session=' + 
	JSON.stringify(this.session_));
    var session = this.session_;
    if (!session) {
      log('No session');
      return;
    }
    var mediaInfo = new chrome.cast.media.MediaInfo(thing.url);
    var currentMediaTitle = thing.title;
    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.PHOTO;
    // Use the URL to create the content type -- this will only work for
    // images and media.
    mediaInfo.contentType = 'img/' + thing.url.replace(/.*\./, '');
    
    mediaInfo.metadata.title = currentMediaTitle;
    
    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;
    
    session.loadMedia(request,
		      this.onMediaDiscovered.bind(this, 'loadMedia'),
		      this.onMediaError);
  };

  ChromeCast.prototype.onMediaDiscovered = function(how, mediaSession) {
    log('onMediaDiscovered ' + JSON.stringify(mediaSession));
  };

  ChromeCast.prototype.onMediaError = function(e) {
    log('onMediaError ' + JSON.stringify(e));
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
    //XXX height: 100% isn't working anymore, so pin the height to 
    //XXX  window.innerHeight.
    iframe.style.height = window.innerHeight + 'px';
    sidebarEl.style.overflow = 'both';

    var clicker = new ClickerState(iframe);
    var chromeCast = new ChromeCast();

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
	newA.addEventListener('click', 
			   function(e) {
			     clicker.clickThing(thing_);
			     chromeCast.display(thing_);
			     return true;
			   },
			   true);
      })();
    }

    chromeCast.init();
  };

  main();

})();
