(function(app) {
  var compile = app.compile,
      $ = app.$,
      text1Template = compile($('#slide-5-template-text-1').html());

  function animateTextNumber(el, dest, duration) {
    var startTime = Date.now(),
        startValue = parseInt(el.textContent),
        dist = dest - startValue,
        animate = function () {
          var t = Date.now(),
              progress = (t-startTime)/duration;
          if (progress > 0.99) {
            el.textContent = '' + dest;
            stop();
          } else {
            el.textContent = '' + Math.round(startValue + progress*dist);
            requestAnimationFrame(animate);
          }
        };

    function stop() {
      animate = function() {};
    }

    animate();

    return {
      stop: stop
    };
  }

  function animateRectWidth($rect, destW, duration) {
    $rect.velocity({
      width: destW
    }, {
      duration: duration
    });

    return {
      stop: function() {
        $rect[0].width = 0;
        $rect.velocity('stop');
      }
    };
  }

  app.addSlide('slide-5', {
    onCreate: function() {
      var svg = $('svg', this.domEl)[0];
      svg.innerHTML += text1Template(this.context);

      this.totalStepTextEl = $('#slide-5-total-steps')[0];
      this.avgStepTextEl = $('#slide-5-avg-steps')[0];

      this.$clipRect = $('#slide-5-bright-map-clip rect');

      this.animationHandles = [];
    },
    onEnter: function() {
      var duration = this.context.stepsAccumulateAnimationDuration || 2000,
          destWidth = 800,
          totalSteps = this.context.userData.accumulativesteps,
          avgSteps = this.context.userData.averagesteps;

      this.animationHandles.push(animateTextNumber(this.totalStepTextEl, totalSteps, duration));
      this.animationHandles.push(animateTextNumber(this.avgStepTextEl, avgSteps, duration));
      this.animationHandles.push(animateRectWidth(this.$clipRect, destWidth, duration));
    },
    onExit: function() {
      this.animationHandles.forEach(function(handle) {
        handle.stop();
      });
    }
  });
})(app);
