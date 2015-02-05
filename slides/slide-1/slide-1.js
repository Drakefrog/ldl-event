(function(app) {
  var $ = app.$,
      d3 = app.d3,
      chain = app.chain,
      makeFadeIn = app.makeFadeIn,
      makeFadeOut = app.makeFadeOut,
      makeDelay = app.makeDelay,
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
          startAngle: 0,
          angle: 0,
          delay: config.subslideDelay || 1000,
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
          startAngle: 90,
          angle: 90,
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
              translate: [-4, -150]
            },
            {
              image: createImageElement(basePath + '/monster-258-216.png', 'slide-1-img-'),
              translate: [146, 0]
            },
            {
              image: createImageElement(basePath + '/aotema-216-216.png', 'slide-1-img-'),
              translate: [-144, 0]
            },
          ],
          startAngle: 180,
          angle: 180,
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

  function animateDigits(el, from, to) {
    d3.select(el)
      .transition()
      .duration(2000)
      .tween("text", function(d) {
        var i = d3.interpolate(from, to),
            prec = (d + "").split("."),
            round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

        return function(t) {
          this.textContent = Math.round(i(t) * round) / round;
        };
      });
  }

  function makeAnimateText(el, to, ndigits, duration) {
    return function(ctx, done) {
      d3.select(el)
        .transition()
        .duration(duration)
        .tween("text", function(d) {
          var from = this.textContent,
              i = d3.interpolate(from, to),
              prec = (from + "").split("."),
              round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

          return function(t) {
            this.textContent = pad(Math.round(i(t) * round) / round, ndigits);
          };
        })
        .each('end', function() {
          done();
        });
    };
  }

  function pad(num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  function animateFirstSlide(ctx, done) {
    var year = ctx.userData.firstday_parsed.year,
        month = ctx.userData.firstday_parsed.month,
        day = ctx.userData.firstday_parsed.day;

    chain(ctx, [
      makeResetText(),
      [
        makeAnimateText('#slide-1-year', year, 4, 1000),
        makeAnimateText('#slide-1-month', month, 2, 1000),
        makeAnimateText('#slide-1-day', day, 2, 1000)
      ],
      animateFoot,
      makeFadeIn('#slide-1-text-0',300),
      // makeDelay(1000),
      // makeFadeOut('#slide-1-text-0', 300)
    ], done);
  }

  function animateSecondSlide(ctx, done) {
    var year = ctx.userData.dt_10w_parsed.year,
        month = ctx.userData.dt_10w_parsed.month,
        day = ctx.userData.dt_10w_parsed.day;

    chain(ctx, [
      makeResetText(),
      [
        makeAnimateText('#slide-1-year', year, 4, 1000),
        makeAnimateText('#slide-1-month', month, 2, 1000),
        makeAnimateText('#slide-1-day', day, 2, 1000)
      ],
      animateCar,
      makeFadeIn('#slide-1-text-1', 300),
      // makeDelay(1000),
      // makeFadeOut('#slide-1-text-1', 300)
    ], done);
  }

  function animateThirdSlide(ctx, done) {
    var year = ctx.userData.dt_100w_parsed.year,
        month = ctx.userData.dt_100w_parsed.month,
        day = ctx.userData.dt_100w_parsed.day;

    chain(ctx, [
      makeResetText(),
      [
        makeAnimateText('#slide-1-year', year, 4, 1000),
        makeAnimateText('#slide-1-month', month, 2, 1000),
        makeAnimateText('#slide-1-day', day, 2, 1000)
      ],
      // animateMonsters,
      makeFadeIn('#slide-1-text-2', 500),
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

  function resetAnimations() {
    // Reset slides
    d3.selectAll('#slide-1-bgs > g')
      .attr('transform', function(d) {
        var loc = slideLocationFromAngle(d.startAngle);
        d.angle = d.startAngle;
        return 'translate(' + [loc.x, loc.y] + ')';
      });

    // Reset foot
    d3
      .select('#slide-1-0-foot')
      .attr('visibility', 'hidden')
      .attr('transform', 'translate(-700, 0)');

    // Reset car
    d3.select('#slide-1-car')
      .attr('transform', 'translate(750, 180)');


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
          userData.firstday_parsed,
          userData.dt_10w_parsed,
          userData.dt_100w_parsed,
        ])
        .text(function(d) {
          return d.year + '年' + d.month + '月' + d.day + '日';
        });

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
      var doRotateSlides = function(ctx, done) { rotateSlides(ctx.angle, done); },
          ss = this.ss,
          nSteps = this.context.userData.accumulativesteps,
          animations = [
            doReset,
            animateFirstSlide
          ];

      if (nSteps > 100000) {
        animations.push(makeDelay(1000));
        animations.push(makeFadeOut('#slide-1-text-0', 300));
        animations.push(doRotateSlides);
        animations.push(animateSecondSlide);
      }

      if (nSteps > 1000000) {
        animations.push(makeDelay(1000));
        animations.push(makeFadeOut('#slide-1-text-1', 300));
        animations.push(doRotateSlides);
        animations.push(animateThirdSlide);
      }

      function doReset(ctx, done) {
        resetText();
        resetAnimations();
        done();
      }

      ss.hideArrowButton();
      ss.disableUserInteraction();

      chain({
        userData: this.context.userData,
        angle: -90
      }, animations, function(err, ctx) {
        ss.showArrowButton();
        ss.enableUserInteraction();
      });
      return;
    },
    onExit: function() {
      // resetText();
      // resetAnimations();
    }
  });
})(app);
