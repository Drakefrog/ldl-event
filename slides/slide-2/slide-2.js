(function(app) {
  var $ = app.$,
      d3 = app.d3,
      config = app.config['slide-2'],
      basePath = config.basePath,
      initImageElement = app.initImageElement,
      chain = app.chain,
      makeFadeIn = app.makeFadeIn,
      fadeInText = app.fadeInText,

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
          translate: [1200, config.girlStartY],
          scale: 0.5,
          rotate: 0
        },
        {
          url: basePath + '/superman-156-150.png',
          translate: [1500, config.supermanStartY],
          // translate: [config.supermanStartX, config.supermanStartY],
          scale: 0.5,
          rotate: 0
        },
      ];
      // compile = app.compile,
      // template = compile($('#slide-2-template').html());

  app.addSlide('slide-2', {
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
        .text(userData.firstday);

      d3.select('#slide-2-firstday-running')
        .text(' ' + userData.firstday_running_steps + ' ');
    },

    onEnter: function() {
      var ctx = {};
      ctx.textEl = this.context.textEl || '#slide-2-text';
      ctx.textAnimationDuration = parseInt(this.context.textAnimationDuration) || 1000;

      chain(ctx, [
        animateEarth,
        animateText,
        [ animateGirl, animateSuperman ]
      ], function(err) {

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
          .attr('transform', function() {
            return [
              'translate(' + [config.girlStartX, config.girlStartY] + ')',
              'scale(0.5)',
            ].join(' ');
          })
          .each('end', function() {
            d3.select(this)
              .transition()
              .duration(duration)
              .ease(d3.ease('elastic'))
              .attr('transform', function() {
                return [
                  'translate(' + [config.girlEndX, config.girlEndY] + ')',
                  // 'translate(' + [config.girlStartX, config.girlStartY] + ')',
                  'scale(1)',
                  // 'rotate(0)'
                ].join(' ');
              })
              .each('end', function() {
                done();
              });
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
          .attr('transform', function() {
            return [
              'translate(' + [config.supermanStartX, config.supermanStartY] + ')',
              'scale(0.5)',
            ].join(' ');
          })
          .each('end', function() {
            d3.select(this)
              .transition()
              .duration(duration)
              .ease(d3.ease('elastic'))
              .attr('transform', function() {
                return [
                  'translate(' + [config.supermanEndX, config.supermanEndY] + ')',
                  'scale(1)',
                ].join(' ');
              })
              .each('end', function() {
                done();
              });
          });
      });
  }
})(app);
