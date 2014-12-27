
var app = {
  $: window.$,
  slidesByName: {},
  mainEl: document.getElementById('main'),
  addSlide: function(name, aOptions) {
    var options = aOptions || {},
        context,
        slide;

    // Apply config
    context = this.config && this.config[name] || {};
    if (aOptions && aOptions.context) {
      Object.keys(aOptions.context).forEach(function(k) {
        context[k] = aOptions.context[k];
      });
    }
    options.context = context;

    options.domEl = name;
    slide = new Slide(options);

    this.slidesByName[name] = slide;

    return slide;
  },
  bootstrap: function() {
    var slidesByName = this.slidesByName,
        slides = Object.keys(slidesByName).map(function(name) {
          return slidesByName[name];
        });

    slides.sort(function(a, b) {
      return a.context.index - b.context.index;
    });

    this.ss = new SlideShow(this.mainEl, slides);
    this.ss.start();
  }
};
