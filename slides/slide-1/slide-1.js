(function(app) {
  var $ = app.$,
      d3 = app.d3,
      chain = app.chain,
      makeFadeIn = app.makeFadeIn,
      makeFadeOut = app.makeFadeOut,
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
              id: 'slide-1-0-foot',
              translate: [-700, 0],
              visibility: 'hidden',
              image: createImageElement(basePath + '/foot-564-360.png', 'slide-1-img-')
            },
          ],
          angle: 90,
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
              translate: [0, 180],
              image: createImageElement(basePath + '/road-1080-30.png', 'slide-1-img-')
            },
            {
              translate: [750, 180],
              id: 'slide-1-car',
              image: createImageElement(basePath + '/car-576-36.png', 'slide-1-img-')
            }
          ],
          angle: 180,
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
              translate: [60, -150]
            },
            {
              image: createImageElement(basePath + '/monster-258-216.png', 'slide-1-img-'),
              translate: [210, 0]
            },
            {
              image: createImageElement(basePath + '/aotema-216-216.png', 'slide-1-img-'),
              translate: [-80, 0]
            },
          ],
          angle: 270,
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
        var loc = slideLocationFromAngle(d.angle);
        return 'translate(' + [loc.x, loc.y] + ')';
      })

      .selectAll('g')
      .data(function(d) { return d.elements; })
      .enter()
      .append('g')
      .attr('id', function(d) { return d.id; })
      .attr('visibility', function(d) {
        return d['visibility'] ? d['visibility'] : 'visible';
      })
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

  function makeResetText() {
    return function(ctx, done) { resetText(); done(); };
  }

  function animateFirstSlide(ctx, done) {
    chain(ctx, [
      makeResetText(),
      animateFoot,
      makeFadeIn('#slide-1-text-0', 1000),
      makeFadeOut('#slide-1-text-0', 1000)
    ], done);
  }

  function animateSecondSlide(ctx, done) {
    chain(ctx, [
      makeResetText(),
      animateCar,
      makeFadeIn('#slide-1-text-1', 1000),
      makeFadeOut('#slide-1-text-1', 1000)
    ], done);
  }

  function animateThirdSlide(ctx, done) {
    chain(ctx, [
      makeResetText(),
      // animateMonsters,
      makeFadeIn('#slide-1-text-2', 1000),
      // makeFadeOut('#slide-1-text-2', 1000)
    ], done);
  }

  // TODO:
  function animateMonsters(ctx, done) {
    done();
  }

  function animateCar(ctx, done) {
    d3.select('#slide-1-car')
      .transition()
      .duration(1000)
      .attr('transform', 'translate(-200, 180)')
      .each('end', function() {
        done();
      });
  }

  function makeFadeInFadeOutChain(el, duration) {
    return makeChain([
      function(ctx, done) {
        resetText();
        done();
      },
      function(ctx, done) {
        fadeInText(el, duration, function() {
          done();
        });
      },
      function(ctx, done) {
        fadeOutText(el, duration, function() { done(); });
      }
    ]);
  }

  function animateFoot(ctx, done) {
    d3
      .select('#slide-1-0-foot')
      .attr('visibility', 'visible')
      .transition()
      .duration(200)
      .ease(d3.ease('elastic'))
      .attr('transform', 'translate(-200, 0)')
      .each('end', function() {
        done();
      });
  }

  function resetText() {
    d3
      .selectAll('#slide-1-text g')
      .attr('opacity', 0.0);
  }

  function rotateSlides(angle, done) {
    var count = 3;
    d3.selectAll('#slide-1-bgs > g')
      .transition()
      .duration(function(d) { return d.duration; })
      .attrTween('transform', function(d) {
        var startAngle = d.angle;

        return function(t) {
          var loc;
          d.angle = startAngle + angle*t;
          loc = slideLocationFromAngle(d.angle);
          return 'translate(' + [loc.x, loc.y] + ')';
        };
      })
      .each('end', function() {
        count--;
        if (count === 0) {
          if (typeof done === 'function')
            done();
        }
      });
  }

  app.addSlide('slide-1', {
    onCreate: function() {
      var userData = this.context.userData || {};
      d3.selectAll('g#slide-1-text > g text.ldl-date')
        .data([
          userData.firstday,
          userData.dt_10w,
          userData.dt_100w,
        ])
        .text(function(d) { return d; });

      d3
        .select('g#slide-1-imgs')
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
      var doRotateSlides = function(ctx, done) { rotateSlides(ctx.angle, done); };

      chain({
        angle: -90
      }, [
        doRotateSlides,
        animateFirstSlide,
        doRotateSlides,
        animateSecondSlide,
        doRotateSlides,
        animateThirdSlide
      ], function(err, ctx) {

      });
      return;
    },
    onExit: function() {
      resetText();
    }
  });
})(app);
