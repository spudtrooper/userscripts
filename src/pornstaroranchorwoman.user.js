// ==UserScript== 
// @name Answers in the tool tips
// @description Gives you the answer in tool tips
// @namespace http://jeffpalm.com/pornstaroranchorwoman
// @include http://pornstaroranchorwoman.tumblr.com/*
// @include http://www.pornstaroranchorwoman.tumblr.com/*
// ==/UserScript==

(function() {

  const ANCHORWOMAN_IMG = "http://i.imgur.com/w7mIa.png";
  const PORN_STAR_IMG = "http://i.imgur.com/MOZ0h.png";
  const FAMILY_MATTERS_CHICK = "http://30.media.tumblr.com/tumblr_lmyyz2spwV1qlw0dbo1_500.jpg";

  function main() {
    var imgs = document.getElementsByTagName("img");
    for (var i in imgs) {
      var img = imgs[i];
      var par = img;
      while (par && par.nodeName != "DIV") {
	par = par.parentNode;
      }
      var div = par;
      if (!div) continue;
      var as = div.getElementsByTagName("A");
      if (as.length < 1) continue;
      var a = as[as.length-1];
      var alt = a.href == ANCHORWOMAN_IMG ? "Anchorwoman" : "Porn Star";
      img.alt = alt;
      img.title = alt;
    }
  }

  main();
})();