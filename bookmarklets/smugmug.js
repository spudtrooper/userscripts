(function() {
  /*
   * This will find the full-size image urls of a smugmug.com page.
   */
  
  const MINIMUM_IMAGE_WIDTH = 1000;

  /** Gets the url of the link to close a full-size image lightbox. */
  function getCloseLink() {
    var els = document.getElementsByTagName('a');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.innerHTML == 'Close') {
	return el.href;
      }
    }
    return null;
  }

  /** Gets the URL to display the original image for a thumbnail URL. */
  function getOriginalUrlFromThumbnailUrl(thumbnailUrl) {
    return thumbnailUrl +  '&lb=1&s=O';
  }

  /** 
   * Gets the full-size image url. This is background in the style of the
   * lightbox element. 
   */
  function getFullSizeImageUrl() {
    var el = document.getElementById('lightBoxImage');
    if (!el) {
      return null;
    }
    var style = el.style;
    var styleUrl = style.background;
    var url = styleUrl.replace(/url\(/, '').replace(/\)/, '')
    return url;
  }

  /** Gets whether the full-size image has loaded yet. */
  function isFullSizeImageLoaded() {
    var el = document.getElementById('lightBoxImage');
    return el && el.width && el.width >= MINIMUM_IMAGE_WIDTH;
  }

  /** Gets a list of thumbnail image URLs on the current page. */
  function getThumnailUrls() {
    var els = document.getElementsByTagName('a');
    var results = []
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.id && /Anchor_Tiny_\w+/.exec(el.id)) {
	results.push(el.href);
      }
    }
    return results;
  }

  /** Crawls an array of thumbnail URLs. */
  Crawler = function(urls) {
    this.urls_ = urls;
    this.queue_ = null;
    this.imageUrls_ = null;
    this.onDoneFn_ = null;
  }

  Crawler.prototype.getImageUrls = function() {
    return this.imageUrls_;
  }

  Crawler.prototype.crawl = function(onDoneFn) {
    if (this.queue_) {
      return;
    }
    this.onDoneFn_ = onDoneFn;
    this.queue_ = this.urls_.concat([]);
    this.imageUrls_ = [];
    this.loop_();
  };

  Crawler.prototype.loop_ = function() {
    if (!this.queue_.length) {
      console.log('Done');
      this.queue_ = null;
      this.onDoneFn_(this);
      return;
    }
    this.processUrl_(this.queue_.pop());
  };

  Crawler.prototype.processUrl_ = function(url) {
    var originalImageUrl = getOriginalUrlFromThumbnailUrl(url);
    document.location = originalImageUrl;
    this.waitForOriginalImageToLoad_(originalImageUrl);
  };

  Crawler.prototype.waitForOriginalImageToLoad_ = function(
    originalImageUrl) {
    var thiz = this;
    if (!isFullSizeImageLoaded()) {
      setTimeout(
	function() {thiz.waitForOriginalImageToLoad_(originalImageUrl);}, 1000);
      return;
    }
    var imageUrl = getFullSizeImageUrl();
    this.imageUrls_.push(imageUrl);
    document.location = getCloseLink();
    setTimeout(function() {thiz.loop_();}, 1000);
  };

  function showImages() {
    new Crawler(getThumnailUrls()).crawl(function(crawler) {
      alert(crawler.getImageUrls().join(' '));
    });
  }

  showImages();

})();
