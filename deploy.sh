#!/bin/bash
ssh -i ~/.ssh/publish_rsa folk@101.200.122.163 bash -c "'
cd folk-wechat
git fetch --all  
git reset --hard origin/master 
git pull origin master
source ~/.nvm/nvm.sh 
npm install
netstat -ntpl | grep 3001 &> /dev/null
if [[ $? == 0 ]];then
    NODE_ENV=production pm2 reload /home/folk/folk-wechat/index.js -i 2 --name folk-wechat
else
    NODE_ENV=production pm2 start /home/folk/folk-wechat/index.js  -i 2 --name folk-wechat
fi
'"
