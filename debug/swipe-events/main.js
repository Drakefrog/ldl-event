var slides = ['slide-0', 'slide-1', 'slide-2']
      .map(function(id) {
        return new Slide({ domEl: id });
      }),
    mainEl = document.getElementById('main'),
    ss = new SlideShow(mainEl, slides);

ss.start();
