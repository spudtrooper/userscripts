// ==UserScript==
// @name          Depaginate
// @namespace     http://jeffpalm.com/depaginate
// @description   Depaginates a page
// @include       *
// ==/UserScript==

(function() {

  var lastEl = null;
  var addedMouseFunctions = false;
  var els2borders = [];
  const ADDED_MOUSEOVER_ATTRIBUTE = 'added_mouseover';

  function mouseover(e) {
    var el = e.relatedTarget || e.fromElement;
    if (!el) return;
    if (lastEl) {
      lastEl.style.border = els2borders[lastEl];
    }
    els2borders[el] = el.style.border;
    el.style.border = '1px solid #770000';
    lastEl = el;
  }
  
  function mouseout(e) {
    var el = e.relatedTarget || e.fromElement;
    if (!el) return;
    el.style.border = els2borders[el];
  }

  function click(e) {
    var el = e.relatedTarget || e.fromElement;
    if (!el) return;
    alert(el);
  }

  function addMouseFunctions(el) {
    if (!el) return;
    try {
      if (el.getAttribute(ADDED_MOUSEOVER_ATTRIBUTE)) return;
    } catch (e) {
      return;
    }
    el.addEventListener('mouseover',function(e){mouseover(e);},false);
    el.addEventListener('mouseout',mouseout,false);
    el.addEventListener('click',click,false);
    for (var i=0; i<el.childNodes.length; i++) {
      addMouseFunctions(el.childNodes[i]);
    }
  }

  function depaginate() {
    if (addedMouseFunctions) return;
    addMouseFunctions(document.body);
    addedMouseFunctions = true;
  }

  function main() {
    GM_registerMenuCommand('Depaginate',depaginate,'d','shift alt','d');
  }

  main();

})();