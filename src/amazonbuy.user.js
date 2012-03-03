// ==UserScript==
// @name          Amazon Buy
// @namespace     http://jeffpalm.com/amazonbuy
// @description   Automate buying of amazon items by ASIN
// @include       http://www.amazon.com/*
// ==/UserScript==
(function() {

  /*
    Test asins:
    B001AZ1D3C
    B002BA5WK0
  */
  
  const BASE = "http://www.amazon.com";
  const BUY_KEY_NAME = "__amazon_buy__";
  const ASINS_KEY_NAME = "__asins__";
  const ASIN_KEY_NAME = "__amazon_buy_asin__";
  const STORAGE_PREFIX = "__amazon_buy__";
  const SEP = ",";

  function setStyle(el,style) {
    for (var i in style) {
      el.style[i] = style[i];
    }
  }

  function createTextElement(text,onto) {
    var res = document.createTextNode(text);
    if (onto) onto.appendChild(res);
    return res;
  }

  function createElement(tag,onto,style) {
    var res = document.createElement(tag);
    if (onto) onto.appendChild(res);
    if (style) setStyle(res,style);
    return res;
  }

  function log(msg) {
    try {
      console.log(msg);
    } catch (e) {}
  }

  function setValue(key,name) {
    localStorage[STORAGE_PREFIX + key] = name;
  }
  
  function getValue(key) {
    return localStorage[STORAGE_PREFIX + key];
  }
  
  function asinToPath(asin) {
    return BASE + "/dp/" + asin;
  }

  function getParams(loc) {
    loc = loc || String(document.location);
    loc = loc.replace(/.*\?/,"");
    var parts = loc.split(/&/);
    var res = [];
    for (var i=0; i<parts.length; i++) {
      var p = parts[i];
      var part = p.split(/=/);
      var k = part[0], v = part[1];
      res[k] = v;
    }
    return res;
  }

  function asinLink(asin) {
    return "http://www.amazon.com/dp/" + asin;
  }

  function removeChildren(el) {
    while (el.childNodes.length > 0) {
      el.removeChild(el.firstChild);
    }
  }

  function getAsinFromUrl() {
    var key = ASIN_KEY_NAME;
    var ps = getParams();
    var asin = ps[key];
    return asin;
  }

  function removeAsinFromStorage(asin) {
    var asins = getAsinsFromStorage();
    var newAsins = [];
    for (var i in asins) {
      if (asins[i] !== asin) {
	newAsins.push(asins[i]);
      }
    }
    saveAsinsToStorage(newAsins);
  }

  function saveAsinsToStorage(asins) {
    log("saveAsinsToStorage asins=" + asins);
    var key = ASINS_KEY_NAME;
    var sep = SEP;
    var asinsStr = asins.join(sep);
    setValue(key,asinsStr);
  }

  function getAsinsFromStorage() {
    var key = ASINS_KEY_NAME;
    var sep = SEP;
    var asinsStr = getValue(key) || "";
    var asins = asinsStr.split(sep);
    // Make sure they are long enough
    var set = [];
    for (var i in asins) {
      var as = asins[i];
      if (as.length == 0 || as === '') continue;
      set[as] = true;
    }
    var res = [];
    for (var asin in set) res.push(asin);
    log("getAsinsFromStorage asins=" + res);
    return res;
  }
  
  function createArray(str) {
    str = String(str);
    str = str.replace(/\s+/g,',');
    return str.split(/,/);
  }

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

  function Model() {
    this.changeEvent = new EventNotifier("Change");
  }

  Model.prototype = {
    getAsins: function() {
      return getAsinsFromStorage();
    },

    /** String -> Void */
    removeAsin: function(asin) {
      var asins = this.getAsins();
      var newAsins = [];
      var changed = false;
      for (var i in asins) {
	if (asins[i] !== asin) {
	  newAsins.push(asins[i]);
	} else {
	  changed = true;
	}
      }
      if (chaged) {
	this._saveAsins(newAsins);
      }
    },

    /** String[] -> Void */
    addAsins: function(asins) {
      var newAsins = this.getAsins();
      for (var i in asins) {
	newAsins.push(asins[i]);
      }
      this._saveAsins(newAsins);
    },

    /** Void -> Void */
    clearAsins: function() {
      this._saveAsins([]);
    },

    /** Void -> EventNotifier(Model) */
    getChangeEvent: function() {
      return this.changeEvent;
    },

    _saveAsins: function(asins) {
      saveAsinsToStorage(asins);
      this.changeEvent.notifyListeners(this);
    }
  };

  function View() {
    var elStyle = {
      'position': 'fixed',
      'bottom': '10px',
      'right': '10px',
      'backgroundColor': '#ddd',
      'minWidth': '150px',
      'minHeight': '200px',
      'border': '1px solid black',
      'padding': '5px',
      'zIndez': '1000000000'
    };
    var el = createElement('div',document.body,elStyle);
    var h1Style = {
      'fontWeight': 'bold'
    };
    var h1 = createElement('div',el,h1Style);
    h1.innerHTML = 'Amazon Buy';
    var textStyle = {
      'width': '100%'
    };
    createTextElement(' (',h1);
    var numAsinsSpan = createElement('span',h1);
    numAsinsSpan.innerHTML = '-';
    createTextElement(')',h1);
    createElement('br',el);
    var msgSpanStyle = {
      'fontStyle': 'italic',
    };
    var msgSpan = createElement('div',el,msgSpanStyle);
    var text = createElement('textarea',el,textStyle);
    text.rows = '3';
    var row = createElement('div',el);
    var thiz = this;
    var addButton = createElement('button',row);
    addButton.innerHTML = 'Add';
    addButton.addEventListener('click', 
			       function() {
				 thiz._notifyAddListeners();
			       }, true);
    var clearButton = createElement('button',row);
    clearButton.innerHTML = 'Clear';
    clearButton.addEventListener('click',
				 function() {
				   thiz._maybeNotifyClearListeners();
				 }, true);
    var goButton = createElement('button',row);
    goButton.innerHTML = 'Go';
    goButton.addEventListener('click',
			      function() {
				thiz.goEvent.notifyListeners();
			      }, true);
    var ulDivStyle = {
      'overflow': 'auto',
    };
    var ulDiv = createElement('div',el,ulDivStyle);
    var ul = createElement('ul',ulDiv);

    this.el = el;
    this.ul = ul;
    this.text = text;
    this.numAsinsSpan = numAsinsSpan;
    this.msgSpan = msgSpan;
    this.addButton = addButton;
    this.clearButton = clearButton;
    this.goButton = goButton;

    this.addEvent = new EventNotifier("Add");
    this.clearEvent = new EventNotifier("Clear");
    this.goEvent = new EventNotifier("Go");
    this.removeEvent = new EventNotifier("Remove");
  }

  View.prototype = {

    /** String -> Void */
    showMessage: function(msg) {
      this.msgSpan.innerHTML = msg;
    },

    /** String[] -> Void */
    updateViewWithAsins: function(asins) {
      removeChildren(this.ul);
      for (var i in asins) {
	var asin = asins[i];
	var li = createElement('li',this.ul);
	var a = createElement('a',li);
	a.innerHTML = asin;
	a.href = asinLink(asin);
	createTextElement(' [',li);
	var remove = createElement('a',li);
	remove.innerHTML = 'X';
	remove.href = '#';
	var thiz = this;
	remove.addEventListener('click',
				(function(asin) {
				  return function() {
				    thiz.removeEvent.notifyListeners(asin);
				  };
				})(asin),true);
	createTextElement(']',li);
      }
      var len = asins.length;
      this.numAsinsSpan.innerHTML = String(len);
      // TODO
      if (len === 0) {
	this.clearButton.enabled = false;
	this.goButton.enabled = false;
      } else {
	this.clearButton.enabled = true;
	this.goButton.enabled = true;
      }
    },
    /** Void -> EventNotifier(String[]) */
    getAddEvent: function() {
      return this.addEvent;
    },
    /** Void -> EventNotifier(String) */
    getRemoveEvent: function() {
      return this.removeEvent;
    },
    /** Void -> EventNotifier(Void) */
    getClearEvent: function() {
      return this.clearEvent;
    },
    /** Void -> EventNotifier(Void) */
    getGoEvent: function() {
      return this.goEvent;
    },

    _maybeNotifyClearListeners: function() {
      var res = confirm("Are you sure you want to clear all ASINs?");
      if (res) {
	this.clearEvent.notifyListeners();
      }
    },

    _notifyAddListeners: function() {
      var arr = createArray(this.text.value);
      this.text.value = "";
      this.addEvent.notifyListeners(arr);
    }
  };
  
  function Controller(model,view) {
    this.model = model;
    this.view = view;
    var thiz = this;
    var m = this.model;
    var v = this.view;
    v.getAddEvent().addListener(function(asins) {
      m.addAsins(asins);
    });
    v.getRemoveEvent().addListener(function(asin) {
      m.removeAsin(asin);
    });
    v.getClearEvent().addListener(function() {
      m.clearAsins();
    });
    m.getChangeEvent().addListener(function(model) {
      v.updateViewWithAsins(model.getAsins());
    });
  }

  Controller.prototype = {
    /** Void -> Void */
    showMenu: function() {
      var asins = this.model.getAsins();
      this.view.updateViewWithAsins(asins);
    },
    /** String -> Void */
    showMessage: function(s) {
      alert(s);
    },
    /** Void -> Model */
    getModel: function() {
      return this.model;
    },
    /** Void -> EventNotifier(Void) */
    getGoEvent: function() {
      return this.view.getGoEvent();
    }
  };

  function App(controller) {
    var thiz = this;
    this.controller = controller;
    this.controller.getGoEvent().addListener(function() {
      thiz._maybeAddAnotherAsin('Please add some more ASINs');
    });
  }

  App.prototype = {

    go: function() {
      this.controller.showMenu();
      var loc = String(document.location);
      // If we put the buy key in the url, we want to try to buy the
      // current item.
      if (loc.indexOf(BUY_KEY_NAME) > 0) {
	// We only want to do this on a product page
	if (loc.match(/\/dp\//)) {
	  this._tryToBuyCurrentItem();
	}
      } 
      // Otherwise, get all the asins from storage, pull one out, and
      // redirect to that page.
      else {
	// We only want to do this on the upsell page, because that
	// means that we just added something to the cart
	if (loc.match(/\/gp\/cart\/view-upsell.html/)) {
	  this._maybeAddAnotherAsin('Done');
	}
      }
    },
    
    _maybeAddAnotherAsin: function(emptyMsg) {
      var done = true;
      var asins = this.controller.getModel().getAsins();
      if (asins.length === 0) {
	this.controller.showMessage(emptyMsg);
	return;
      }
      var asin = asins.shift();
      if (asin && asin !== "") {
	var key = ASIN_KEY_NAME;
	var url = asinToPath(asin);
	url += "?" + key + "=" + asin;
	url += "&" + BUY_KEY_NAME + "=1";
	document.location = url;
	done = false;
      }
      if (done) {
	this.controller.showMessage("Done");
      }
    },

    _tryToBuyCurrentItem: function() {
      log("tryToBuyCurrentItem");
      var ips = document.getElementsByTagName("INPUT");
      var span = null;
      for (var i=0; i<ips.length; i++) {
	if (!!ips[i].alt && ips[i].alt === "Add to Shopping Cart") {
	  span = ips[i];
	  break;
	}
      }
      if (!span) return;
      try {
	log("Submitting...");
	span.click();
	var asin = getAsinFromUrl();
	this.controller.getModel().removeAsin(asin);
      } catch (e) {alert(e);}
    }
  };
  
  function main() {
    var view = new View();
    var model =  new Model();
    var controller = new Controller(model,view);
    var app = new App(controller);
    app.go();
  }

  main();

})();