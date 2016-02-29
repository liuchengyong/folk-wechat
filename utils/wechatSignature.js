/**
 * Created by luowei on 2/29/16.
 */
'use strict';

exports.createNonceStr = () => Math.random().toString(36).substr(2, 15);

exports.createTimeStamp = () => parseInt(new Date().getTime() / 1000) + '';

exports.contactString = (args) => {
  return Object.keys(args)
    .sort()
    .map((key) => `${key.toLowerCase()}=${args[key]}`)
    .join('&');
};