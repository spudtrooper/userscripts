// ==UserScript==
// @name          Rdio + Eventful
// @namespace     http://jeffpalm.com/rdioeventful
// @description   Displays local concerts on rd.io pages from eventful
// @include       *rdio.com/#*
// @include       *rd.io/#*
// ==/UserScript==

(function() {

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
	    log('notify ' + cbs.length + ' [' + this.name + '](' + value + ')');
	    for (var i=0; i<cbs.length; i++) {
		cbs[i](value);
	    }
	}
    };
    
    // ----------------------------------------------------------------------
    // Misc stuff
    // ----------------------------------------------------------------------

    /*
      An EventfulEvent is a Hash
      { 
      String venue_url,
      String venue_name,
      String venue_address,
      String city_name,
      String url,
      String start_time,
      String region_abbr,
      }
    */

    function formatDate(date) {
	var res = formatDateHelper(date);
	log('formatDate: ' + date + ' -> ' + res);
	return res;
    }
    
    function formatDateHelper(date) {
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
	var res = els[0].childNodes[0].nodeValue;
	log(nodeName + ' -> ' + res);
	return res;
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
    // Eventful: eventful.com interface
    // ----------------------------------------------------------------------

    function Eventful() {}
    
    Eventful.prototype = {
	
	/** String String (String -> Void) */
	search: function(artist,loc,f) {
	    var appKey = 'swpJJKRsqbWQg6SZ';
	    var url = 'http://api.eventful.com/rest/events/search'
		+ '?app_key=' + appKey
		+ '&keywords=' + escape(artist)
		+ '&location=' + escape(loc)
		+ '&date=Future';
	    ajax(url,f);
	},

	/**
	 * String -> List(EventfulEvent)
	 *
	 * Transforms the XML text into a list of EventfulEvent.
	 */
	parseEventfulEventsFromText: function(text) {
	    var xmlDoc = new DOMParser().parseFromString(text,"text/xml");	
	    var events = xmlDoc.getElementsByTagName("event");
	    
	    var res = [];

	    if (!events || events.length == 0) return res;
	    
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
	    
	    // Turn the XML text into hashes
	    for (var i in sortedEvents) {
		var event = sortedEvents[i];
		var e = {
		    venue_url: getXMLValue(event,'venue_url'),
		    venue_name: getXMLValue(event,'venue_name'),
		    venue_address: getXMLValue(event,'venue_address'),
		    city_name: getXMLValue(event,'city_name'),
		    url: getXMLValue(event,'url'),
		    start_time: getXMLValue(event,'start_time'),
		    region_abbr: getXMLValue(event,'region_abbr')
		};
		res.push(e);
	    }
	    return res;
	},
	
	/** -> String */
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
    // Rdio: rd.io interface
    // ----------------------------------------------------------------------

    function Rdio() {}

    Rdio.prototype = {
	
	/** -> String */
	findCurrentLocation: function() {
	    var divs = document.getElementsByClassName("location");
	    return (!divs || divs.length == 0) ? null : divs[0].innerHTML;
	},

	/** -> {String artist, String album} */
	getArtistAndAlbum: function () {
	    var hash = document.location.hash.replace(/#/,'');
	    var artist = null;
	    var album = null;
	    var res;
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

    function Storage(prefix) {
	this.prefix = prefix;
    }

    Storage.prototype = {

	get: function(key,defaultValue) {
	    try {
		var res = localStorage[this.prefix + key];
		if ((!!res && res != 'null') || !defaultValue) {
		    return res;
		}
	    } catch (_) {}
	    return defaultValue;
	},

	set: function(key,value) {
	    try {
		localStorage[this.prefix + key] = value;
	    } catch (_) {}
	}
    };

    // ----------------------------------------------------------------------
    // Model
    // ----------------------------------------------------------------------

    const CURRENT_LOCATION_KEY = 'current.city';
    const LAST_SEARCH_KEY = 'last.search';
    const SEARCH_KEY = 'search';
    const MILLIS_BETWEEN_SEARCHES = 1000 * 60 * 60 * 24;

    function Model(storage,rdio,eventful) {
	this.storage = storage;
	this.rdio = rdio;
	this.eventful = eventful;
	this.modelChangedEvent = new EventNotifier();
	this.lastCheckLocation = null;
	this.artist = null;
	this.location = null;
	this.eventfulEvents = null;
    }
    
    Model.prototype = {

	/** Void -> String */
	getArtist: function() {return this.artist;},

	/** Void -> String */
	getLocation: function() {return this.location;},

	/** Void -> List(EventfulEvent) */
	getEventfulEvents: function() {return this.eventfulEvents;},

	/** Void -> EventNotifier[List(Eventfulevents)] */
	getModelChangedEvent: function() {return this.modelChangedEvent;},

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
	    var artist = this.rdio.getArtistAndAlbum().artist;
	    if (!artist) return;
	    this.searchForShows(artist,loc);
	},
	
	searchForShows: function(artist,loc) {
	    log('Searching for ' + artist + ' in ' + loc);

	    // Don't search too often
	    var now = parseInt(+new Date());
	    var keyForData = SEARCH_KEY + artist + location;
	    var keyForDate = LAST_SEARCH_KEY + artist + location;
	    var last = this.storage.get(keyForDate);
	    if (!!last) {
		var lastMillis = parseInt(last);
		if (now-lastMillis < MILLIS_BETWEEN_SEARCHES) {
		    var text = this.storage.get(keyForData);
		    if (!!text) {
			this.processArtistText(artist,loc,text);
		    } else {
			log('Searching too soon');
		    }
		    return;
		}
	    }
	    var thiz = this;
	    this.eventful.search(
		artist,loc,
		(function() {
		    var _artist = artist;
		    var _loc = loc;
		    var _keyForDate = keyForDate;
		    var _keyForData = keyForData;
		    return function(text) {
			thiz.saveDataAndprocessArtistText(
			    _artist,_loc,text,_keyForDate,_keyForData);
		    }
		})()
	    );
	},

	saveDataAndprocessArtistText: function(artist,location,text,
					       keyForDate,keyForData) {
	    this.storage.set(keyForDate,parseInt(+new Date()));
	    this.storage.set(keyForData,text);
	    this.processArtistText(artist,location,text);
	},
	
	processArtistText: function(artist,location,text) {
	    log('processArtistText for ' + artist + ' @ ' + location);
	    this.artist = artist;
	    this.location = location;
	    this.eventfulEvents = 
		this.eventful.parseEventfulEventsFromText(text);
	    this.modelChangedEvent.notifyListeners(this.eventfulEvents);
	},

	getCurrentLocation: function() {
	    var loc = this.rdio.findCurrentLocation();
	    if (!!loc) {
		this.storage.set(CURRENT_LOCATION_KEY,loc);
		return loc;
	    }
	    return this.storage.get(CURRENT_LOCATION_KEY);
	},
	
    };

    // ----------------------------------------------------------------------
    // Menu
    // ----------------------------------------------------------------------

    function View() {}
    
    View.prototype = {
	
	/** 
	 * List(EventfulEvent) -> Boolean
	 *
	 * Return false if this view wasn't ready for an update.
	 */
	updateWithEvents: function(events) {
	    var target = 
		document.getElementsByClassName('info_box metadata')[0];
	    if (!target) {
		// If we can't find the target node to use for dislpaying
		// the shows, it means the page hasn't finished
		// rendering.The way we allow this page to be processed
		// again is by setting lastCheckLocation to null
		log("Can't find a target node");
		return false;
	    }

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
		for (var i in events) {
		    var e = events[i];
		    if (i > 0) br(p);
		    var newEl = $n('div',p);
		    newEl.className = 'info_text';
		    var newTitle = $n('a',newEl);
		    newTitle.innerHTML = e.venue_name;
		    newTitle.href = e.url;
		    br(newEl);
		    var newLoc = e.city_name;
		    if (!!e.region_abbr) newLoc += ', ' + e.region_abbr;
		    $t(newLoc,newEl);
		    br(newEl);
		    $t(formatDate(e.start_time),newEl);
		}
	    }
	    return true;
	},
	
    };


    // ----------------------------------------------------------------------
    // Main app
    // ----------------------------------------------------------------------

    const CHECK_ARTIST_PERIOD = 3000;
    const LOCAL_STORAGE_PREFIX = '*rdio.shows*';

    function App() {
	this.model = new Model(new Storage(LOCAL_STORAGE_PREFIX),
			       new Rdio(),
			       new Eventful());
	this.view = new View();
	var thiz = this;
	this.model.getModelChangedEvent().addListener(
	    function(events) {thiz.modelChanged(events);});
    }
    
    App.prototype = {
	modelChanged: function(events) {
	    if (!this.view.updateWithEvents(events)) {
		this.model.invalidateCachedLocation();
	    }
	},
	start: function() {
	    var thiz = this;
	    setInterval(function() {thiz.model.checkForChanges();},
			CHECK_ARTIST_PERIOD);
	},
    };

    // Main
    new App().start();

})();