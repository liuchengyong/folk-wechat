'use strict';
const express = require('express');
const config = require('./config');
var wechatAPI = require('./utils/wechatAPI');
var app = express();

app.get('/weixin/signature', (req, res) => {
  wechatAPI.getLatestTicket((err, reply) => {
    if (err) {
      res.statusCode(500).end(err);
    } else {
      let config = wechatAPI.signature({
        ticket: reply.ticket,
        url: 'http://localhost:8000/coupon'
      });
      res.json(config);
    }
  });
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port} !`);
});