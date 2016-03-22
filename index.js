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

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/api/wechat/config', (req, res) => {
  wechatAPI.folkGetLastTicket()
    .then(ticket => {
      res.json(wechatHelper.signature({
        jsapi_ticket: ticket,
        url: req.headers.referer
      }));
    })
    .catch(err => {
      console.log(err);
      res.status(500).end(err);
    });
});

app.post('/api/wechat/coupon', (req, res) => {
  if (req.session.user) {
    proxyHelper.proxyGetCoupon(req.session.user, req.query.pid || req.session.user.pid, req.body.mobile)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).json(err);
      })
  } else if (req.query.code) {
    wechatHelper.promiseGetAccessToken(req.query.code)
      .then(data => {
        req.session.user = data;
        req.session.user.pid = req.query.pid;
        //wechatHelper.promisePostUserInfo(data.openid)
        //  .then(userInfo => {
        //    return proxyHelper.proxyPostUserInfo(userInfo);
        //  })
        //  .then(result => console.log(`record ${result.param.user.loginName} user info`))
        //  .catch(err => console.log(err));
        return proxyHelper.proxyGetCoupon(data, req.query.pid);
      })
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  } else if (req.query.pid) {
    //todo need to merge all the query parameters
    res.status(200).json({
      code: '403',
      href: oauthAPI.getAuthorizeURL(`${config.domain}/coupon?pid=${req.query.pid}`, '1', 'snsapi_userinfo')
    })
  } else {
    res.status(200).json({code: '401'});
  }
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port} !`);
});