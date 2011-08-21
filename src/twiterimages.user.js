// ==UserScript==
// @name          Twitter Images
// @namespace     http://jeffpalm.com/twitterimages
// @description   Easily upload twitter images
// @include       https://twitter.com/*
// ==/UserScript==

(function() {

  function onDrop(event) {
    var data = event.dataTransfer.getData('text/plain');
    event.preventDefault();
    alert('files: ' + event.dataTransfer.files + ' && data: ' + data + '.');
  }

  function main() {
    window.addEventListener('drop',onDrop,true);
  }

  main();
  
})();