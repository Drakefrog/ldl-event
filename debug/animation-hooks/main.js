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
          enterFn = function() {
            var h2 = document.createElement('h2'),
                components = ['backgroundColorRed', 'backgroundColorGreen', 'backgroundColorBlue'],
                startState = {},
                endState = {},
                later = function() {
                  this.domEl.removeChild(h2);
                };

            h2.textContent = 'entered slide ' + i;
            this.domEl.appendChild(h2);
            setTimeout(later.bind(this), 2000);

            startState[components[i]] = 255;
            endState[components[i]] = 100;
            $(this.domEl)
              .velocity(startState, { duration: 0 })
              .velocity(endState, { duration: 2000, loop: true });
          },
          exitFn = function() {
            var comps = colorComponents.slice(),
                bgColor;

            comps[i] = 255;
            bgColor = rgbToHex.apply(null, comps);

            $(this.domEl)
              .velocity('stop', true)
              .css('backgroundColor', bgColor);
          };

      return new Slide({
        domEl: id,
        onCreate: createFn,
        onEnter: enterFn,
        onExit: exitFn
      });

    }),
    ss = new SlideShow(document.getElementById('main'), slides);

ss.start();
