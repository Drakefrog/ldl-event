
var app = {
  $: window.$,
  d3: window.d3,
  uuid: window.uuid,
  compile: function(source) {
    return Handlebars.compile(source);
  },
  slidesByName: {},
  mainEl: document.getElementById('main'),
  addSlide: function(name, aOptions) {
    var options = aOptions || {},
        urlParams,
        context,
        slide;

    // Apply config from slide*.json
    context = this.config && this.config[name] || {};
    if (aOptions && aOptions.context) {
      Object.keys(aOptions.context).forEach(function(k) {
        context[k] = aOptions.context[k];
      });
    }
    options.context = context;
    options.domEl = name;

    // Apply config from url for this slide
    urlParams = parseURL(location.href).params;
    if (parseInt(urlParams.index) === context.index) {
      Object.keys(urlParams).forEach(function(key) {
        var val;
        if (key !== 'index') {
          val = urlParams[key];
          context[key] = val;
        }
      });
    }

    slide = new Slide(options);
    this.slidesByName[name] = slide;

    return slide;
  },
  bootstrap: function() {
    var slidesByName = this.slidesByName,
        slides = Object.keys(slidesByName).map(function(name) {
          return slidesByName[name];
        }),
        urlParams = parseURL(location.href).params,
        scope = this;

    slides.sort(function(a, b) {
      return a.context.index - b.context.index;
    });

    scope.ss = new SlideShow(scope.mainEl, slides);

    // bootstrap first slide, defer others util api calls back
    scope.ss.slides[0].onCreate();

    // add user data to slides context:
    LDLAPI.getAnnualUserData(urlParams.uid, function(err, data) {
      if (err || !data || !data.ret) {
        // TODO: handle the case can not get user data
        data = scope.mockData;
      }

      app.userData = data.ret;

      var ss = scope.ss;

      ss.slides.forEach(function(slide, i) {
        slide.context.userData = data.ret;
      });

      ss.slides = ss.slides.filter(function(s) {
        return s.shouldCreate();
      });

      // fix index, posX, posY
      // fix css class
      ss.slides.forEach(function(s, i) {
        var ctx = s.context,
            $el = app.$(s.domEl),
            oldClassName = 'ss-' + ctx.posX + '-' + ctx.posY,
            newClassName;

        ctx.index = i;
        ctx.posY = i;
        newClassName = 'ss-' + ctx.posX + '-' + ctx.posY;

        $el
          .removeClass(oldClassName)
          .addClass(newClassName);
      });

      ss.slides.forEach(function(slide, i) {
        if (i === 0) return;
        slide.onCreate();
      });

    });

    scope.ss.start();

    if (urlParams.index) {
      setTimeout(function() {
        scope.ss.gotoSlide(parseInt(urlParams.index), { animate: false });
      }, 100);
    }
  }
};

(function() {
  function chain(context, fns, done) {
    var i = 0, count, j, len, completed;
    function next() {
      var fn = fns[i];

      if (typeof fn === 'function') {
        fn(context, function(err) {
          if (err) {
            done(err);
            return;
          }

          ++i;
          next();
        });
      } else if (Array.isArray(fn)) {
        len = fn.length;
        completed = 0;
        j = 0;
        for (j = 0; j < len; ++j) {
          fn[j](context, function(err) {
            if (err) {
              done(err);
              return;
            }
            completed += 1;
            if (completed === len) {
              ++i;
              next();
            }
          });
        }
      } else {
        done(null, context);
      }
    }
    next();
  }

  function fadeInText(el, duration, cb) {
    app.d3
      .select(el)
      .transition()
      .duration(duration)
      .attr('opacity', 1.0)
      .each('end', cb);
  }

  function fadeOutText(el, duration, cb) {
    app.d3
      .select(el)
      .transition()
      .duration(duration)
      .attr('opacity', 0.0)
      .each('end', cb);
  }

  function makeFadeIn(el, duration) {
    return function(ctx, done) {
      fadeInText(el, duration, function() {
        done();
      });
    };
  }

  function makeFadeOut(el, duration) {
    return function(ctx, done) {
      fadeOutText(el, duration, function() {
        done();
      });
    };
  }

  function makeDelay(delay) {
    return function(ctx, done) {
      setTimeout(function() {
        done();
      }, delay);
    };
  }

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
        name: wh.slice(0, -2).join('-'),
        ext: splits[1]
      };
    } else return {};
  }

  function initImageElement(el, url, aIdPrefix) {
    var obj = parseImageUrl(url),
        w = obj.width,
        h = obj.height,
        idPrefix = aIdPrefix || '',
        sel = app.d3.select(el);

    sel
      .attr('xlink:href', url)
      .attr('id',  idPrefix + obj.name)
      .attr('width',  w)
      .attr('height',  h)
      .attr('x', 0)
      .attr('y',  0)
      .attr('transform',  'translate(' + [-w/2, -h/2] + ')');
  }

  app.initImageElement = initImageElement;
  app.chain = chain;
  app.fadeInText = fadeInText;
  app.fadeOutText = fadeOutText;
  app.makeFadeIn = makeFadeIn;
  app.makeFadeOut = makeFadeOut;
  app.makeDelay = makeDelay;

})();

app.mockData = {
  "status": "OK",
  "uid": null,
  "ret": {
    "dt_10w": "2013-06-28",
    "firstday_running_steps": 0,
    "accumulativesteps": 4160136,
    "dt_100w": "2013-06-29",
    "completegoalday": 279,
    "averagesteps": 11243,
    "dailystatsday": 370,
    "firstday": "2013-04-15",
    "completegoalrate": "0%",
    "avatar_url": "http://tp4.sinaimg.cn/1967427891/180/5656156315/0",
    "running_firstday": "0",
    "rank": 181625,
    "friendsinfo": {
      "friendsrank": 5,
      "friendslist": [
        {
          "avatar_url": "http://files.ledongli.cn/avatar/11779431.jpg"
        },
        {
          "avatar_url": "http://qzapp.qlogo.cn/qzapp/100481185/DEB1A64DE4DCBED7282D145868AAAB44/100"
        },
        {
          "avatar_url": "http://tp1.sinaimg.cn/1718274124/180/5703054401/0"
        },
        {
          "avatar_url": "http://qzapp.qlogo.cn/qzapp/100481185/5FAD852F620FFA5059CBEAF3A8E02BCC/100"
        },
        {
          "avatar_url": "http://files.ledongli.cn/avatar/4148131.jpg"
        }
      ],
      "friends_count": 7
    },
    "lifetime": 619,
    "better_than_pct": "99%"
  },
  "errorCode": 0,
  "error": null,
  "path": null
};

function WeiXinShareBtn() {
  if (typeof WeixinJSBridge == "undefined") {
    // alert(" 请先通过微信搜索 wow36kr 添加36氪为好友，通过微信分享文章 :) ");
    alert("No weixijsbridge");
  } else {
    WeixinJSBridge.invoke('shareTimeline', {
      "title": "乐动力",
      "link": "http://localhost:3000",
      "desc": "乐动力",
      "img_url": "http://www.36kr.com/assets/images/apple-touch-icon.png"
    });
  }
}
