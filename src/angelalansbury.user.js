// ==UserScript==
// @name          Angela Lansbury + Google+
// @namespace     http://jeffpalm.com/goldengirls+/
// @description   Changes anonymous images to Golden Girls images
// @include       http://plus.google.com*
// @include       https://plus.google.com*
// ==/UserScript==

(function() {

  const IMG_SRC = 'http://i.imgur.com/fYBgs.png';
  const PERIOD = 5000;
  
  var lastMaxY = 0;

  function isStandInProfileImage(img) {
    return !!img 
      &&   !!img.src
      &&     img.src.match(/googleusercontent.com.*AAAAAAAAAAI\/AAAAAAAAAAA/);
  }

  function checkImages() {
    var curMaxY = document.height;
    console.log('checkImages curMaxY=' + curMaxY + ' lastMaxY=' + lastMaxY);
    console.log('document=' + document.height);
    if (curMaxY > lastMaxY) {
      changeImages();
      lastMaxY = curMaxY;
    }
  }

  function changeImages() {
    console.log('changeImages');
    var imgs = document.getElementsByTagName('img');
    if (!imgs) return;
    for (var i in imgs) {
      var img = imgs[i];
      if (isStandInProfileImage(img)) {
	continue;
	console.log(img.src);
	var res;
	if (res = img.src.match(/sz=(\d+)/)) {
	  var size = res[1];
	  if (!size) return;
	  img.src = IMG_SRC;
	  img.style.width = size + 'px';
	  img.style.height = size + 'px';
	}
      }
    }
  }

  function main() {
    checkImages();
    setInterval(checkImages,PERIOD);
  }
  
  main();

})();