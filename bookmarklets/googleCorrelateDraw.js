/**
 * Plots functions over a domain of 2*PI on
 * http://www.google.com/trends/correlate/draw.
 *
 * More here:
 *
 *  http://www.jeffpalm.com/blog/archives/002216.html
 */
(function() {

  /* 
   * Translation coordinates for the canvas used for the graph --
   * found by inspection.  They work for me, god knows if they'll work
   * for anyone else?
   *
   *  (MIN_X,MAX_VALUE)             (MAX_X,MAX_VALUE)
   *  ^ 
   *  |
   *  (MIN_X,MIN_VALUE) ----------> (MAX_X,MIN_VALUE)
   *
   */
  const MIN_VALUE = 0, MAX_VALUE = 250, MIN_X = 34, MAX_X = 600;

  function plot(f) {
    var period = 2*Math.PI;
    var steps = 30;
    for (var step=0; step<=steps; step++) {
      var x = step/period;
      var value = eval(f.replace(/y/g,x));
      //
      // Translate to the canvas coords:
      //  - tranlate x and scale
      //  - invert and reflect the y value with the origin down the middle
      //
      var canvasx = MIN_X + (MAX_X-MIN_X)*(1.0*step/steps);
      var canvasy = -(value*((MAX_VALUE-MIN_VALUE)/2) - 
		      ((MAX_VALUE-MIN_VALUE)/2));
      setPoint2(canvasx,canvasy,g);
    }
  }
  
  /**
   * Just like the setPoint(event,g,context) function in original
   * draw.js, except we don't use the context, which is ignored, and
   * just pass in canvasx and canvasy, which are easier to manage than
   * creating an event, etc. Seems to work?
   */
  function setPoint2(canvasx, canvasy, g) {
    var xy = g.toDataCoords(canvasx, canvasy);
    var x = xy[0], value = xy[1];
    var rows = g.numRows(); 
    var closest_row = -1;
    var smallest_diff = -1;
    for (var row = 0; row < rows; row++) {
      var date = g.getValue(row, 0);  // millis
      var diff = Math.abs(date - x);
      if (smallest_diff < 0 || diff < smallest_diff) {
        smallest_diff = diff;
        closest_row = row;
      }
    }
    
    if (closest_row != -1) {
      if (lastDrawRow === null) {
        lastDrawRow = closest_row;
        lastDrawValue = value;
      }
      // If the mouse moves quickly from point A to point B, we won't get events
      // for the intervening x-values. We use a linear interpolation to create
      // the impression of smooth drawing.
      var coeff = (value - lastDrawValue) / (closest_row - lastDrawRow);
      if (closest_row == lastDrawRow) coeff = 0.0;
      var minRow = Math.min(lastDrawRow, closest_row);
      var maxRow = Math.max(lastDrawRow, closest_row);
      for (var row = minRow; row <= maxRow; row++) {
        var val = lastDrawValue + coeff * (row - lastDrawRow);
        val = Math.max(valueRange[0], Math.min(val, valueRange[1]));
        if (val != null && !isNaN(val)) {
          data[row][1] = val;
        }
      }
      lastDrawRow = closest_row;
      lastDrawValue = value;
      g.updateOptions({ file: data });  // this redraws the chart
      g.setSelection(closest_row);  // prevents the dot from being finnicky.
    }
  }

  function main() {
    var f = prompt('Enter a function f(y) -- e.g. Math.sin(y):');
    plot(f);
  }

  main();
  
})();