#!/bin/bash
git pull origin master
npm install
netstat -ntpl | grep 3000 &> /dev/null
if [[ $? == 0  ]];then
    NODE_ENV=production pm2 reload /home/folk/folk-wechat/index.js -i 2 --name folk-wechat
else
    NODE_ENV=production pm2 start /home/folk/folk-wechat/index.js  -i 2 --name folk-wechat
fi
