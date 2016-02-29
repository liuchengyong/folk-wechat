/**
 * Created by luowei on 2/29/16.
 */
var API = require('wechat-api');
var wechatAccess = require('../config').weixin_access;
var CONST = require('../constants');
var redis = require('./redisClient');

var api = new API(wechatAccess.appid, wechatAccess.secret, function getToken(callback) {
  redis.get(CONST.wechatTokenKey, function(err, reply) {
    if (err) return callback(err);
    callback(null, reply);
  });
}, function saveToken(token, callback) {
  redis.setex(CONST.wechatTokenKey, CONST.expiredTime, token.accessToken, callback);
});

api.registerTicketHandle(function getTicketToken(type, callback) {
  redis.get(CONST.wechatTicketKey, function (err, ticket) {
    if (err) return callback(err);
    callback(null, ticket);
  });
}, function saveTicketToken(type, ticketToken, callback) {
  redis.setex(CONST.wechatTicketKey ,CONST.expiredTime, ticketToken.ticket, err => {
    if (err) return callback(err);
    callback(null);
  });
});

module.exports = api;