
var app = {
  $: window.$,
  compile: function(source) {
    return Handlebars.compile(source);
  },
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
        }),
        urlParams = parseURL(location.href).params,
        scope = this;

    slides.sort(function(a, b) {
      return a.context.index - b.context.index;
    });

    // add user data to slides context:
    LDLAPI.getAnnualUserData(null, function(err, data) {
      if (err) {
        // TODO: handle the case can not get user data
      }

      slides.forEach(function(slide) {
        slide.context.userData = data.ret;;
      });

      scope.ss = new SlideShow(scope.mainEl, slides);
      scope.ss.start();

      if (urlParams.index) {
        scope.ss.gotoSlide(parseInt(urlParams.index), { animate: false });
      }
    });
  }
};
