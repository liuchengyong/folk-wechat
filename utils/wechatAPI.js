/**
 * Created by luowei on 2/29/16.
 */
'use strict';
const wechatSignature = require('../utils/wechatSignature');
const config = require('../config');
const wechatAccess = config.wechatAccess;
const redisSetting = config.redisSetting;
const redis = require('./redisClient');
const API = require('wechat-api');

let getToken = (callback) => {
  redis.get(redisSetting.wechatTokenKey, (err, reply) => {
    if (err) return callback(err);
    callback(null, reply);
  })
};

let saveToken = (token, callback) => {
  redis.setex(redisSetting.wechatTokenKey, redisSetting.expiredTime, token.accessToken, callback);
};

let getTicketToken = (type, callback) => {
  redis.get(redisSetting.wechatTicketKey, (err, ticket) => {
    if (err) return callback(err);
    callback(null, ticket);
  })
};

let saveTicketToken = (type, ticketToken, callback) => {
  redis.setex(redisSetting.wechatTicketKey, redisSetting.expiredTime, ticketToken.ticket, err => {
    if (err) return callback(err);
    callback(null);
  })
};

let api = new API(wechatAccess.appid, wechatAccess.secret, getToken, saveToken);

api.registerTicketHandle(getTicketToken, saveTicketToken);

module.exports = Object.assign(api, wechatSignature);