
(function(global) {
  var ajaxGet = window.ajaxGet,
      scope = {
        ENDPOINT : 'http://core.api.ledongli.cn:8090',
        DEV_PATH : '/han_nearline.api',
        PROD_PATH : '/han.api',
        CONFIG_GROUP : 'dev',
        USE_MOCK : true,
        MOCK_STATUS : 'OK'
      };

  // TODO: if need extra parsing...
  function parseLDLAPIResultData(json) {
    // json.ret.day_10w = new Date(json.ret.day_10w);
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

    if (scope.USE_MOCK) {
      if (scope.MOCK_STATUS === 'FAIL')
        ajaxGet('/data/mock-fail.json', params, cb);
      else
        ajaxGet('/data/mock-success.json', params, cb);
    } else {
      path = scope.DEV_PATH;
      if (/^prod/i.test(scope.CONFIG_GROUP)) path = scope.PROD_PATH;
      url = ENDPOINT + path;
      params.action = 'getannualdata';
      params.uid = uid;
      ajaxGet(url, params, cb);
    }
  }

  scope.getAnnualUserData = getAnnualUserData;
  global.LDLAPI = scope;

})(window);
