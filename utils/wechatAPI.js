/**
 * Created by luowei on 2/29/16.
 */
'use strict';
const config = require('../config');
const wechatAccess = config.wechatAccess;
const redisSetting = config.redisSetting;
const redis = require('./redisClient');
const API = require('wechat-api');
const request = require('request');

let weichatAPI = {};

const saveToken = (token, callback) => {
  console.log('save token ', token);
  redis.setex(redisSetting.wechatTokenKey, redisSetting.expiredTime, token.accessToken, callback);
};


weichatAPI.folkGetLastToken = function() {
  return new Promise((resolve, reject) => {
    redis.get(redisSetting.wechatTokenKey, (err, reply) => {
      if (err) {
        reject('get token error');
      } else {
        if (reply) {
          resolve(reply);
        } else {
          request(`${config.wechatToken}&appid=${config.wechatAccess.appid}&secret=${config.wechatAccess.secret}`,
            (err, res, body) => {
              if (err) {
                console.log(err);
                reject('request token error');
              } else {
                let token = JSON.parse(body);
                redis.setex(redisSetting.wechatTokenKey, redisSetting.expiredTime, token.access_token);
                resolve(token.access_token);
              }
            });
        }
      }
    });
  })
};

weichatAPI.folkGetLastTicket = function() {
  let self = this;
  return new Promise((resolve, reject) => {
    redis.get(redisSetting.wechatTicketKey, (err, ticket) => {
      if (err) {
        reject('get ticket error');
      } else {
        if (ticket) {
          resolve(ticket);
        } else {
          self.folkGetLastToken()
            .then(token => {
              request(`${config.wechatTicket}${token}`, (err, res, body) => {
                if (err) {
                  reject('get ticket fail');
                } else {
                  let ticketToken = JSON.parse(body);
                  redis.setex(redisSetting.wechatTicketKey, redisSetting.expiredTime, ticketToken.ticket, err => {
                    if (err) {
                      console.log(err);
                    }
                  });
                  resolve(ticketToken.ticket);
                }
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    });
  });
};

module.exports = weichatAPI;