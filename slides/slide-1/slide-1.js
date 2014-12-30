(function(app) {
  var $ = app.$,
      d3 = app.d3,
      // compile = app.compile,
      // template = compile($('#slide-1-template-text').html()),
      config = app.config['slide-1'],
      basePath = app.config['slide-1'].basePath,
      w = 900,
      hfW = w/2,
      h = 1600,
      hfH = h/2,
      bgImageSize = 900,
      hfBgImageSize = bgImageSize/2,
      slideRotateCenter = { x: 0, y: h },
      slideRotateRadius = h - hfBgImageSize,
      bgData = [
        {
          id: 'slide-1-sky',
          url: basePath + '/sky-900-900.png',
          startAngle: 90,
          delay: config.subslideDelay || 1000,
          duration: config.subslideDuration || 1000
        },
        {
          id: 'slide-1-city',
          url: basePath + '/city-900-900.png',
          startAngle: 180,
          delay: config.subslideDelay || 1000,
          duration: config.subslideDuration || 1000
        },
        {
          id: 'slide-1-clouds',
          url: basePath + '/clouds-900-900.png',
          startAngle: 270,
          delay: config.subslideDelay || 1000,
          duration: config.subslideDuration || 1000
        }
      ],
      textData = [
        {
          text1: '我开始使用乐动力',
          text2: '走出了历史性的第一步！'
        },
        {
          text1Fmt: '第一次走到%d万步',
          text2: '相当于绕香港岛一圈'
        },
        {
          text1Fmt: '第一次走到%d万步',
          text2: '相当于绕香港岛一圈'
        }
      ];

  function addVectors(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  function slideLocationFromAngle(angleInDegree) {
    var t= angleInDegree/180*Math.PI,
        vec = {
          x: slideRotateRadius * Math.sin(t),
          y: -slideRotateRadius * Math.cos(t)
        };
    return addVectors(slideRotateCenter, vec);
  }


  function createSubSlide() {
    d3
      .select(this)
      .attr('id', function(d) { return d.id; })
      .attr('transform', function(d) {
        var loc = slideLocationFromAngle(d.startAngle);
        return 'translate(' + [loc.x, loc.y] + ')';
      })

      .selectAll('image')
      .data(function(d) {
        return [{url: d.url}];
      })
      .enter()
      .append('image')
      .attr('x', 0).attr('y', 0)
      .attr('width', bgImageSize)
      .attr('height', bgImageSize)
      .attr('transform', 'translate(' + [-hfBgImageSize, -hfBgImageSize] + ')')
      .attr('xlink:href', function(d) { return d.url; });
  }

  function animateBg() {
    d3
      .selectAll('#slide-1-bgs g')
      .data(bgData)
      .each(function() {
        var scope = this,
            i = 0;

        function animate() {
          ++i;
          var tr = d3.select(scope)
                .transition()
                .delay(function(d) { return d.delay; })
                .duration(function(d) { return d.duration; })
                .attrTween('transform', function(d) {
                  var current = d.startAngle - (i-1)*90;
                  return function(t) {
                    var loc = slideLocationFromAngle(current-90*t);
                    return 'translate(' + [loc.x, loc.y] + ')';
                  };
                })
                .each('end', function() {
                  if (i < 3) animate();
                });
        };
        animate();
      });

    return {
      stop: function() {
        d3
          .selectAll('#slide-1-bgs g')
          .data(bgData)
          .each(function(d) {
            var sel = d3.select(this);
            sel.transition().duration(0);
            sel
              .attr('transform', function() {
                var loc = slideLocationFromAngle(d.startAngle);
                return 'translate(' + [loc.x, loc.y] + ')';
              });
          });
      }
    };
  }



  function animateText() {
    var delay = config.subslideDelay || 1000,
        duration = config.subslideDuration || 1000;
    d3
      .selectAll('g#slide-1-text > g')
      .data([
        { delay: delay, duration: duration },
        { delay: delay, duration: duration },
        { delay: delay, duration: duration }
      ])
      .each(function(d, i) {
        var scope = this,
            count = 0;

        function animate() {
          ++count;
          d3.select(scope)
            .transition()
            .delay(d.delay)
            .duration(d.duration)
            .attr('opacity', i + 1 === count ? 1.0 : 0.0)
            .each('end', function() {
              if (count < 3) animate();
            });
        };
        animate();
      });

    return {
      stop: function() {
        d3
          .selectAll('g#slide-1-text > g')
          .each(function(d) {
            var sel = d3.select(this);
            sel.transition().duration(0);
            sel.attr('opacity', 0);
          });
      }
    };

  }

  app.addSlide('slide-1', {
    onCreate: function() {
      var userData = this.context.userData;
      d3.selectAll('g#slide-1-text > g text.ldl-date')
        .data([
          userData.firstday,
          userData.dt_10w,
          userData.dt_100w,
        ])
        .text(function(d) { return d; });

      d3
        .select('svg#slide-1-svg')
        .append('g')
        .attr('id', 'slide-1-bgs')

        .selectAll('g')
        .data(bgData)
        .enter()
        .append('g')
        .each(createSubSlide);

      this.animationHandles = [];
      return;
    },
    onEnter: function() {

      this.animationHandles.push(animateBg());
      this.animationHandles.push(animateText.call(this));

      return;
      // d3
      //   .select('#slide-1-sky')
      //   .transition()
      //   .duration(500)
      //   .attrTween(function(d) {


      //   });

      // this.$sky.velocity({
      //   left: '5%'
      // }, {
      //   duration: 1500
      // });

      this.$text1.velocity({
        opacity: 1.0
      }, {
        duration: 1500
      });

      // this.$foot.velocity({
      //   left: '-5%'
      // }, {
      //   delay: 1500,
      //   duration: 1200,
      //   easing: [300, 8]
      // });

      this.$text2.velocity({
        opacity: 1.0
      }, {
        delay: 1500,
        duration: 1500
      });
    },
    onExit: function() {
      this.animationHandles.forEach(function(h) {
        h.stop();
      });
      return;

      this.$foot.velocity('stop');
      this.$foot.css('left', '');

      this.$sky.velocity('stop');
      this.$sky.css('left', '');

      this.$text1.velocity('stop');
      this.$text1.css('opacity', '');

      this.$text2.velocity('stop');
      this.$text2.css('opacity', '');
    }
  });
})(app);
