(function(app) {
  var d3 = app.d3,
      starSize = 32,
      starCenters = [
        { x:249, y: 316 },
        { x:285, y: 309 },
        { x:321, y: 302 },
        { x:357, y: 295 }
      ];

  function reset() {
    var size = 10 * starSize,
        stars = this.stars,
        logo = this.logo,
        text = this.text,
        basePath = this.context.basePath;

    stars.transition().duration(0);
    logo.transition().duration(0);
    text.transition().duration(0);

    stars
      .style('display', 'none')
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .attr('width', function(d) { return size; })
      .attr('height', function(d) { return size; })
      .attr('xlink:href', basePath + '/star.png')
      .attr('transform', 'translate(' + [-size/2, -size/2] + ')');

    // logo.attr('opacity', 0.0);

    text.attr('transform', 'translate(' + [-600, 550] + ')');
  }

  app.addSlide('slide-0', {
    onCreate: function() {
      var duration = parseInt(this.context.starAnimationDuration) || 500,
          starData = starCenters.map(function(p, i) {
            p.delay = i*duration;
            p.duration = duration;
            return p;
          }),
          size = 10 * starSize;

      this.stars = d3.select('g#slide-0-stars')
        .selectAll("image")
        .data(starData)
        .enter()
        .append("image");

      this.logo = d3.select('#slide-0-logo');

      this.text = d3.select('g#slide-0-text');

      reset.call(this);
    },
    onEnter: function() {
      var size = starSize,
          logoDuration = parseInt(this.context.logoAnimationDuration) || 200,
          textAnimationDuration = parseInt(this.context.textAnimationDuration) || 200,
          starDelay = 0;

      // this.logo
      //   .transition()
      //   .duration(logoDuration)
      //   .attr('opacity', 1.0);

      this.stars
        .transition()
        .delay(function(d) {
          starDelay += d.duration;
          return d.delay + logoDuration;
        })
        .each(function() {
          d3.select(this)
            .transition()
            .style('display', '')
            .duration(function(d) { return d.duration; })
            .attr('width', size)
            .attr('height', size)
            .attr('transform', 'translate(' + [-size/2, -size/2] + ')');
        });

      this.text
        .transition()
        .delay(logoDuration + starDelay)
        .duration(500)
        .attr('transform', 'translate(' + [190, 550] + ')');
    },
    onExit: function() {
      reset.call(this);
    }
  });
})(app);
