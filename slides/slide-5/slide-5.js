(function(app) {
  var compile = app.compile,
      $ = app.$,
      d3 = app.d3;
      // text1Template = compile($('#slide-5-template-text-1').html()),
      // rankCircleTemplate = compile($('#slide-5-template-rank-circle').html());

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


  function animateRankCircle(el, x, y, destScale, delay, duration) {
    d3.select(el)
      .transition()
      .delay(delay)
      .duration(duration)
      .attr('transform', 'translate(' + [x,y] + ') scale(' + destScale + ')');

    // $el
    //   .velocity({
    //     translateX: x,
    //     translateY: y,
    //     scale: 0.0
    //   }, {
    //     delay: delay,
    //     duration: 0
    //   })
    //   .velocity({
    //     scale: destScale
    //   }, {
    //     duration: duration
    //   });

    return {
      stop: function() {
        // $el.velocity('stop', true);
        // $el[0].scale = 0.0;
        // $el[0].translateX = x;
        // $el[0].translateY = y;
      }
    };
  }

  function callMe(pct, sex) {

    var iPct = parseInt(pct, 10);

    if (sex === 'female') {
      if (iPct <= 40) {
        return "运动白富美";
      } else if (iPct > 40 && iPct <= 70) {
        return "运动女神";
      } else {
        return "运动界的范爷";
      }
    } else {
      if (iPct <= 40) {
        return "运动高富帅";
      } else if (iPct > 40 && iPct <= 70) {
        return "运动男神";
      } else {
        return "运动钢铁侠";
      }
    }
  }

  app.addSlide('slide-5', {
    onCreate: function() {
      var pct = this.context.userData.better_than_pct,
          sex = this.context.userData.sex || 'male',
          shareUrl = 'http://ledongli.cn/';

      this.totalStepTextEl = $('#slide-5-total-steps')[0];
      this.avgStepTextEl = $('#slide-5-avg-steps')[0];

      this.$clipRect = $('#slide-5-bright-map-clip rect');

      this.$rankCircle = $('#slide-5-rank-circle');

      d3.select('#slide-5-better-than-pct')
        .text(pct);

      d3.select('#slide-5-call-me')
        .text(callMe(pct, sex));

      d3.select('#slide-5-share-btn text')
        .on('click', function() {
          var win = window.open(shareUrl, '_blank');
          win.focus();
        });

      this.animationHandles = [];
    },
    onEnter: function() {
      var stepAccDuration = this.context.stepsAccumulateAnimationDuration || 2000,
          rankCircleDuration = this.context.rankCircleAnimationDuration || 200,
          destWidth = 800,
          totalSteps = this.context.userData.accumulativesteps,
          avgSteps = this.context.userData.averagesteps;

      this.animationHandles.push(animateTextNumber(this.totalStepTextEl, totalSteps, stepAccDuration));
      this.animationHandles.push(animateTextNumber(this.avgStepTextEl, avgSteps, stepAccDuration));
      this.animationHandles.push(animateRectWidth(this.$clipRect, destWidth, stepAccDuration));
      this.animationHandles.push(animateRankCircle(
        this.$rankCircle[0],
        this.context.circleCenterX,
        this.context.circleCenterY,
        1.0,
        stepAccDuration,
        rankCircleDuration));

      d3.select('#slide-5-call-me')
        .transition()
        .duration(500)
        .delay(rankCircleDuration+stepAccDuration)
        .attr('transform', 'scale(1.0)');
    },
    onExit: function() {
      this.animationHandles.forEach(function(handle) {
        handle.stop();
      });
    }
  });
})(app);
