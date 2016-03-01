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
  wechatAPI.getLatestTicket((err, reply) => {
    if (err) {
      res.statusCode(500).end(err);
    } else {
      let config = wechatAPI.signature({
        jsapi_ticket: reply.ticket,
        url: 'http://wetest.zhid58.com/coupon'
      });
      res.json(config);
    }
  });
});

app.get('/weixin/oauth', (req, res) => {
  res.redirect(oauthAPI.getAuthorizeURL('http://wetest.zhid58.com/', '1', 'snsapi_userinfo'))
});


app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port} !`);
});