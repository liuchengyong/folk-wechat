/**
 * Created by luowei on 3/4/16.
 */
'use strict';
const request = require('request');
const urlHelper = require('./urlHelper');

exports.proxyGetCoupon = (accessToken, pid, mobile) => {
  return new Promise((resolve, reject) => {
    request(urlHelper.createCouponUrl(accessToken, pid, mobile), (err, response, body) => {
      response.statusCode == '200' ? resolve(JSON.parse(body)) : reject('cannot get info of coupon');
    });
  });
};