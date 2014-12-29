(function(app) {
  var $ = app.$,
      compile = app.compile,
      starSource = $('#slide-0-template-star').html(),
      starTemplate = compile(starSource),
      starSize = 32,
      starCenters = [
        { x:249, y: 316 },
        { x:285, y: 309 },
        { x:321, y: 302 },
        { x:357, y: 295 }
      ];

  function createStar(id, point, size) {
    var data = {
      id: id,
      x: point.x,
      y: point.y,
      size: size,
      tx: -size/2,
      ty: -size/2
    };
    return starTemplate(data);
  }

  function presentStar(index, duration, delay) {
    return setTimeout(function() {
      $('#slide-0-star-' + index)
        .css('display', '')
        .velocity({
          width: starSize,
          height: starSize,
          translateX: -starSize/2,
          translateY: -starSize/2
        }, {
          duration: duration
        });
      return duration;
    }, delay);
  }

  app.addSlide('slide-0', {
    onCreate: function() {
      this.starContainer = $('#slide-0-stars', this.domEl)[0];
      this.animations = [];
    },
    onEnter: function() {
      var duration = this.context.starAnimationDuration || 500;
      starCenters.forEach(function(p, i) {
        var html = createStar('slide-0-star-'+i, p, starSize*10);
        this.starContainer.innerHTML += html;
      }, this);

      this.animations.push(presentStar(0, duration, 0*duration));
      this.animations.push(presentStar(1, duration, 1*duration));
      this.animations.push(presentStar(2, duration, 2*duration));
      this.animations.push(presentStar(3, duration, 3*duration));
    },
    onExit: function() {
      this.animations.forEach(function(id) {
        clearTimeout(id);
      });
      this.starContainer.innerHTML = '';
    }
  });
})(app);
