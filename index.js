'use strict';
const express = require('express');
const request = require('request');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
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
      ttl: 60 * 60 * 24 * 30
    }),
    resave: false,
    saveUninitialized: false,
    name: 'folk.id'
  }
));

app.use(morgan('short'));
app.use(bodyParser.json());

app.get('/api/wechat/config', (req, res) => {
  wechatHelper.promiseGetTicket(req.headers.referer)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).end(err);
    });
});

app.post('/api/wechat/coupon', (req, res) => {
  if (req.session.user) {
    proxyHelper.proxyGetCoupon(req.session.user, req.session.user.pid, req.body.mobile)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).end(err);
      })
  } else if (req.query.code) {
    wechatHelper.promiseGetAccessToken(req.query.code)
      .then(data => {
        req.session.user = data;
        req.session.user.pid = req.query.pid;
        wechatHelper.promisePostUserInfo(data.openid)
          .then(userInfo => {
            return proxyHelper.proxyPostUserInfo(userInfo);
          })
          .then(result => console.log(`record ${result.param.user.loginName} user info`))
          .catch(err => console.log(err));
        return proxyHelper.proxyGetCoupon(data, req.query.pid);
      })
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).end(err);
      });
  } else {
    res.status(403).end(oauthAPI.getAuthorizeURL(config.couponUrl, '1', 'snsapi_userinfo'))
  }
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port} !`);
});