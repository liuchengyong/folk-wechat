'use strict';
const express = require('express');
const request = require('request');
const session = require('express-session');
const bodyParser = require('body-parser');
const RedisStore = require('connect-redis')(session);
const config = require('./config');
const urlHelper = require('./utils/urlHelper');
const redis = require('./utils/redisClient');
const proxyHelper = require('./utils/proxyHelper');
const wechatHelper = require('./utils/wechatHelper');
let wechatAPI = require('./utils/wechatAPI');
let oauthAPI = require('./utils/oauthAPI');
let app = express();

app.use(session({
    secret: config.sessionSecret,
    store: new RedisStore({
      client: redis,
      //todo need to recompute ttl time from wechat session time
      ttl: 6000
    }),
    resave: false,
    saveUninitialized: false,
    name: 'folk.id'
  }
));

app.use(bodyParser.json());

app.get('/api/wechat/config', (req, res) => {
  if (req.session.user) {
    Promise.all([
        wechatHelper.promiseGetTicket(req.headers.referer),
        proxyHelper.proxyGetCoupon(req.session.user, req.session.user.pid)
      ])
      .then(data => {
        res.header({vary: 'Accept'}).json({sdkConfig: data[0], coupon: data[1]});
      })
      .catch(err => {
        res.status(500).end(err);
      });
  } else if (req.query.code) {
    //todo need to release accessToken from redis
    wechatHelper.promiseGetAccessToken(req.query.code)
      .then(data => {
        req.session.user = data;
        req.session.user.pid = req.query.pid;
        return Promise.all([
          wechatHelper.promiseGetTicket(req.headers.referer),
          proxyHelper.proxyGetCoupon(data, req.query.pid)
        ]);
      })
      .then(data => {
        res.header({vary: 'Accept'}).json({sdkConfig: data[0], coupon: data[1]});
      })
      .catch(err => {
        res.status(500).end(err);
      });
    //todo need to get user information
    //oauthAPI.getUser(accessToken.data.openid, function(err, userInfo) {
    //  if (err) {
    //    console.log(err)
    //  }
    //});

  } else {
    res.status(400).end('needed code');
  }
});

app.get('/api/wechat/oauth', (req, res) => {
  res.redirect(oauthAPI.getAuthorizeURL(config.couponUrl, '1', 'snsapi_userinfo'))
});

app.post('/api/wechat/coupon', (req, res) => {
  if (req.session.user) {
    proxyHelper.proxyGetCoupon(req.session.user, req.query.pid || req.session.pid, req.body.mobile)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).end(err);
      })
  } else {
    res.status(401).end('unAuthenticated');
  }
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port} !`);
});