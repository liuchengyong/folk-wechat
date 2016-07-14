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
let sendMessage =  require('./utils/sendMessage');
let app = express();


app.use(session({
    secret: config.sessionSecret,
    store: new RedisStore({
      client: redis,
      ttl: 60 * 100
    }),
    resave: false,
    saveUninitialized: false,
    name: 'folk.id'
  }
));

app.use(morgan('dev'));
let JOSNPARSER = bodyParser.json(),
    URLENCODED = bodyParser.urlencoded({ extended: true });

// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//设置跨域访问
if(config.environment != 'production'){
  app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
  });
}

//FreeCoupon Coupon Appoint
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

//获取购物券
app.post('/api/wechat/coupon', (req, res) => {
  if (req.session.user) {
    proxyHelper.proxyGetCoupon(req.session.user, req.query.pid || req.session.user.pid, req.body.mobile)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(200).json(err);
      })
  } else if (req.query.code) {
    wechatHelper.promiseGetAccessToken(req.query.code)
      .then(data => {
        req.session.user = data;
        req.session.user.pid = req.query.pid;
        return proxyHelper.proxyGetCoupon(data, req.query.pid);
      })
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(200).json(err);
      });
  } else if (req.query.pid) {
    //todo need to merge all the query parameters 99A86273-DDF2-4A70-9FC3-733F1ABABD7D
    res.status(200).json({
      code: '403',
      href: oauthAPI.getAuthorizeURL(`${config.domain}/coupon?pid=${req.query.pid}`, '1', 'snsapi_userinfo')
    })
  } else {
    res.status(200).json({code: '401'});
  }
});

//https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx254dcfe98729df4b&redirect_uri=http%3A%2F%2Fwww.zhid58.com%2Fanswer%2F6711C033-D2BC-44C8-A6E9-DF47311E8DD5&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect
//获取微信用户的基本信息
app.post('/api/wechat/base',URLENCODED,(req,res) => {
  if(req.session.user){
    res.json(req.session.user);
  }else if(req.query.code){ //获取了微信页面的code
    wechatHelper.promiseGetAccessToken(req.query.code)
    .then(data => wechatHelper.promisePostUserInfo(data.openid))
    .then(data => proxyHelper.proxyPostUserInfo(data))
    .then(data =>{
      req.session.user = data.user;
      res.json(data.user);
    })
    .catch(err => {
      res.status(200).json(err);
    });
  }else{
    res.status(200).json({
      code: '403',
      href: oauthAPI.getAuthorizeURL(`${req.body.url}`, '1', 'snsapi_userinfo')
    })
  }
});

app.post('/api/v1/weixin/template/message/send',JOSNPARSER,(req, res) => {
  wechatAPI.folkGetLastToken()
    .then(token => {
      return sendMessage.sendTemplateMessage(token,req.body);
    })
    .then(data =>{
      data.msg = data.errcode == 0 ? 'SUCCESS':'微信模板消息发送失败了';
      res.json(data);
    })
    .catch(err => {
      res.status(500).end(err);
    });
});

app.post('/api/v1/weixin/message/send',JOSNPARSER,(req, res) => {
  wechatAPI.folkGetLastToken()
    .then(token => {
      return sendMessage.sendMessage(token,req.body);
    }).then(data => {
      data.msg = data.errcode == 0 ? 'SUCCESS':'微信模板消息发送失败了';
      res.json(data);
    })
    .catch(err => {
      res.status(500).end(err);
    });
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port} !`);
});