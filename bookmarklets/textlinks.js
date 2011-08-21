(function() {

  function isValidTextNode(el) {
    if (el.nodeName !== '#text') return false;
    var p = el.parentNode;
    if (p) {
      if (p.nodeName.match(/script/i)) return false;
    }
    return true;
  }

  function addLinkEl(links) {
    var el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.top = '10px';
    el.style.left = '10px';
    el.style.padding = '10px';
    el.style.background = '#fffccc';
    el.style.border = '1px solid black';
    el.style.zIndex = '1001';
    var lst = document.createElement('ol');
    el.appendChild(lst);
    for (var i in links) {
      var link = links[i];
      var a = document.createElement('a');
      a.href = link;
      a.innerHTML = link;
      var li = document.createElement('li');
      li.appendChild(a);
      lst.appendChild(li);
    }
    document.body.appendChild(el);
    el.focus();
  }

  function main() {
    var q = [];
    q.push(document.body);
    var links2trues = {};
    while (q.length > 0) {
      var el = q.pop();
      if (isValidTextNode(el)) {
	var res;
	if (res = el.nodeValue.match(/[\s\W]?(\w+\:\/\/[\w\+-_\/]+)[\W\s]/)) {
	  links2trues[res[1]] = true;
	}
      }
      var els = el.childNodes;
      if (els) {
	for (var i in els) q.push(els[i]);
      }
    }
    var str = '';
    var links = [];
    for (var link in links2trues) {
      links.push(link);
    }
    links.sort();
    addLinkEl(links);
  }

  main();
})();