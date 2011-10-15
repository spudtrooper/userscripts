(function() {
  var html = String(document.body.innerHTML);
  var res = html.match(/GLatLng\s*\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)/);
  if (res) {
    var lat = res[1], lng = res[2];
    var title = document.getElementsByTagName('h1')[0].innerHTML;
    var link = 'http://maps.google.com/maps?q=' 
      + escape(title) + '@' + lat + ',' + lng;
    window.open(link,'_');
  } else {
    alert('Bad monkey');
  }
})();