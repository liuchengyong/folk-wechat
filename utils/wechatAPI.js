/**
 * Created by luowei on 2/29/16.
 */
'use strict';
var API = require('wechat-api');
var wechatAccess = require('../config').weixin_access;
var CONST = require('../constants');
var redis = require('./redisClient');

let getToken = (callback) => {
  redis.get(CONST.wechatTokenKey, (err, reply) => {
    if (err) return callback(err);
    callback(null, reply);
  })
};

let saveToken = (token, callback) => {
  redis.setex(CONST.wechatTokenKey, CONST.expiredTime, token.accessToken, callback);
};

let getTicketToken = (type, callback) => {
  redis.get(CONST.wechatTicketKey, (err, ticket) => {
    if (err) return callback(err);
    callback(null, ticket);
  })
};

let saveTicketToken = (type, ticketToken, callback) => {
  redis.setex(CONST.wechatTicketKey, CONST.expiredTime, ticketToken.ticket, err => {
    if (err) return callback(err);
    callback(null);
  })
};

var api = new API(wechatAccess.appid, wechatAccess.secret, getToken, saveToken);

api.registerTicketHandle(getTicketToken, saveTicketToken);

module.exports = api;