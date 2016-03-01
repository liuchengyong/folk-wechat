'use strict';
const express = require('express');
const config = require('./config');
let wechatAPI = require('./utils/wechatAPI');
let oauthAPI = require('./utils/oauthAPI');
let app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/weixin/config', (req, res) => {
  if (req.query.code) {
    oauthAPI.getAccessToken(req.query.code, function(err, accessToken) {
      if (err) {
        console.log(err);
        res.status(400).end('invalid code');
      } else {
        oauthAPI.getUser(accessToken.data.openid, function(err, userInfo) {
          if (err) {
            console.log(err);
            res.status(400).end('invalid openid');
          } else {
            wechatAPI.getLatestTicket((err, reply) => {
              if (err) {
                res.status(500).end('get ticket error');
              } else {
                let sdkConfig = wechatAPI.signature({
                  jsapi_ticket: reply.ticket,
                  url: req.headers.referer
                });
                res.json(sdkConfig);
              }
            });
          }
        });
      }
    });
  }
});

app.get('/weixin/oauth', (req, res) => {
  res.redirect(oauthAPI.getAuthorizeURL(config.couponUrl, '1', 'snsapi_userinfo'))
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port} !`);
});