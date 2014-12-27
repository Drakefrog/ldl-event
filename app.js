
var app = {
  $: window.$,
  slides: [],
  mainEl: document.getElementById('main'),
  createSlide: function(options) {
    return new Slide(options);
  },
  bootstrap: function() {
    this.ss = new SlideShow(this.mainEl, this.slides);
    this.ss.start();
  }
};
