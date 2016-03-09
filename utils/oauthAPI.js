/**
 * Created by luowei on 3/1/16.
 */
'use strict';
const wechatAccess = require('../config').wechatAccess;
const OAuth = require('wechat-oauth');

let oauthApi;

module.exports = (() => {
  if (!oauthApi) {
    oauthApi = new OAuth(wechatAccess.appid, wechatAccess.secret);
  }
  return oauthApi;
})();