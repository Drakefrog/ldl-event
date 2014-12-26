
var app = {
  slides: [],
  mainEl: document.getElementById('main'),
  bootstrap: function() {
    this.ss = new SlideShow(this.mainEl, this.slides);
  }
};
