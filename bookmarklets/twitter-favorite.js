/*
 * Bookmarklet to periodically favorite all the tweets on a page.
 * Copy bookmarklet from here: http://jsfiddle.net/p2VsT/
 */
(function() {

var period = 15 * 1000;
var unfavoritedColor = 'rgb(225,232, 237)';

function checkFavorites() {
  var els = document.getElementsByTagName('li');
  for (var i = 0; i < els.length; i++) {
    var li = els[i];
    if (li.className == 'action-fav-container js-toggle-state js-toggle-fav') {
      checkFavorite(li);
    }
  }
}

function checkFavorite(li) {
  var spans = li.getElementsByTagName('span');
  if (spans.length != 2) {
    return;
  }
  var favoriteSpan = spans[0];
  var style = window.getComputedStyle(favoriteSpan);
  var color = String(style.color).replace(' ','').trim();
  if (color == unfavoritedColor) {
    click(favoriteSpan);
  }
}

function click(li) {
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0,
		     false, false, false, false, 0, null);
  li.dispatchEvent(evt);
}

function main() {
    setInterval(checkFavorites, period);
}

  main();
})();
