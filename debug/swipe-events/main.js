var slides = ['slide-0', 'slide-1', 'slide-2'].map(function(id) {
  return new Slide(id);
}),
    ss = new SlideShow(document.body, slides);

ss.start();
