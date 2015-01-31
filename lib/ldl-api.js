
(function(global) {
  var baseUrl = '',
      scope = {
        ENDPOINT : 'http://core.api.ledongli.cn:8090',
        DEV_PATH : '/han_nearline.api',
        PROD_PATH : '/han.api',
        CONFIG_GROUP : 'dev',
        USE_MOCK : false,
        MOCK_STATUS : 'OK'
      };

  if (/github/.test(location.href)) {
    baseUrl = 'http://lge88.github.io/ldl-event-slideshow';
  }

  function ajaxGet(url, dataType, params, callback) {
    var $ = window.$;
    $.ajax({
      type: 'GET',
      url: url,
      data: params,
      dataType: dataType,
      success: function(data) {
        callback(null, data);
      },
      error: function(xhr, type) {
        callback({
          message: 'Can not get ' + url + ' :(',
          url: url,
          params: params,
          type: type,
          xhr: xhr
        });
      }
    });
  }

  function parseDate(dStr) {
    var arr = dStr.split('-');
    return {
      year: arr[0],
      month: arr[1],
      day: arr[2]
    };
  }

  // TODO: if need extra parsing...
  function parseLDLAPIResultData(json) {
    // json.ret.day_10w = new Date(json.ret.day_10w);
    // json.ret.better_than_pct = (100 - parseInt(json.ret.rank_pct)) + '%';
    json.ret.completegoalrate = Math.round(100*(json.ret.completegoalday/json.ret.lifetime));
    json.ret.firstday_parsed = parseDate(json.ret.firstday);
    json.ret.dt_10w_parsed = parseDate(json.ret.dt_10w);
    json.ret.dt_100w_parsed = parseDate(json.ret.dt_100w);
    // console.log(json);
    return json;
  }

  var mockSuccessData = {
    "status": "OK",
    "uid": null,
    "ret": {
      "dt_10w": "2013-06-28",
      "firstday_running_steps": 1000,
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
      "better_than_pct": "99%",
      "gender": "female"
    },
    "errorCode": 0,
    "error": null,
    "path": null
  };


  function getAnnualUserData(uid, callback) {
    var path,
        url,
        params = {},
        cb = function(err, data) {
          if (err) callback(err, data);
          callback(null, parseLDLAPIResultData(data));
        };

    if (!uid || scope.USE_MOCK) {
      cb(null, mockSuccessData);
    } else {
      path = scope.DEV_PATH;
      if (/^prod/i.test(scope.CONFIG_GROUP)) path = scope.PROD_PATH;
      url = scope.ENDPOINT + path;
      params.action = 'getannualdata';
      params.uid = uid;
      ajaxGet(url, 'jsonp', params, function(err, data) {
        if (err || !data || data.stataus !== 'OK') {
          cb(null, mockSuccessData);
        } else {
          cb(null. data);
        }
      });
    }
  }

  scope.getAnnualUserData = getAnnualUserData;
  global.LDLAPI = scope;

})(window);
