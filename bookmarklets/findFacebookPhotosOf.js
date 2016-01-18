(function() {
  /**
   * Find photos of a person on facebook.
   */
  
  /*
javascript:!function(){function n(n){var o=document.body.innerHTML,t=o.match(n);return t?t[1]:null}function o(){return n(/data-profileid="(\d+)"/)||n(/data-uid="(\d+)"/)}function t(){var n=o();if(!n)return void alert("Could not find an id");var t="http://facebook.com/search/"+n+"/photos-of";document.location=t}function i(){t()}i()}();
   */

  function tryRegex(regex) {
    var str = document.body.innerHTML;
    var match = str.match(regex);
    return match ? match[1] : null;
  }

  function findId() {
    return tryRegex(/data-profileid="(\d+)"/)
      || tryRegex(/data-uid="(\d+)"/);
  }

  function findPhotos() {
    var id = findId();
    if (!id) {
      alert('Could not find an id');
      return;
    }
    var url = 'http://facebook.com/search/' + id + '/photos-of';
    document.location = url;
  }

  function main() {
    findPhotos();
  }

  main();
})();
