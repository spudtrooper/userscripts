(function() {
  
  function main() {
    //
    // Reuse these
    //
    var spans = document.getElementsByTagName('span');
    //
    // Allows us to put a tool-tip as the labels to which each
    // reference refers
    //
    var labels2tooltips = [];
    for (var i in spans) {
      var span = spans[i];
      //
      // Create anchors for all the that look like this:
      //
      //   <span class="nl">recvbuflen:</span>
      //
      if (span.className == 'nl') {
	var anchor = document.createElement('a');
	var label = span.innerHTML.replace(/:/g,'').trim();
	anchor.name = label;
	span.parentNode.insertBefore(anchor,span.parentNode.firstChild);
	//
	// Create tool-tip for every use of this label
	//
	var tooltip = '';
	for (var el = span.nextSibling; el !== null; el = el.nextSibling) {
	  if (!!el.innerHTML) {
	    tooltip += el.innerHTML.trim() + ' ';
	  }
	}
	tooltip = tooltip.trim();
	alert(label + ":" + tooltip);
	labels2tooltips[label] = tooltip;
      }
      //
      // Surround reference nodes with <A>'s that point to the
      // appropriate value or branch from the previous path.  These look
      // like this:
      //
      //   <span class="nv">recvbuflen</span>
      //
      else if (span.className == 'nv') {
	var ref = span.innerHTML.trim();
	while (span.childNodes.length > 0) {
	  span.removeChild(span.childNodes[0]);
	}
	var a = document.createElement('a');
	a.innerHTML = ref;
	a.href = '#' + ref;
	a.title = labels2tooltips[ref]
	span.appendChild(a);
      }
    }    
  }
  
  main();

})();