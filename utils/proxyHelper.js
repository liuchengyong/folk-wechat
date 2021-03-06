/**
 * Created by luowei on 3/4/16.
 */
'use strict';
const request = require('request');
const urlHelper = require('./urlHelper');

exports.proxyGetCoupon = (user, pid, mobile) => {
  return new Promise((resolve, reject) => {
    request(urlHelper.createCouponUrl(user, pid, mobile), (err, response, body) => {
      response && response.statusCode == '200' ? resolve(JSON.parse(body)) : reject({code: '502'});
    });
  });
};

exports.proxyPostUserInfo = (user,deviceId) => {
  return new Promise((resolve, reject) => {
    let res = request(urlHelper.createSocialUrl(user,deviceId), (err, response, body) => {
      response.statusCode == '200' ? resolve({resilts:JSON.parse(body),user:user}) : reject({msg:'cannot post user info'});
    });
  });
};

exports.getDeviceId = (req) => {
  let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
  return JSON.stringify({'userAgent':req.headers['user-agent'],Ip:ip});
}