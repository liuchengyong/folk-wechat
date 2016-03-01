/**
 * Created by luowei on 3/1/16.
 */
'use strict';
const config = require('../config');
const wechatAccess = config.wechatAccess;
const redisSetting = config.redisSetting;
const OAuth = require('wechat-oauth');
const redisClient = require('./redisClient');

let oauthApi = new OAuth(wechatAccess.appid, wechatAccess.secret, (openid, callback) => {
  redisClient.get(openid, (err, reply) => {
    if (err) return callback(err);
    callback(null, JSON.parse(reply));
  });
}, (openid, token, callback) => {
  redisClient.setex(openid, redisSetting.expiredTime, JSON.stringify(token), callback);
});

module.exports = oauthApi;