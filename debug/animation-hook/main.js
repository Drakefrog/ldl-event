var T = 10000,
    updateColorComponent = (function() {
      var w = 2*Math.PI/T;
      return function(t) {
        var zeroToOne = 0.5*(1+Math.cos(2*w*t));
        return Math.floor(100 + (256-100)*zeroToOne);
      };
    })(),
    slides = [
      new Slide('slide-0', function(t) {
        this.domEl.style.backgroundColor = rgbToHex(updateColorComponent(t), 0, 0);
      }),
      new Slide('slide-1', function(t) {
        this.domEl.style.backgroundColor = rgbToHex(0, updateColorComponent(t), 0);
      }),
      new Slide('slide-2', function(t) {
        this.domEl.style.backgroundColor = rgbToHex(0, 0, updateColorComponent(t));
      })
    ],
    ss = new SlideShow(document.body, slides);

ss.start();
