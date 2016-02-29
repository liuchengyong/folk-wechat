var express = require('express');
var wechatAPI = require('./utils/wechatAPI');
var app = express();

app.get('/weixin/signature', (req, res) => {
  wechatAPI.getLatestToken((err, res) => {
    console.log(res);
  });
  wechatAPI.getLatestTicket((err, res) => {
    console.log(res);
  });
  wechatAPI.getTicket((err, res) => {
    console.log(res);
  });
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});