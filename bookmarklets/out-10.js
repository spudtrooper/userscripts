javascript:(function() {var q=[];q.push(document.body);while (q.length > 0) {var el=q.pop();console.log(el.nodeName);var els=el.childNodes;for (var i in els) q.add(els[i]);}})();