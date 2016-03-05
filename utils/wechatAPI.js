/**
 * Created by luowei on 2/29/16.
 */
'use strict';
const config = require('../config');
const wechatAccess = config.wechatAccess;
const redisSetting = config.redisSetting;
const redis = require('./redisClient');
const API = require('wechat-api');

let weichatAPI;
const getToken = (callback) => {
  redis.get(redisSetting.wechatTokenKey, (err, reply) => {
    if (err) return callback(err);
    callback(null, reply);
  })
};

const saveToken = (token, callback) => {
  redis.setex(redisSetting.wechatTokenKey, redisSetting.expiredTime, token.accessToken, callback);
};

const getTicketToken = (type, callback) => {
  redis.get(redisSetting.wechatTicketKey, (err, ticket) => {
    if (err) return callback(err);
    callback(null, ticket);
  })
};

const saveTicketToken = (type, ticketToken, callback) => {
  redis.setex(redisSetting.wechatTicketKey, redisSetting.expiredTime, ticketToken.ticket, err => {
    if (err) return callback(err);
    callback(null);
  })
};

module.exports = (() => {
  if (!weichatAPI) {
    weichatAPI = new API(wechatAccess.appid, wechatAccess.secret, getToken, saveToken);
    weichatAPI.registerTicketHandle(getTicketToken, saveTicketToken);
  }
  return weichatAPI;
})();