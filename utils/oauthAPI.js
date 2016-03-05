/**
 * Created by luowei on 3/1/16.
 */
'use strict';
const config = require('../config');
const wechatAccess = config.wechatAccess;
const redisSetting = config.redisSetting;
const OAuth = require('wechat-oauth');
const redis = require('./redisClient');

let oauthApi;

module.exports = (() => {
  if (!oauthApi) {
    oauthApi = new OAuth(wechatAccess.appid, wechatAccess.secret, (openid, callback) => {
      redis.get(openid, (err, reply) => {
        if (err) return callback(err);
        callback(null, JSON.parse(reply));
      });
    }, (openid, token, callback) => {
      redis.setex(openid, redisSetting.expiredTime, JSON.stringify(token), callback);
    });
  }
  return oauthApi;
})();