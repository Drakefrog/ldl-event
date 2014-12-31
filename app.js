
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


      scope.ss.slides.forEach(function(slide, i) {
        if (i === 0) return;
        slide.context.userData = data.ret;
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
  app.chain = chain;
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
