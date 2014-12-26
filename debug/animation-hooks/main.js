var T = 10000,
    updateColorComponent = (function() {
      var w = 2*Math.PI/T;
      return function(t) {
        var zeroToOne = 0.5*(1+Math.cos(2*w*t));
        return Math.floor(100 + (256-100)*zeroToOne);
      };
    })(),
    slides = [0, 1, 2].map(function(i) {
      var id = 'slide-' + i,
          colorComponents = [0, 0, 0],
          createFn = function() {
            var h1 = document.createElement('h1');
            h1.textContent = '' + i;
            this.domEl.appendChild(h1);
          },
          frameFn = function(t) {
            var comps = colorComponents.slice();
            comps[i] = updateColorComponent(t);
            this.domEl.style.backgroundColor = rgbToHex.apply(null, comps);
          },
          enterFn = function() {
            var h2 = document.createElement('h2'),
                later = function() {
                  this.domEl.removeChild(h2);
                };

            h2.textContent = 'entered slide ' + i;
            this.domEl.appendChild(h2);
            setTimeout(later.bind(this), 2000);
          },
          exitFn = function() {
            var comps = colorComponents.slice();
            comps[i] = 255;
            this.domEl.style.backgroundColor = rgbToHex.apply(null, comps);
          };

      return new Slide({
        domEl: id,
        onCreate: createFn,
        onEnter: enterFn,
        onExit: exitFn,
        onFrame: frameFn
      });

    }),
    ss = new SlideShow(document.getElementById('main'), slides);

ss.start();
