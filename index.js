var API = require('wechat-api');
var redis = require('./utils/redisClient');
var wechatAccess = require('./config').weixin_access;
var CONST = require('./constants');

var api = new API(wechatAccess.appid, wechatAccess.secret, function(callback) {
  redis.get(CONST.WECHATOKEN, function(err, reply) {
    callback(null, JSON.parse(reply));
  });
}, function(token, callback) {
  redis.setex(CONST.WECHATOKEN, 60 * 100, JSON.stringify(token), callback);
});


api.getLatestToken(function(err, token) {
  console.log(token.accessToken);
});
