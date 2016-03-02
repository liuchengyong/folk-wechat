'use strict';
const express = require('express');
const request = require('request');
const config = require('./config');
const helper = require('./utils/helper');
let wechatAPI = require('./utils/wechatAPI');
let oauthAPI = require('./utils/oauthAPI');
let app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/wechat/config', (req, res) => {
  if (req.query.code) {
    oauthAPI.getAccessToken(req.query.code, function(err, accessToken) {
      if (err) {
        res.status(400).end('invalid code');
      } else {
        wechatAPI.getLatestTicket((err, reply) => {
          if (err) {
            res.status(500).end('get ticket error');
          } else {
            let sdkConfig = wechatAPI.signature({
              jsapi_ticket: reply.ticket,
              url: req.headers.referer
            });
            request(helper.createCouponUrl(accessToken, req.query.pid), (err, response, body) => {
              if (response.statusCode == '200') {
                res.json({sdkConfig: sdkConfig, coupon: JSON.parse(body)});
              } else {
                res.status(500).end('cannot get info of coupon');
              }
            });
          }
        });
        //oauthAPI.getUser(accessToken.data.openid, function(err, userInfo) {
        //  if (err) {
        //    console.log(err)
        //  }
        //});
      }
    });
  } else {
    res.status(400).end('needed code');
  }
});

app.get('/wechat/oauth', (req, res) => {
  res.redirect(oauthAPI.getAuthorizeURL(config.couponUrl, '1', 'snsapi_userinfo'))
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port} !`);
});