var express = require('express');
var wechatAPI = require('./utils/wechatAPI');
var app = express();

app.get('/weixin/signature', function (req, res) {
  wechatAPI.getLatestToken(function(err, res) {
    console.log(res);
  });
  wechatAPI.getLatestTicket(function(err, res) {
    console.log(res);
  });
  wechatAPI.getTicket(function(err, res) {
    console.log(res);
  });
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});