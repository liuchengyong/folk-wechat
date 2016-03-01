/**
 * Created by luowei on 2/29/16.
 */
'use strict';
const wechatAccess = require('../config').wechatAccess;
const sha1 = require('sha1');

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
    appId: wechatAccess.appId
  });
  delete signObj.ticket;
  return signObj;
};