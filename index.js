var wechatAPI = require('./utils/wechatAPI');
var express = require('express');
var app = express();

app.get('/weixin/signature', (req, res) => {
  wechatAPI.getLatestTicket((err, ticket) => {
    if (err) {
      res.statusCode(500).end(err);
    } else {
    }
  });
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});