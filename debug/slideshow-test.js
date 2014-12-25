var w = 2*Math.PI/10000;
var slides = [
  new Slide('slider-0', function(t) {
    this.domEl.style.backgroundColor = rgbToHex(0, 0, Math.floor(128*(1+Math.sin(2*w*t))));
  }),
  new Slide('slider-1', function(t) {
    this.domEl.style.backgroundColor = rgbToHex(0, Math.floor(128*(1+Math.sin(2*w*t))), 0);
  }),
  new Slide('slider-2', function(t) {
    this.domEl.style.backgroundColor = rgbToHex(Math.floor(128*(1+Math.sin(2*w*t))), 0, 0);
  })
],
    ss = new SlideShow(document.body, slides);


LDLAPI.getAnnualUserData(null, function(err, data) {
  if (err) {
    console.log("err = ", err);
    return;
  }

  slides.forEach(function(slide) {
    slide.context = data.ret;
  });
  ss.start();
});
