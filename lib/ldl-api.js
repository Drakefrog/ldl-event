
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

  function getAnnualUserData(uid, callback) {
    var path,
        url,
        params = {},
        cb = function(err, data) {
          if (err) callback(err, data);
          callback(null, parseLDLAPIResultData(data));
        };

    if (!uid || scope.USE_MOCK) {
      if (scope.MOCK_STATUS === 'FAIL')
        ajaxGet(baseUrl + '/data/mock-fail.json', 'json', params, cb);
      else
        ajaxGet(baseUrl + '/data/mock-success-12-30-14-38.json', 'json', params, cb);
    } else {
      path = scope.DEV_PATH;
      if (/^prod/i.test(scope.CONFIG_GROUP)) path = scope.PROD_PATH;
      url = scope.ENDPOINT + path;
      params.action = 'getannualdata';
      params.uid = uid;
      ajaxGet(url, 'jsonp', params, cb);
    }
  }

  scope.getAnnualUserData = getAnnualUserData;
  global.LDLAPI = scope;

})(window);
