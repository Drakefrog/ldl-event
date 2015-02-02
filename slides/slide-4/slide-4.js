(function(app) {
  var d3 = app.d3,
      arcCenter = [450, 425],
      startInnerRadius = 206,
      maxRandomAngle = 30,
      w = 15,
      arcData = [
        { startAngle: 60, endAngle: 290, color: '#1d3689', width: w },
        { startAngle: 60, endAngle: 290, color: '#1d3689', width: w },
        { startAngle: 60, endAngle: 290, color: '#1d3689', width: w },
        { startAngle: 60, endAngle: 290, color: '#0177c1', width: w },
        { startAngle: 60, endAngle: 290, color: '#0177c1', width: w },
        { startAngle: 60, endAngle: 290, color: '#0177c1', width: w },
        { startAngle: 60, endAngle: 290, color: '#73d36c', width: w },
        { startAngle: 60, endAngle: 290, color: '#73d36c', width: w },
        { startAngle: 60, endAngle: 290, color: '#73d36c', width: w },
        { startAngle: 60, endAngle: 290, color: '#30b949', width: w },
        { startAngle: 60, endAngle: 290, color: '#30b949', width: w },
        { startAngle: 60, endAngle: 290, color: '#30b949', width: 2*w }
      ],
      bgArc = d3.svg.arc()
        .startAngle(function(d) { return d.startAngle/180*Math.PI; })
        .endAngle(function(d) { return d.endAngle/180*Math.PI; })
        .innerRadius(function(d) { return d.innerRadius; })
        .outerRadius(function(d) { return d.outerRadius; }),
      fgArc = d3.svg.arc()
        .startAngle(function(d) { return d.startAngle/180*Math.PI; })
        .endAngle(function(d) { return d.currentAngle/180*Math.PI;; })
        .innerRadius(function(d) { return d.innerRadius; })
        .outerRadius(function(d) { return d.outerRadius; });

  function setCurrentAngle(arcData) {
    arcData.forEach(function(a) {
      a.currentAngle = a.startAngle;
    });
  }

  function applyRandomAngle(arcData, da) {
    arcData.forEach(function(a) {
      a.startAngle += (Math.random()-1)*2*da;
      a.endAngle += (Math.random()-1)*2*da;
    });
  }

  function computeInnerOuter(arcData) {
    arcData.reduce(function(sofar, a) {
      a.innerRadius = sofar;
      a.outerRadius = sofar + a.width;
      return a.outerRadius;
    }, startInnerRadius);
  }

  function computeFgEndAngle(arcData, r) {
    r = r/100;
    arcData.forEach(function(a) {
      a.fgEndAngle = a.startAngle + r*(a.endAngle - a.startAngle);
    });
  }

  applyRandomAngle(arcData, maxRandomAngle);
  setCurrentAngle(arcData);
  computeInnerOuter(arcData);

  app.addSlide('slide-4', {
    onCreate: function() {
      d3.select('#slide-4-bg-arcs')
        .selectAll('path')
        .data(arcData)
        .enter()
        .append('path')
        .attr('d', bgArc)
        .attr('transform', 'translate(' + arcCenter + ')')
        .attr('fill', function(d) {
          return d3.rgb(d.color).darker(3.0);
        });

      d3.select('#slide-4-fg-arcs')
        .selectAll('path')
        .data(arcData)
        .enter()
        .append('path')
        .attr('d', fgArc)
        .attr('transform', 'translate(' + arcCenter + ')')
        .attr('fill', function(d) {
          return d.color;
        });

      d3.select('#slide-4-complete-days')
        .text(' ' + this.context.userData.completegoalday + ' ');
    },
    onEnter: function() {
      var rate = this.context.userData.completegoalrate,
          rateAnimationDuration = parseInt(this.context.rateAnimationDuration) || 2000,
          ss = this.ss;

      ss.hideArrowButton();
      ss.disableUserInteraction();

      computeFgEndAngle(arcData, rate);

      d3.select('#slide-4-complete-rate')
        .transition()
        .duration(rateAnimationDuration)
        .tween("text", function() {
          var i = d3.interpolateRound(0, rate);
          return function(t) {
            var d = i(t);
            if (d < 10) this.textContent = '0' + i(t) + '%';
            else this.textContent = i(t) + '%';
          };
        });

      d3.select('#slide-4-fg-arcs')
        .selectAll('path')
        .data(arcData)
        .transition()
        .duration(rateAnimationDuration)
        .attrTween('d', function(d) {
          var i = d3.interpolateNumber(d.startAngle, d.fgEndAngle);
          return function(t) {
            d.currentAngle = i(t); return fgArc(d);
          };
        });

      d3.select('#slide-4-text-summary')
        .transition()
        .delay(rateAnimationDuration)
        .duration(rateAnimationDuration)
        .attr('opacity', 1.0);

      setTimeout(function() {
        ss.showArrowButton();
        ss.enableUserInteraction();
      }, rateAnimationDuration + rateAnimationDuration);

    },
    onExit: function() {

    }
  });
})(app);
