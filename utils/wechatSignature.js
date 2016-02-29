/**
 * Created by luowei on 2/29/16.
 */
'use strict';
var sha1 = require('sha1');

exports.createNonceStr = () => Math.random().toString(36).substr(2, 15);

exports.createTimeStamp = () => parseInt(new Date().getTime() / 1000) + '';

exports.contactString = (args) => {
  return Object.keys(args)
    .sort()
    .map((key) => `${key.toLowerCase()}=${args[key]}`)
    .join('&');
};

exports.signature = (msg) => sha1(msg);