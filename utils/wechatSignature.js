/**
 * Created by luowei on 2/29/16.
 */
'use strict';
const sha1 = require('sha1');

const createNonceStr = () => Math.random().toString(36).substr(2, 15);

const createTimeStamp = () => parseInt(new Date().getTime() / 1000) + '';

const contactString = (args) => {
  return Object.keys(args)
    .sort()
    .map((key) => `${key.toLowerCase()}=${args[key]}`)
    .join('&');
};

exports.signature = (obj) => {
  let tmpObj = Object.assign(obj, {
    nonceStr: createNonceStr(),
    timestamp: createTimeStamp()
  });

  return Object.assign(tmpObj, {
    signature: sha1(contactString(tmpObj))
  })
};