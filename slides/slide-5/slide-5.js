(function(app) {
  var compile = app.compile,
    $ = app.$,
    d3 = app.d3,
    idxs = 0;
  // text1Template = compile($('#slide-5-template-text-1').html()),
  // rankCircleTemplate = compile($('#slide-5-template-rank-circle').html());

  function animateTextNumber(el, dest, duration) {
    var startTime = Date.now(),
      startValue = parseInt(el.textContent),
      dist = dest - startValue,
      animate = function() {
        var t = Date.now(),
          progress = (t - startTime) / duration;
        if (progress > 0.99) {
          el.textContent = '' + dest;
          stop();
        } else {
          el.textContent = '' + Math.round(startValue + progress * dist);
          requestAnimationFrame(animate);
        }
      };

    function stop() {
      animate = function() {};
    }

    animate();

    return {
      stop: stop
    };
  }

  function animateRectWidth($rect, destW, duration) {
    $rect.velocity({
      width: destW
    }, {
      duration: duration
    });

    return {
      stop: function() {
        $rect[0].width = 0;
        $rect.velocity('stop');
      }
    };
  }


  function animateRankCircle(el, x, y, destScale, delay, duration) {
    d3.select(el)
      .transition()
      .delay(delay)
      .duration(duration)
      .attr('transform', 'translate(' + [x, y] + ') scale(' + destScale + ')');

    // $el
    //   .velocity({
    //     translateX: x,
    //     translateY: y,
    //     scale: 0.0
    //   }, {
    //     delay: delay,
    //     duration: 0
    //   })
    //   .velocity({
    //     scale: destScale
    //   }, {
    //     duration: duration
    //   });

    return {
      stop: function() {
        // $el.velocity('stop', true);
        // $el[0].scale = 0.0;
        // $el[0].translateX = x;
        // $el[0].translateY = y;
      }
    };
  }

  function animateFireworks(smallFirework, largeFirework, duration, delay) {
    d3.select(smallFirework)
      .transition()
      .duration(duration)
      .delay(delay)
      .attr('transform', 'scale(1.0)')
      .each('end', function() {
        d3.select(largeFirework)
          .transition()
          .duration(duration)
          .attr('transform', 'scale(1.0)');
      });
  }

  function callMeId(pct, sex) {

    var iPct = parseInt(pct, 10),
      basePrefix = '#slide-5-call-me-',
      idx;


    if (/^[fF]/.test(sex)) {
      if (iPct <= 20) {
        idx = 0;
      } else if (iPct > 20 && iPct <= 50) {
        idx = 2;
      } else if (iPct > 50 && iPct <= 60) {
        idx = 4;
      } else if (iPct > 60 && iPct <= 70) {
        idx = 6;
      } else if (iPct > 70 && iPct <= 90) {
        idx = 8;
      } else {
        idx = 10;
      }
    } else {
      if (iPct <= 20) {
        idx = 1;
      } else if (iPct > 20 && iPct <= 50) {
        idx = 3;
      } else if (iPct > 50 && iPct <= 60) {
        idx = 5;
      } else if (iPct > 60 && iPct <= 70) {
        idx = 7;
      } else if (iPct > 70 && iPct <= 90) {
        idx = 9;
      } else {
        idx = 11;
      }
    }
    idxs = idx;
    return basePrefix + idx;
  }

  function isWeixin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true;
    } else {
      return false;
    }
  }


  function sharecontent (idx) {
    // body
    var sharetitle = "";
    switch (idx){
      case 0: sharetitle = "运动白富美";break;
      case 1: sharetitle = "运动高富帅";break;
      case 2: sharetitle = "中国级运动女神";break;
      case 3: sharetitle = "中国级运动健将";break;
      case 4: sharetitle = "亚洲级运动女神";break;
      case 5: sharetitle = "亚洲级运动健将";break;
      case 6: sharetitle = "国际级运动女神";break;
      case 7: sharetitle = "国际级运动健将";break;
      case 8: sharetitle = "银河系级运动女神";break;
      case 9: sharetitle = "银河系级运动健将";break;
      case 10: sharetitle = "全宇宙级运动女神";break;
      case 11: sharetitle = "全宇宙级运动健将";break;
    }
    return sharetitle;    
  }

  function shareContentString (days,idx) {
    var shareString = "";
    var sharetitle = sharecontent(idx);
    shareString = "我用乐动力" +  days + "天，获得了「" + sharetitle + "」称号！";
    return shareString;
    }

  function shareTitleString (idx) {
    // body...
    var shareString = "我获得了「" + sharecontent(idx) + "」的称号！你呢？";
    return shareString;
  }


  app.addSlide('slide-5', {
    onCreate: function() {
      var pct = this.context.userData.better_than_pct,
        sex = this.context.userData.gender || 'male',
        shareUrl = 'http://ledongli.cn/';

      this.totalStepTextEl = $('#slide-5-total-steps')[0];
      this.avgStepTextEl = $('#slide-5-avg-steps')[0];

      this.$clipRect = $('#slide-5-bright-map-clip rect');

      this.$rankCircle = $('#slide-5-rank-circle');

      this.smallFireworkEl = '#slide-5-firework-small';
      this.largeFireworkEl = '#slide-5-firework-large';


      d3.select('#slide-5-better-than-pct')
        .text(pct);

      this.pct = pct;
      this.sex = sex;

      var today = new Date();
      var startdate = this.context.userData.firstday_parsed.year 
                    + "-"
                    + this.context.userData.firstday_parsed.month 
                    + "-"
                    + this.context.userData.firstday_parsed.day;

      var days       = (today.getTime() - Date.parse(startdate))/86400000;
      var strTitle   = shareTitleString(idxs);
      var strContent = shareContentString(parseInt(days),idxs);

      d3.select('#ldl-share-title')
        .text(function (){
          return strTitle ;
        });

      d3.select('#ldl-share-content')
        .text(function (){
          return strContent + "!";
        });

      if (isWeixin()) {
        var downloadUrl = "http://a.app.qq.com/o/simple.jsp?pkgname=cn.ledongli.ldl&g_f=991653";
        d3.select('#sharecontent')
        .text("开启新旅程");
        d3.select("#slide-5-share-btn text")
          .on('click', function() {
            var win = window.open(downloadUrl,'_blank');
            win.focus();
          });

      } else{
        d3.select('#slide-5-share-btn rect')
        .on('click', function() {
          d3.select(".cover")
            .transition()
              .duration("2000")
              .style("display","block");
        });
        d3.select('#slide-5-share-btn text')
        .on('click', function() {
          d3.select(".cover")
            .transition()
              .duration("2000")
              .style("display","block");
        });
        d3.select('.cover')
          .on('click', function() {
            d3.select(this)
            .transition()
              .duration(500)
              .style("display","none");
            /* Act on the event */
          });
      };

      
      this.animationHandles = [];
    },
    onEnter: function() {
      var stepAccDuration = this.context.stepsAccumulateAnimationDuration || 2000,
        rankCircleDuration = this.context.rankCircleAnimationDuration || 200,
        fireworkDuration = this.context.fireworkAnimationDuration || 200,
        destWidth = 800,
        totalSteps = this.context.userData.accumulativesteps,
        avgSteps = this.context.userData.averagesteps,
        ss = this.ss;

      ss.disableUserInteraction();

      this.animationHandles.push(animateTextNumber(this.totalStepTextEl, totalSteps, stepAccDuration));
      this.animationHandles.push(animateTextNumber(this.avgStepTextEl, avgSteps, stepAccDuration));
      this.animationHandles.push(animateRectWidth(this.$clipRect, destWidth, stepAccDuration));
      this.animationHandles.push(animateFireworks(this.smallFireworkEl, this.largeFireworkEl, fireworkDuration, stepAccDuration));
      this.animationHandles.push(animateRankCircle(
        this.$rankCircle[0],
        this.context.circleCenterX,
        this.context.circleCenterY,
        1.0,
        stepAccDuration + 2 * fireworkDuration,
        rankCircleDuration));

      d3.select(callMeId(this.pct, this.sex))
        .transition()
        .duration(500)
        .delay(rankCircleDuration + stepAccDuration + 2 * fireworkDuration)
        .attr('transform', 'scale(1.0)');

      setTimeout(function() {
        ss.enableUserInteraction();
      }, rankCircleDuration + stepAccDuration + 2 * fireworkDuration + 500);
    },
    onExit: function() {
      this.animationHandles.forEach(function(handle) {
        handle.stop();
      });
    }
  });
})(app);