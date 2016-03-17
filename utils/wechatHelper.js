/**
 * Created by luowei on 2/29/16.
 */
'use strict';
const config = require('../config');
const wechatAccess = config.wechatAccess;
const jsApiList = config.jsApiList;
const sha1 = require('sha1');
const oauthAPI = require('./oauthAPI');

const createNonceStr = () => Math.random().toString(36).substr(2, 15);

const createTimeStamp = () => parseInt(new Date().getTime() / 1000) + '';

const contactString = (args) => {
  return Object.keys(args)
    .sort()
    .map(key => `${key.toLowerCase()}=${args[key]}`)
    .join('&');
};

exports.signature = (signObj) => {
  Object.assign(signObj, {
    nonceStr: createNonceStr(),
    timestamp: createTimeStamp()
  });

  Object.assign(signObj, {
    signature: sha1(contactString(signObj)),
    appId: wechatAccess.appid,
    debug: wechatAccess.debug,
    jsApiList: jsApiList,
    timestamp: Number(signObj.timestamp)
  });

  delete signObj.jsapi_ticket;
  delete signObj.url;
  return signObj;
};


exports.promiseGetAccessToken = (code) => {
  return new Promise((resolve, reject) => {
    oauthAPI.getAccessToken(code, (err, accessToken) => {
      err ? reject('403') : resolve(accessToken.data);
    })
  });
};

exports.promisePostUserInfo = (openid) => {
  return new Promise((resolve, reject) => {
    oauthAPI.getUser(openid, (err, userInfo) => {
      err ? reject('post user info error') : resolve(userInfo);
    });
  });
};