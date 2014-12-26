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
  };

  function SlideShow(aContainer, aSlides) {
    var scope = this,
        container = aContainer || document.body,
        slides = Array.isArray(aSlides) ? aSlides : [],
        currentSlide = 0,
        lastSlide = slides.length - 1,

        // For dragging controls:
        _onMouseMove = throttle(onMouseMove, 20),
        _onTouchMove = throttle(onTouchMove, 20),
        startFingerX = -1,
        startFingerY = -1,
        startContainerTop = 0,
        dy = 0;

    // FIXME: onEnter show be called almost once

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseout', onMouseOut);

    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchCancel);

    function resetState() {
      startFingerX = -1;
      startFingerY = -1;
      startContainerTop = 0;
      dy = 0;
    }

    function getSlideHeight() {
      return $(container).height();
    }

    function setContainerTop(y) {
      container.style.top = y + 'px';
    }

    function getContainerTop() {
      return container.getBoundingClientRect().top;
    }

    function getSlideIndexShouldBe(currentSlideIndex, dy) {
      var h = getSlideHeight(),
          pct = dy/h,
          n,
          ret;

      if (pct >= 0.15) n = 1;
      else if (pct <= -0.15) n = -1;
      else n = 0;

      ret = currentSlideIndex - n;
      if (ret >= lastSlide) return lastSlide;
      if (ret <= 0) return 0;
      return ret;
    }

    function getTargetContainerTopForSlide(slideIdx) {
      var h = getSlideHeight();
      return -slideIdx * h;
    }

    function onMouseDown(ev) {
      ev.preventDefault();
      startFingerX = ev.clientX;
      startFingerY = ev.clientY;
      startContainerTop = getContainerTop();
      console.log("startContainerTop = ", startContainerTop);
      container.addEventListener('mousemove', _onMouseMove);
    }

    function onMouseMove(ev) {
      ev.preventDefault();
      dy = ev.clientY - startFingerY;
      setContainerTop(startContainerTop + dy);
    }

    function onMouseOut(ev) {
      ev.preventDefault();
      container.removeEventListener('mousemove', _onMouseMove);

      var prevSlide = currentSlide,
          slideIndexShouldBe = getSlideIndexShouldBe(currentSlide, dy);
      animateToSlide(slideIndexShouldBe);
      resetState();
    }

    function animateToSlide(targetSlide) {
      var prevSlide = currentSlide,
          targetTop = getTargetContainerTopForSlide(targetSlide),
          $container = $(container);

      if (currentSlide === targetSlide) {
        $container.animate({
          top: targetTop + 'px'
        });
        return;
      }

      currentSlide = targetSlide;


      $container.animate({
        top: targetTop + 'px'
      }, {
        complete: function() {
          clearAnimations();
          exitSlide(prevSlide);
          enterSlide(currentSlide);
          animateSlide(currentSlide);
        }
      });
    }

    function onMouseUp(ev) {
      ev.preventDefault();
      container.removeEventListener('mousemove', _onMouseMove);

      var prevSlide = currentSlide,
          slideIndexShouldBe = getSlideIndexShouldBe(currentSlide, dy);
      animateToSlide(slideIndexShouldBe);
      resetState();
    }

    function onTouchStart(ev) {
      ev.preventDefault();
      startFingerX = ev.touches[0].clientX;
      startFingerY = ev.touches[0].clientY;
      startContainerTop = getContainerTop();
      container.addEventListener('touchmove', _onTouchMove);
    }

    function onTouchMove(ev) {
      ev.preventDefault();
      dy = ev.touches[0].clientY - startFingerY;
      setContainerTop(startContainerTop + dy);
    }

    function onTouchEnd(ev) {
      ev.preventDefault();
      container.removeEventListener('touchmove', _onTouchMove);

      var prevSlide = currentSlide,
          slideIndexShouldBe = getSlideIndexShouldBe(currentSlide, dy);
      animateToSlide(slideIndexShouldBe);
      resetState();
    }

    function onTouchCancel(ev) {
      ev.preventDefault();
      container.removeEventListener('touchmove', _onTouchMove);

      var prevSlide = currentSlide,
          slideIndexShouldBe = getSlideIndexShouldBe(currentSlide, dy);
      animateToSlide(slideIndexShouldBe);
      resetState();
    }

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

    scope.showPrevSlide = showPrevSlide;
    scope.showNextSlide = showNextSlide;
    scope.showSlideAt = showSlideAt;
    scope.start = start;
    return scope;
  }


  global.Slide = Slide;
  global.SlideShow = SlideShow;

})(window);
