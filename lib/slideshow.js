(function(global) {

  // TODO: remove dependcy on velocity
  var Velocity = window.$.Velocity,
      noop = function() {};

  function animate(el, endState, options) {
    return Velocity(el, endState, options);
  }

  // https://remysharp.com/2010/07/21/throttling-function-calls
  function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
      var context = scope || this;

      var now = +new Date,
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  function Slide(aOptions) {
    var options = aOptions || {},
        domEl = options.domEl,
        shouldCreate = typeof options.shouldCreate === 'function' ? options.shouldCreate : function() { return true; },
        onCreate = typeof options.onCreate === 'function' ? options.onCreate : noop,
        onEnter = typeof options.onEnter === 'function' ? options.onEnter : noop,
        onExit = typeof options.onExit === 'function' ? options.onExit : noop,
        context = options.context;

    if (!domEl)
      throw new Error('Can not initialize Slide without provide DOM element!');

    this.domEl = typeof domEl === 'string' ? document.getElementById(domEl) : domEl;
    this.context = context;
    this.onEnter = onEnter.bind(this);
    this.onExit = onExit.bind(this);
    this.onCreate = onCreate.bind(this);
    this.shouldCreate = shouldCreate.bind(this);
  }

  function SlideShow(aContainer, aSlides) {
    var scope = this,
        container = aContainer || document.body,
        slides = Array.isArray(aSlides) ? aSlides : [],
        currentSlide = 0,
        lastSlide = slides.length - 1,

        // For dragging controls:
        blockUserInteraction = false,
        _onMouseMove = throttle(onMouseMove, SlideShow.MOVE_EVENTS_INTERVAL_THRESHOLD),
        _onTouchMove = throttle(onTouchMove, SlideShow.MOVE_EVENTS_INTERVAL_THRESHOLD),
        startFingerX = -1,
        startFingerY = -1,
        startContainerTop = 0,
        dy = 0;

    scope.arrowW = 30;

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseout', onMouseOut);

    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('touchcancel', onTouchCancel);

    function resetState() {
      startFingerX = -1;
      startFingerY = -1;
      startContainerTop = 0;
      dy = 0;
    }

    function getSlideHeight() {
      return container.clientHeight;
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

      if (pct >= SlideShow.START_SCROLL_THRESHOLD) n = 1;
      else if (pct <= -SlideShow.START_SCROLL_THRESHOLD) n = -1;
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
      console.log(ev);
      ev.preventDefault();
      if (blockUserInteraction) return;

      startFingerX = ev.clientX;
      startFingerY = ev.clientY;
      startContainerTop = getContainerTop();
      console.log("startContainerTop = ", startContainerTop);
      container.addEventListener('mousemove', _onMouseMove);
      ev.stopPropagation();
    }

    function onMouseMove(ev) {
      ev.preventDefault();
      if (blockUserInteraction) return;

      dy = ev.clientY - startFingerY;
      setContainerTop(startContainerTop + dy);
      ev.stopPropagation();
    }

    function onMouseOut(ev) {
      ev.preventDefault();
      if (blockUserInteraction) return;

      container.removeEventListener('mousemove', _onMouseMove);
      var prevSlide = currentSlide,
          slideIndexShouldBe = getSlideIndexShouldBe(currentSlide, dy);
      gotoSlide(slideIndexShouldBe);
      resetState();
      ev.stopPropagation();
    }

    function gotoSlide(targetSlide, aOptions) {
      var prevSlide = currentSlide,
          targetTop = getTargetContainerTopForSlide(targetSlide),
          options = aOptions || {},
          shouldAnimate = options.animate === false ? false : true;

      blockUserInteraction = true;
      if (currentSlide === targetSlide) {
        animate(container, {
          top: targetTop
        }, {
          complete: function() {
            blockUserInteraction = false;
          }
        });
        return;
      }

      currentSlide = targetSlide;

      if (shouldAnimate) {
        animate(container, {
          top: targetTop
        }, {
          complete: function() {
            exitSlide(prevSlide);
            enterSlide(currentSlide);
            blockUserInteraction = false;
          }
        });
      } else {
        setContainerTop(targetTop);
        exitSlide(prevSlide);
        enterSlide(currentSlide);
        blockUserInteraction = false;
      }
    }

    function gotoNextSlide() {
      if (currentSlide < lastSlide) {
        gotoSlide(currentSlide + 1);
      }
    }

    function gotoPrevSlide() {
      if (currentSlide > 0) {
        gotoSlide(currentSlide - 1);
      }
    }

    function onMouseUp(ev) {
       if (ev.target.__onclick) {
        ev.target.__onclick(ev);
        return;
      }

      ev.preventDefault();
      if (blockUserInteraction) return;

      container.removeEventListener('mousemove', _onMouseMove);

      var prevSlide = currentSlide,
          slideIndexShouldBe = getSlideIndexShouldBe(currentSlide, dy);
      gotoSlide(slideIndexShouldBe);
      resetState();

      ev.stopPropagation();
    }

    function onTouchStart(ev) {
      // console.log(ev);
      ev.preventDefault();
      if (blockUserInteraction) return;

      startFingerX = ev.touches[0].clientX;
      startFingerY = ev.touches[0].clientY;
      startContainerTop = getContainerTop();
      container.addEventListener('touchmove', _onTouchMove);
      ev.stopPropagation();
    }

    function onTouchMove(ev) {
      ev.preventDefault();
      if (blockUserInteraction) return;

      dy = ev.touches[0].clientY - startFingerY;
      setContainerTop(startContainerTop + dy);
      ev.stopPropagation();
    }

    function onTouchEnd(ev) {
      // FIXME: a hack to work around the handler blocks all click events
      if (ev.target.__onclick) {
        ev.target.__onclick(ev);
        return;
      }

      ev.preventDefault();
      if (blockUserInteraction) return;

      container.removeEventListener('touchmove', _onTouchMove);

      var prevSlide = currentSlide,
          slideIndexShouldBe = getSlideIndexShouldBe(currentSlide, dy);
      gotoSlide(slideIndexShouldBe);
      resetState();
      ev.stopPropagation();
    }

    function onTouchCancel(ev) {
      ev.preventDefault();
      if (blockUserInteraction) return;

      container.removeEventListener('touchmove', _onTouchMove);

      var prevSlide = currentSlide,
          slideIndexShouldBe = getSlideIndexShouldBe(currentSlide, dy);
      gotoSlide(slideIndexShouldBe);
      resetState();

      ev.stopPropagation();
    }

    function enterSlide(idx) {
      var slide = slides[idx];
      if (slide && slide.onEnter) slide.onEnter();
    }

    function exitSlide(idx) {
      var slide = slides[idx];
      if (slide && slide.onExit) slide.onExit();
    }

    function start() {
      enterSlide(currentSlide);
    }

    function unblockUserInteraction() {
      blockUserInteraction = false;
    }

    function getContainerWidth() {
      return container.getBoundingClientRect().width;
    }

    function getContainerHeight() {
      return container.getBoundingClientRect().height;
    }

    var arrowButton = null;

    function hideArrowButton() {
      if (arrowButton) arrowButton.style.display = 'none';
    }

    function showArrowButton() {
      if (!arrowButton) createArrowButton();

      var div = arrowButton,
          w = getContainerWidth(),
          h = getContainerHeight(),
          arrowW = scope.arrowW,
          arrowTop = (h*0.75 + h*currentSlide) + 'px';

      div.style.top = arrowTop;
      div.style.left = (0.5 * w - 0.5 * arrowW) + 'px';

      arrowButton.style.display = '';
    }

    function createArrowButton() {
      var div = document.createElement('div'),
          img = document.createElement('img'),
          w = getContainerWidth(),
          h = getContainerHeight(),
          arrowW = scope.arrowW;

      div.style.width = arrowW + 'px';
      div.style.height = arrowW/72*102 + 'px';
      div.style.display = 'none';
      div.className = 'ss-down-arrow-container';

      img.src = 'lib/ss-arrow.png';
      img.className = 'ss-down-arrow';
      img.__onclick = gotoNextSlide;

      div.appendChild(img);
      container.appendChild(div);

      arrowButton = div;
    }

    function init() {
      slides.forEach(function(s) {
        s.ss = scope;
      });
      // slides = slides.filter(function(s) {
      //   return s.shouldCreate();
      // });

      // slides.forEach(function(slide) {
      //   slide.onCreate();
      // });
    }

    init();

    scope.start = start;
    scope.slides = slides;
    scope.gotoSlide = gotoSlide;
    scope.unblockUserInteraction = unblockUserInteraction;
    scope.showArrowButton = showArrowButton;
    return scope;
  }

  SlideShow.START_SCROLL_THRESHOLD = 0.05;
  SlideShow.MOVE_EVENTS_INTERVAL_THRESHOLD = 20;

  global.Slide = Slide;
  global.SlideShow = SlideShow;

})(window);
