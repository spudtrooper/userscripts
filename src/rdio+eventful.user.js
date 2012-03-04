// ==UserScript==
// @name          Rdio + Eventful
// @namespace     http://jeffpalm.com/rdioeventful
// @description   Displays local concerts on rd.io pages from eventful
// @include       *rdio.com/#*
// @include       *rd.io/#*
// ==/UserScript==

(function() {

    const CHECK_ARTIST_PERIOD = 3000;
    const LAST_SEARCH_KEY = 'last.search';
    const SEARCH_KEY = 'search';

    const INSTALL_LINK_ID = 'rdio_shows_install_link';

    // ----------------------------------------------------------------------
    // Event notifier
    // ----------------------------------------------------------------------

    function EventNotifier(name) {
	this.name = name;
	this.callbacks = [];
    }
    
    EventNotifier.prototype = {
	addListener: function(callback) {
	    this.callbacks.push(callback);
	},
	notifyListeners: function(value) {
	    var cbs = this.callbacks;
	    log("notify " + cbs.length + " [" + this.name + "](" + value + ")");
	    for (var i=0; i<cbs.length; i++) {
		cbs[i](value);
	    }
	}
    };
    
    // ----------------------------------------------------------------------
    // Misc stuff
    // ----------------------------------------------------------------------

    function formatDate(date) {
	// 2012-03-06 20:00:00
        var res = date.match(/\d+-(\d+)-(\d+) (\d+):(\d+)/);
	if (!!res) {
	    var mon = translateMonth(parseInt(res[1]));
	    var day = res[2].replace(/^0+/,'');
	    var hours = parseInt(res[3])
	    var mins = res[4];
	    var amPm;
	    if (hours == 0) {
		amPm = 'a';
		hours = 12;
	    } else if (hours < 12) {
		amPm = 'a';
	    } else if (hours == 12) {
		amPm = 'p';
	    } else {
		amPm = 'p';
		hours -= 12;
	    }
	    var time = hours;
	    if (parseInt(mins) != 0) {
		time += ':' + mins;
	    }
	    time += amPm;
	    return mon + ' ' + day + ' @ ' + time;
	    
	}
	return date;
    }
    
    function translateMonth(mon) {
	switch (mon) {
	case 1:  return 'Jan'; 
	case 2:  return 'Feb'; 
	case 3:  return 'Mar'; 
	case 4:  return 'Apr'; 
	case 5:  return 'May'; 
	case 6:  return 'Jun'; 
	case 7:  return 'Jul'; 
	case 8:  return 'Aug'; 
	case 9:  return 'Sep'; 
	case 10: return 'Oct'; 
	case 11: return 'Nov'; 
	case 12: return 'Dec'; 
	}
	return mon;
    }

    function getXMLValue(el,nodeName) {
	var els = el.getElementsByTagName(nodeName);
	if (!els || els.length == 0) return null;
	return els[0].childNodes[0].nodeValue;
    }

    function massage(s) {
	if (s) {
	    s = s.replace(/\_\d+$/,'');
	    s = s.replace(/_/g,' ');
	}
	return s;
    }

    function ajax(url,f) {
	var xmlHttp = new XMLHttpRequest(); 
	xmlHttp.onreadystatechange = function () { 
	    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) { 
		f.call(this,xmlHttp.responseText); 
	    } 
	}; 	
	xmlHttp.open('GET',url,true);
	xmlHttp.send(null);
    }

    function fail(msg) {
	log('ERROR: ' + msg);
    }

    function log(msg) {
	try {
	    console.log(msg);
	} catch (_) {}
    }

    // ----------------------------------------------------------------------
    // UI stuff
    // ----------------------------------------------------------------------

    function setStyle(el,style) {
	for (var i in style) {
	    el.style[i] = style[i];
	}
    }

    function br(el) {
	$n('br',el);
    }

    function $n(tag,onto) {
	var el = document.createElement(tag);
	if (!!onto) onto.appendChild(el);
	return el;
    }

    function $t(text,onto) {
	var el = document.createTextNode(text);
	if (!!onto) onto.appendChild(el);
	return el;
    }

    // ----------------------------------------------------------------------
    // Eventful.com
    // ----------------------------------------------------------------------
    function Eventful(app) {
	this.app = app;
    }
    Eventful.prototype = {
	
	getApiKey: function() {
	    return ;
	},

	search: function(artist,loc,f) {
	    var appKey = 'swpJJKRsqbWQg6SZ';
	    var url = 'http://api.eventful.com/rest/events/search'
		+ '?app_key=' + appKey
		+ '&keywords=' + escape(artist)
		+ '&location=' + escape(loc)
		+ '&date=Future';
	    ajax(url,f);
	},
	
	getCurrentUsername: function() {
	    var tits = document.getElementsByClassName('title');
	    for (var i=0; i<tits.length; i++) {
		if (tits[i].nodeName.toLowerCase() == 'a') {
		    var res = tits[i].href.match(/\/people\/(\w+)/);
		    if (!!res) return res[1];
		}
	    }
	    return null;
	}

    };

    // ----------------------------------------------------------------------
    // Rd.io
    // ----------------------------------------------------------------------

    function Rdio(app) {
	this.app = app;
    }

    Rdio.prototype = {
	
	findCurrentLocation: function() {
	    var divs = document.getElementsByClassName("location");
	    log("divs="+divs);
	    if (!divs) return null;
	    if (divs.length == 0) return null;
	    return divs[0].innerHTML;
	},

	getArtistAndAlbum: function () {
	    var hash = document.location.hash.replace(/#/,'');
	    var res;
	    var artist = null;
	    var album = null;
	    if (res = hash.match(/\/artist\/([^\/]+)\/album\/([^\/]+)/)) {
		artist = res[1];
		album = res[2];
	    } else if (res = hash.match(/\/artist\/([^\/]+)/)) {
		artist = res[1];
	    }
	    artist = massage(artist);
	    album = massage(album);
	    return {artist:artist, album:album};
	}
    };

    // ----------------------------------------------------------------------
    // Storage
    // ----------------------------------------------------------------------

    function Storage() {}
    
    const LOCAL_STORAGE_PREFIX = '*rdio.shows*';
    Storage.prototype = {

	get: function(key,defaultValue) {
	    try {
		var res = localStorage[LOCAL_STORAGE_PREFIX + key];
		if ((!!res && res != 'null') || !defaultValue) {
		    return res;
		}
	    } catch (_) {}
	    return defaultValue;
	},

	set: function(key,value) {
	    try {
		localStorage[LOCAL_STORAGE_PREFIX + key] = value;
	    } catch (_) {}
	}
    };

    // ----------------------------------------------------------------------
    // Model: Consists of a user,city,artist,event data
    // ----------------------------------------------------------------------

    function Model(app) {
	this.app = app;
	this.modelChangedEvent = new EventNotifier();
	this.lastCheckLocation = null;

    }

    const CURRENT_LOCATION_KEY = 'current.city';
    const MILLIS_BETWEEN_SEARCHES = 1000 * 60 * 60 * 24;
    
    Model.prototype = {

	getModelChangedEvent: function() {
	    return this.modelChangedEvent;
	},

	invalidateCachedLocation: function() {
	    this.lastCheckLocation = null;
	},

	checkForChanges: function() {
	    var curLocation = String(document.location);
	    if (curLocation == this.lastCheckLocation) {
		return;
	    }
	    this.lastCheckLocation = curLocation;
	    var loc = this.getCurrentLocation();
	    if (!loc) return;
	    var artist = this.app.getRdio().getArtistAndAlbum().artist;
	    if (!artist) return;
	    this.searchForShows(artist,loc);
	},
	
	searchForShows: function(artist,loc) {
	    log('Searching for ' + artist + ' in ' + loc);
	    //
	    // Don't search too often
	    //
	    var now = parseInt(+new Date());
	    var keyForData = SEARCH_KEY + artist + location;
	    var keyForDate = LAST_SEARCH_KEY + artist + location;
	    var last = this.app.getStorage().get(keyForDate);
	    if (!!last) {
		var lastMillis = parseInt(last);
		if (now-lastMillis < MILLIS_BETWEEN_SEARCHES) {
		    var text = this.app.getStorage().get(keyForData);
		    if (!!text) {
			this.processArtistText(artist,text,null,null);
		    } else {
			log('Searching too soon');
		    }
		    return;
		}
	    }
	    var thiz = this;
	    this.app.getEventful().search(
		artist,loc,
		(function() {
		    var _artist = artist;
		    var _keyForDate = keyForDate;
		    var _keyForData = keyForData;
		    return function(text) {
			thiz.processArtistText(_artist,text,
					       _keyForDate,_keyForData);
		    }
		})()
	    );
	},

	processArtistText: function(artist,text,keyForDate,keyForData) {
	    log('processArtistText for ' + artist + ' cached=' + !keyForData);
	    if (!!keyForDate) {
		this.app.getStorage().set(keyForDate,parseInt(+new Date()));
	    }
	    if (!!keyForDate) {
		log(text);
		this.app.getStorage().set(keyForData,text);
	    }
	    this.modelChangedEvent.notifyListeners(text);
	},

	getCurrentLocation: function() {
	    var loc = this.app.getRdio().findCurrentLocation();
	    if (!!loc) {
		this.app.getStorage().set(CURRENT_LOCATION_KEY,loc);
		return loc;
	    }
	    return this.app.getStorage().get(CURRENT_LOCATION_KEY);
	},
	
    };

    // ----------------------------------------------------------------------
    // Menu
    // ----------------------------------------------------------------------

    function View(app) {
	this.app = app;
    }

    View.prototype = {
	
	updateWithXMLText: function(text) {
	    var target = document.getElementsByClassName('info_box metadata')[0];
	    if (!target) {
		// If we can't find the target node to use for dislpaying
		// the shows, it means the page hasn't finished
		// rendering.The way we allow this page to be processed
		// again is by setting lastCheckLocation to null
		log("Can't find a target node");
		this.app.invalidateCache();
	    }
	    var xmlDoc = new DOMParser().parseFromString(text,"text/xml");	
	    var events = xmlDoc.getElementsByTagName("event");
	    if (!events) return;

	    // The node used to display the list of shows or 'none'
	    var div = $n('div');

	    // Try to insert after the first child
	    div.className = 'info_group';
	    if (target.firstChild.nextSibling) {
		target.firstChild.nextSibling.className =
		    target.firstChild.nextSibling.className.replace(/first/,'');
		target.insertBefore(div,target.firstChild.nextSibling);
		div.className += ' first';
	    } else {
		target.appendChild(div);
	    }
	    var h4 = $n('h4',div);
	    h4.className = 'info_title';
	    h4.innerHTML = 'shows';
	    var p = $n('p',div);
	    p.className = 'info_title';
	    if (events.length == 0) {
		$t('none',p);
	    } else {

		// Sort the events, so create a normal array from the node
		// list and sort it according to date
		var sortedEvents = []
		for (var i=0; i<events.length; i++) {
		    sortedEvents.push(events[i]);
		}
		sortedEvents.sort(function(e1,e2) {
		    var start_time1 = getXMLValue(e1,'start_time');
		    var start_time2 = getXMLValue(e2,'start_time');
		    return start_time1 > start_time2;
		});
		log('Found ' + sortedEvents.length + ' events');
		
		for (var i=0, N=sortedEvents.length; i<N; i++) {
		    var event = sortedEvents[i];
		    var venue_url = getXMLValue(event,'venue_url');
		    var venue_name = getXMLValue(event,'venue_name');
		    var venue_address = getXMLValue(event,'venue_address');
		    var city_name = getXMLValue(event,'city_name');
		    var url = getXMLValue(event,'url');
		    var start_time = getXMLValue(event,'start_time');
		    var region_abbr = getXMLValue(event,'region_abbr');

		    log('venue_url='+venue_url);
		    log('venue_name='+venue_name);
		    log('venue_address='+venue_address);
		    log('city_name='+city_name);
		    log('url='+url);
		    log('start_time='+start_time);
		    log('region_abbr='+region_abbr);

		    var newEl = $n('div',p);
		    var newTitle = $n('a',newEl);
		    newTitle.innerHTML = venue_name;
		    newTitle.href = url;
		    br(newEl);
		    var newLoc = city_name;
		    if (!!region_abbr) newLoc += ', ' + region_abbr;
		    $t(newLoc,newEl);
		    br(newEl);
		    $t(formatDate(start_time),newEl);
		    if (i<N-1) br(p);
		}
	    }
	},
	
    };


    // ----------------------------------------------------------------------
    // Main app
    // ----------------------------------------------------------------------

    function App() {
	this.storage = new Storage();
	this.rdio = new Rdio(this);
	this.eventful = new Eventful(this);
	this.model = new Model(this);
	this.view = new View(this);

	var thiz = this;

	this.model.getModelChangedEvent().addListener(function(text) {
	    thiz.view.updateWithXMLText(text);
	});
    }

    App.prototype = {
	getRdio: function() {
	    return this.rdio;
	},
	getEventful: function() {
	    return this.eventful;
	},
	getModel: function() {
	    return this.model;
	},
	getStorage: function() {
	    return this.storage;
	},
	getView: function() {
	    return this.view;
	},
	invalidateCache: function() {
	    this.model.invalidateCachedLocation();
	},
	start: function() {
	    var thiz = this;
	    setInterval(function() {thiz.model.checkForChanges();},
			CHECK_ARTIST_PERIOD);
	},
    };
    
    function main() {
	new App().start();
    }

    main();
    
})();