(function(app) {
  var $ = app.$,
      d3 = app.d3,
      // compile = app.compile,
      // template = compile($('#slide-1-template-text').html()),
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
          startAngle: 90
        },
        {
          id: 'slide-1-city',
          url: basePath + '/city-900-900.png',
          startAngle: 180
        },
        {
          id: 'slide-1-clouds',
          url: basePath + '/clouds-900-900.png',
          startAngle: 270
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
                .duration(1000)
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

      }
    };
  }



  function animateText() {
    this.$text1.velocity({
      opacity: 1.0
    }, {
      duration: 1500
    });

    this.$text2.velocity({
      opacity: 1.0
    }, {
      delay: 1500,
      duration: 1500
    });
  }

  app.addSlide('slide-1', {
    onCreate: function() {
      // var $text = $(template(this.context));

      // var svgTextFrag = (new DOMParser()).parseFromString(template(this.context), 'text/xml');
      // document.getElementById('slide-1-svg').appendChild(svgTextFrag);

      // $(this.domEl).append($text);
      // this.$text = $text;
      // this.$text1 = $('.slide-1-text-1', $text);
      // this.$text2 = $('.slide-1-text-2', $text);
      // this.$foot = $('.slide-1-foot', this.domEl);
      d3
        .select('svg#slide-1-svg')

        // .selectAll('g')
        // .data([0])
        // .enter()
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
      // this.animationHandles.push(animateText.call(this));

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
