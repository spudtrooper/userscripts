/**
 * A script to click the like buttons with the most scores on
 * comedywire.com pages as a way to 'buy' likes.
 */
var MAX_NUM_TO_CLICK = 5;
var MILLIS_BETWEEN_CLICKS = 1000;

function Clicker(pairs) {
  this.numClicked = 0;
  this.pairs = pairs.concat([]);
}

Clicker.prototype.start = function() {
  this.click();
};

Clicker.prototype.click = function() {
  if (!this.pairs.length || this.numClicked >= MAX_NUM_TO_CLICK) {
    return;
  }
  var pair = this.pairs.pop();
  var el = pair.el;
  el.style.backgroundColor = '#007700';
  el.click();
  this.numClicked++;
  setTimeout(this.click.bind(this), MILLIS_BETWEEN_CLICKS);
};

function main() {
  // Find pairs of elements and scores so we can sort by score.
  var elsAndScores = [];
  var els = document.getElementsByClassName('icon-thumbs-up notacted');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var span = el.parentNode.getElementsByTagName('span')[0];
    var score = 0;
    if (span) {
      try {
	score = parseInt(span.textContent);
      } catch (e) {
	console.log(e);
      }
    }
    elsAndScores.push({'el': el, 'score': score});
  }
  
  // Sort by score ascending, so we can pull from the back.
  var sortedElsAndScores = elsAndScores.concat([]);
  sortedElsAndScores.sort(function (a, b) {
    return a.score - b.score;
  });

  // Click to top 5.
  var clicker = new Clicker(sortedElsAndScores);
  clicker.click();
}

main();
