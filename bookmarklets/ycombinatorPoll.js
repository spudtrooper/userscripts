/*
 * Bookmarklet to add colored histograms to polls on news.ycombinator.org
 * 
 * e.g. http://imgur.com/8iPak
 */
(function() {
  
  const MAX_CHARS = 75;

  function setStyle(el,style) {
    for (var i in style) {
      el.style[i] = style[i];
    }
  }

  function normalize(n,v,min,max,d) {
    d = d || n/2;
    return Math.floor(n - d*(max-v)/(max-min));
  }

  function createScoreDiv(span,score,min,max) {
    var chars = normalize(MAX_CHARS,score,min,max);
    var cval = normalize(0xff,score,min,max,0xee);
    var color = "#" + cval.toString(16) + "0000";
    var td = span.parentNode;
    td.appendChild(document.createTextNode(" "));
    var el = document.createElement("span");
    td.appendChild(el);
    var elStyle = {
      "height": "100%",
      "background-color": color,
      "color": color
    };
    var str = "";
    for (var i=0; i<chars; i++) str += "|";
    el.innerHTML = str;
    setStyle(el,elStyle);
    console.log(el);
  }
  
  function main() {
    var spans = document.getElementsByTagName("span");
    var pairs = [];
    function makePair(span,score) {
      return {span:span, score:score};
    }
    var min;
    var max;
    for (var i in spans) {
      var span = spans[i];
      if (!span.id || !span.id.match(/score_/)) continue;
      var score = parseInt(span.innerHTML.match(/(\d+) /)[0]);
      if (!min || score<min) min = score;
      if (!max || score>max) max = score;
      pairs.push(makePair(span,score));
    }
    for (var i in pairs) {
      // Skip the first one
      if (i==0) continue;
      var p = pairs[i];
      createScoreDiv(p.span,p.score,min,max)
    }
    
  }
  
  main();
  
})();