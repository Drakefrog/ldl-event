
(function(global) {
  var baseUrl = '',
      scope = {
        ENDPOINT : 'http://core.api.ledongli.cn:8090',
        DEV_PATH : '/han_nearline.api',
        PROD_PATH : '/han.api',
        CONFIG_GROUP : 'dev',
        USE_MOCK : true,
        MOCK_STATUS : 'OK'
      };

  if (/github/.test(location.href)) {
    baseUrl = 'http://lge88.github.io/ldl-event-slideshow';
  }

  function ajaxGet(url, params, callback) {
    var $ = window.$;
    $.ajax({
      type: 'GET',
      url: url,
      data: params,
      dataType: 'json',
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

  // TODO: if need extra parsing...
  function parseLDLAPIResultData(json) {
    // json.ret.day_10w = new Date(json.ret.day_10w);
    console.log(json);
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
        ajaxGet(baseUrl + '/data/mock-fail.json', params, cb);
      else
        ajaxGet(baseUrl + '/data/mock-success.json', params, cb);
    } else {
      path = scope.DEV_PATH;
      if (/^prod/i.test(scope.CONFIG_GROUP)) path = scope.PROD_PATH;
      url = scope.ENDPOINT + path;
      params.action = 'getannualdata';
      params.uid = uid;
      ajaxGet(url, params, cb);
    }
  }

  scope.getAnnualUserData = getAnnualUserData;
  global.LDLAPI = scope;

})(window);
