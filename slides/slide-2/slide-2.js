(function(app) {
  var $ = app.$,
      d3 = app.d3,
      config = app.config['slide-2'],
      basePath = config.basePath,
      initImageElement = app.initImageElement,
      chain = app.chain,
      makeFadeIn = app.makeFadeIn,
      fadeInText = app.fadeInText,

      earthCenter = [460, 470],
      earthRadius = 300,

      posOnEarth = function(theta) {
        var cx = earthCenter[0], cy = earthCenter[1];
        var r = earthRadius, t = theta/180*Math.PI;
        return [cx + r*Math.cos(t), cy + r*Math.sin(t)];
      },

      imageData = [
        {
          url: basePath + '/earth-900-900.png',
          translate: [450, 450],
          opacity: 0.0,
          scale: 1,
          rotate: 0
        },
        {
          url: basePath + '/girl-114-192.png',
          // translate: [config.girlStartX, config.girlStartY],
          translate: posOnEarth(config.startTheta),
          scale: 0.0,
          rotate: 0
        },
        {
          url: basePath + '/superman-156-150.png',
          translate: posOnEarth(config.startTheta),
          // translate: [1500, config.supermanStartY],
          // translate: [config.supermanStartX, config.supermanStartY],
          scale: 0.0,
          rotate: 0
        },
      ];
  // compile = app.compile,
  // template = compile($('#slide-2-template').html());

  function formatFirstDay(d) {
    var arr = d.trim().split('-');
    return arr[0] + '年' + arr[1] + '月' + arr[2] + '日';
  }

  app.addSlide('slide-2', {
    shouldCreate: function() {
      return this.context &&
        this.context.userData &&
        this.context.userData.firstday_running_steps &&
        this.context.userData.firstday_running_steps > 0;
    },
    onCreate: function() {
      var basePath = this.context.basePath,
          userData = this.context.userData;

      d3.select('#slide-2-images')
        .selectAll('g')
        .data(imageData)
        .enter()
        .append('g')
        .attr('transform', function(d) {
          return [
            'translate(' + d.translate + ')',
            'scale(' + d.scale + ')',
            // 'rotate(' + d.rotate + ')',
          ].join(' ');
        })
        .attr('opacity', function(d) {
          if (typeof d.opacity !== 'undefined') { return d.opacity; }
          return 1.0;
        })
        .append('image')
        .each(function(d) {
          initImageElement(this, d.url, 'slide-2-');
        });

      d3.select('#slide-2-firstday')
        .text(formatFirstDay(userData.firstday));

      d3.select('#slide-2-firstday-running')
        .text(' ' + userData.firstday_running_steps + ' ');
    },

    onEnter: function() {
      var ctx = {},
          ss = this.ss;
      ctx.textEl = this.context.textEl || '#slide-2-text';
      ctx.textAnimationDuration = parseInt(this.context.textAnimationDuration) || 1000;

      chain(ctx, [
        animateEarth,
        animateText,
        animateGirl,
        animateSuperman
      ], function(err) {
        ss.showArrowButton();
      });
      return;
    },
    onExit: function() {

    }
  });

  function animateText(ctx, done) {
    fadeInText(ctx.textEl, ctx.textAnimationDuration, function() {
      done();
    });
  }

  function animateEarth(ctx, done) {
    var duration = ctx.earthAnimationDuration || 500;
    d3.select('#slide-2-earth')
      .each(function() {
        d3.select(this.parentNode)
          .transition()
          .duration(duration)
          .attr('opacity', 1.0)
          .each('end', function() {
            done();
          });
      });
  }

  function animateGirl(ctx, done) {
    var duration = ctx.runnerAnimationDuration || 500;
    d3.select('#slide-2-girl')
      .each(function() {
        d3.select(this.parentNode)
          .transition()
          .duration(duration)
          .ease(d3.ease('elastic', 1.0, 0.80))
          .attrTween('transform', function() {
            var t0 = config.startTheta, t1 = config.endGirlTheta;
            var diff = t1 - t0;

            return function(t) {
              var theta = t0 + t*diff;
              var pos = posOnEarth(theta);
              return [
                'translate(' + pos + ')',
                'scale(' + t + ')'
              ].join(' ');
            };
          })
          .each('end', function() {
            done();
          });
      });
  }

  function animateSuperman(ctx, done) {
    var duration = ctx.runnerAnimationDuration || 500;
    d3.select('#slide-2-superman')
      .each(function() {
        d3.select(this.parentNode)
          .transition()
          .duration(duration)
          .ease(d3.ease('elastic', 1.0, 0.80))
          .attrTween('transform', function() {
            var t0 = config.startTheta, t1 = config.endSupermanTheta;
            var diff = t1 - t0;

            return function(t) {
              var theta = t0 + t*diff;
              var pos = posOnEarth(theta);
              return [
                'translate(' + pos + ')',
                'scale(' + t + ')'
              ].join(' ');
            };
          })
          .each('end', function() {
            done();
          });
      });
  }
})(app);
