/**
 * Created by luowei on 3/4/16.
 */
'use strict';
const request = require('request');
const urlHelper = require('./urlHelper');

exports.proxyGetCoupon = (user, pid, mobile) => {
  return new Promise((resolve, reject) => {
    request(urlHelper.createCouponUrl(user, pid, mobile), (err, response, body) => {
      response.statusCode == '200' ? resolve(JSON.parse(body)) : reject({code: '502'});
    });
  });
};

exports.proxyPostUserInfo = (user) => {
  return new Promise((resolve, reject) => {
    request(urlHelper.createSocialUrl(user), (err, response, body) => {
      response.statusCode == '200' ? resolve(JSON.parse(body)) : reject('cannot post user info');
    });
  });
};