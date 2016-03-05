/**
 * Created by luowei on 2/29/16.
 */
'use strict';
const config = require('../config');
const wechatAccess = config.wechatAccess;
const jsApiList = config.jsApiList;
const sha1 = require('sha1');
const wechatAPI = require('./wechatAPI');
const oauthAPI = require('./oauthAPI');

const createNonceStr = () => Math.random().toString(36).substr(2, 15);

const createTimeStamp = () => parseInt(new Date().getTime() / 1000) + '';

const contactString = (args) => {
  return Object.keys(args)
    .sort()
    .map(key => `${key.toLowerCase()}=${args[key]}`)
    .join('&');
};

const signature = (signObj) => {
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

exports.promiseGetTicket = (url) => {
  return new Promise((resolve, reject) => {
    wechatAPI.getLatestTicket((err, reply) => {
      err ? reject('get ticket error') : resolve(signature({
        jsapi_ticket: reply.ticket,
        url: url
      }));
    })
  });
};

exports.promiseGetAccessToken = (code) => {
  return new Promise((resolve, reject) => {
    oauthAPI.getAccessToken(code, (err, accessToken) => {
      err ? reject('invalid code') : resolve( accessToken.data);
    })
  });
};