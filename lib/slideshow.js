(function(global) {

  var Hammer = window.Hammer,
      $ = window.jQuery;

  function SlideShow() {
    var scope = this,
        mc = new Hammer(document.body),
        currentPage = 0,
        lastPage = 2;

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
      showNextPage();
    });

    mc.on("swipedown", function(ev) {
      console.log('down', ev);
      ev.preventDefault();
      showPrevPage();
    });

    function showNextPage() {
      if (currentPage >= lastPage) return;

      currentPage += 1;
      $('.ss-slider').animate({ top: '-=100%' });
    }

    function showPrevPage() {
      if (currentPage <= 0) return;
      currentPage -= 1;
      $('.ss-slider').animate({ top: '+=100%' });
    }

    scope.mc = mc;
    scope.showPrevPage = showPrevPage;
    scope.showNextPage = showNextPage;

    return scope;
  }

  global.SlideShow = SlideShow;

})(window);
