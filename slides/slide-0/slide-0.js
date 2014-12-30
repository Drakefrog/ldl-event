(function(app) {
  var $ = app.$,
      d3 = app.d3,
      starSize = 32,
      starCenters = [
        { x:249, y: 316 },
        { x:285, y: 309 },
        { x:321, y: 302 },
        { x:357, y: 295 }
      ];

  function resetStars() {
    var size = 10 * starSize,
        stars = this.stars,
        basePath = this.context.basePath;

    stars
      .transition()
      .duration(0)
      .style('display', 'none')
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .attr('width', function(d) { return size; })
      .attr('height', function(d) { return size; })
      .attr('xlink:href', basePath + '/star.png')
      .attr('transform', 'translate(' + [-size/2, -size/2] + ')');
  }

  app.addSlide('slide-0', {
    onCreate: function() {
      var duration = this.context.starAnimationDuration || 500,
          starData = starCenters.map(function(p, i) {
            p.delay = i*duration+10;
            p.duration = duration;
            return p;
          }),
          size = 10 * starSize;

      this.stars = d3.select('g#slide-0-stars')
        .selectAll("image")
        .data(starData)
        .enter()
        .append("image");

      resetStars.call(this);
    },
    onEnter: function() {
      var size = starSize;
      this.stars
        .transition()
        .delay(function(d) { return d.delay; })
        .duration(0)
        .style('display', '')
        .each(function() {
          d3.select(this)
            .transition()
            .duration(function(d) { return d.duration; })
            .attr('width', size)
            .attr('height', size)
            .attr('transform', 'translate(' + [-size/2, -size/2] + ')');
        });
    },
    onExit: function() {
      resetStars.call(this);
    }
  });
})(app);
