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
      slideData = [
        {
          id: 'slide-1-0',
          elements: [
            {
              translate: [0, 0],
              image: createImageElement(basePath + '/sky-900-900.png', 'slide-1-img-')
            },
            {
              translate: [-100, 0],
              image: createImageElement(basePath + '/foot-564-360.png', 'slide-1-img-')
            },
          ],
          startAngle: 90,
          delay: config.subslideDelay || 1000,
          delay: 0,
          duration: config.subslideDuration || 1000
        },
        {
          id: 'slide-1-1',
          elements: [
            {
              translate: [0, 0],
              image: createImageElement(basePath + '/city-900-900.png', 'slide-1-img-')
            },
            {
              translate: [0, 0],
              image: createImageElement(basePath + '/car-576-36.png', 'slide-1-img-')
            },
            {
              translate: [0, 0],
              image: createImageElement(basePath + '/road-1080-30.png', 'slide-1-img-')
            },
          ],
          startAngle: 180,
          delay: config.subslideDelay || 1000,
          duration: config.subslideDuration || 1000
        },
        {
          id: 'slide-1-2',
          elements: [
            {
              image: createImageElement(basePath + '/clouds-900-900.png', 'slide-1-img-'),
              translate: [0, 0]
            },
            {
              image: createImageElement(basePath + '/heart-96-216.png', 'slide-1-img-'),
              translate: [0, 0]
            },
            {
              image: createImageElement(basePath + '/monster-258-216.png', 'slide-1-img-'),
              translate: [0, 0]
            },
            {
              image: createImageElement(basePath + '/aotema-216-216.png', 'slide-1-img-'),
              translate: [0, 0]
            },
          ],
          startAngle: 270,
          delay: config.subslideDelay || 1000,
          duration: config.subslideDuration || 1000
        }
      ], slideAnimates;

  function parseImageUrl(url) {
    var paths = url.split('/'),
        basename = paths[paths.length-1],
        splits = basename.split('.'),
        wh;

    if (splits) {
      wh = splits[0].split('-');
      return {
        width: parseInt(wh[wh.length-2]),
        height: parseInt(wh[wh.length-1]),
        name: splits[0],
        ext: splits[1]
      };
    } else return {};
  }

  function createImageElement(url, aIdPrefix) {
    var obj = parseImageUrl(url),
        w = obj.width,
        h = obj.height,
        idPrefix = aIdPrefix || '';

    return {
      'xlink:href': url,
      id: idPrefix + obj.name,
      ext: obj.ext,
      width: w,
      height: h,
      x:0,
      y: 0,
      transform: 'translate(' + [-w/2, -h/2] + ')'
    };
  }

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

      .selectAll('g')
      .data(function(d) { return d.elements; })
      .enter()
      .append('g')
      .attr('transform', function(d) {
        var str = [];
        if (d.translate) str.push('translate(' + d.translate + ')');
        if (d.rotate) str.push('rotate(' + d.rotate + ')');
        if (d.scale) str.push('scale(' + d.scale + ')');
        return str.join(' ');
      })

      .selectAll('image')
      .data(function(d) {
        return [d.image];
      })
      .enter()
      .append('image')
      .attr('x', function(d) { return d['x']; })
      .attr('y', function(d) { return d['y']; })
      .attr('width', function(d) { return d['width']; })
      .attr('height', function(d) { return d['height']; })
      .attr('transform', function(d) { return d['transform']; })
      .attr('xlink:href', function(d) { return d['xlink:href']; });
  }

  slideAnimates = [
    function animateFirstSlide(done) {

    },
    function moveToSecondSlide(done) {

    },
    function animateSecondSlide(done) {

    },
    function moveToThirdSlide(done) {

    },
    function animateThirdSlide(done) {

    },
  ];

  function chainAnimations(arr) {

  }


  function animateBg() {
    d3
      .selectAll('#slide-1-bgs > g')
      .data(slideData)
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
          .data(slideData)
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
        .data(slideData)
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
