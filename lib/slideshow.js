(function(global) {

  // TODO: don't want Hammer and jQuery eventually.
  var Hammer = window.Hammer,
      $ = window.jQuery,
      noop = function() {};

  function Slide(aOptions) {
    var options = aOptions || {},
        domEl = options.domEl,
        onCreate = typeof options.onCreate === 'function' ? options.onCreate : noop,
        onEnter = typeof options.onEnter === 'function' ? options.onEnter : noop,
        onFrame = typeof options.onFrame === 'function' ? options.onFrame : noop,
        onExit = typeof options.onExit === 'function' ? options.onExit : noop,
        context = options.context;

    if (!domEl)
      throw new Error('Can not initialize Slide without provide DOM element!');

    this.domEl = typeof domEl === 'string' ? document.getElementById(domEl) : domEl;
    this.context = context;
    this.onEnter = onEnter.bind(this);
    this.onFrame = onFrame.bind(this);
    this.onExit = onExit.bind(this);

    this._animationStartTime = -1;
    this._animationId = null;

    onCreate.call(this);
  }

  Slide.prototype.startAnimation = function() {
    function animate() {
      var dt = Date.now() - this._animationStartTime;
      this.onFrame(dt);
      this._animationId = requestAnimationFrame(animate.bind(this));
    };

    this._animationStartTime = Date.now();
    animate.call(this);
  };

  Slide.prototype.stopAnimation = function() {
    if (this._animationId) cancelAnimationFrame(this._animationId);
  };

  Slide.prototype.isAnimating = function() {
    return !(this._animation === noop);
  }

  function SlideShow(aContainer, aSlides) {
    var scope = this,
        container = aContainer || document.body,
        mc = new Hammer(container),
        slides = Array.isArray(aSlides) ? aSlides : [],
        currentSlide = 0,
        lastSlide = slides.length - 1;

    // FIXME: something is wrong on android brower.
    // When user swipe up/down, the address bar hide/show,
    // which make height no longer correct.
    mc.get('swipe').set({
      direction: Hammer.DIRECTION_ALL,
      velocity: 0.20
    });

    mc.on("pan", function(ev) {
      console.log('pan', ev);
      ev.preventDefault();
    });

    mc.on("swipeup", function(ev) {
      console.log('up', ev);
      ev.preventDefault();
      showNextSlide();
    });

    mc.on("swipedown", function(ev) {
      console.log('down', ev);
      ev.preventDefault();
      showPrevSlide();
    });

    function clearAnimations() {
      slides.forEach(function(s) { s.stopAnimation(); });
    }

    function animateSlide(idx) {
      var slide = slides[idx];
      if (!slide) return;
      slide.startAnimation();
    }

    function enterSlide(idx) {
      var slide = slides[idx];
      if (slide && slide.onEnter) slide.onEnter();
    }

    function exitSlide(idx) {
      var slide = slides[idx];
      if (slide && slide.onExit) slide.onExit();
    }

    function showNextSlide() {
      if (currentSlide >= lastSlide) return;

      var prevSlide = currentSlide,
          $container = $('.ss-container');

      currentSlide += 1;
      clearAnimations();
      exitSlide(prevSlide);

      $container.animate({
        top: '-=' + $container.height()
      }, {
        complete: function() {
          enterSlide(currentSlide);
          animateSlide(currentSlide);
        }
      });
    }

    function showPrevSlide() {
      if (currentSlide <= 0) return;

      var prevSlide = currentSlide,
          $container = $('.ss-container');

      currentSlide -= 1;
      clearAnimations();
      exitSlide(prevSlide);

      $container.animate({
        top: '+=' + $container.height()
      }, {
        complete: function() {
          enterSlide(currentSlide);
          animateSlide(currentSlide);
        }
      });
    }

    function showSlideAt(idx) {

    }

    function start() {
      clearAnimations();
      animateSlide(currentSlide);
    }

    scope.mc = mc;
    scope.showPrevSlide = showPrevSlide;
    scope.showNextSlide = showNextSlide;
    scope.showSlideAt = showSlideAt;
    scope.start = start;
    return scope;
  }


  global.Slide = Slide;
  global.SlideShow = SlideShow;

})(window);
