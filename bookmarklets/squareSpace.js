(function() {

  function ajax(url,f) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function() {
      var done = 4, ok = 200;
      if (request.readyState == done && request.status == ok) {
	if (request.responseText) {
	  f(request.responseText);
	}
      }
    };
    request.send(null);
  }

  function processResponse(html) {
    console.log(html);
  }

  function loop() {
    if (links.length == 0) return;
    var link = links.shift();
    ajax(link,processResponse);
  }
  
  var links;
  function main() {
    var as = document.getElementsByTagName("a");
    links = [];
    for (var i in as) {
      var a = as[i];
      // http://anyvite.com/dashboard/profile/s5ersbjgw2yp2i
      if (!a.href) continue;
      if (a.href.match(/http:\/\/anyvite.com\/dashboard\/profile\/[^\/]+$/)) {
	links.push(a.href);
      }
    }
    loop();
  }
  
  main();
})();
