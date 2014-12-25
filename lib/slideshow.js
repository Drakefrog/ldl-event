(function(global) {

  // TODO: don't want Hammer and jQuery eventually.
  var Hammer = window.Hammer,
      $ = window.jQuery,
      noop = function() {};

  function Slide(domEl, animateFn, context) {
    this.domEl = typeof domEl === 'string' ? document.getElementById(domEl) : domEl;
    this.animateFn = animateFn;
    this.context = context;
    this._animation = noop;
  }

  Slide.prototype.startAnimation = function() {
    var animation = function() {
      var dt = Date.now() - this._animationStartTime;
      this.animateFn(dt);
      requestAnimationFrame(this._animation);
    };

    this._animationStartTime = Date.now();
    this._animation = animation.bind(this);
    this._animation();
  };

  Slide.prototype.stopAnimation = function() {
    this._animation = noop;
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

    function animateSlideAt(idx) {
      var slide = slides[idx];
      if (!slide) return;
      slide.startAnimation();
    }

    function showNextSlide() {
      if (currentSlide >= lastSlide) return;

      currentSlide += 1;
      $('.ss-slider').animate({
        top: '-=100%'
      }, {
        complete: function() {
          clearAnimations();
          animateSlideAt(currentSlide);
        }
      });
    }

    function showPrevSlide() {
      if (currentSlide <= 0) return;
      currentSlide -= 1;
      $('.ss-slider').animate({
        top: '+=100%'
      }, {
        complete: function() {
          clearAnimations();
          animateSlideAt(currentSlide);
        }
      });
    }

    function showSlideAt(idx) {

    }

    function start() {
      clearAnimations();
      animateSlideAt(currentSlide);
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
