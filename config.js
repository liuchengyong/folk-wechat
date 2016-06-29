/**
 * Created by luowei on 2/29/16.
 */
'use strict';
let baseConfig = {
  qiniu: {
    access_key: 'OSdX1ifRSsfMYxJGQPH95BkPPAIRI2sSKWfQ-153',
    secret_key: 'GserwkO4mA7P3VYtS51frK6OhaC9U0xSDcvV3Dwd',
    bucket: 'luoteng',
    base_url: 'http://7xl9qr.com1.z0.glb.clouddn.com/'
  },
  weixinTemplate: {
    pay_success: '8Nx6veHHWirb-x2HdoVFB1EO7LLk9bFbH229HKvbAK4',
    order_status: 'KdCt8TKeAwvy7iN82ZTpDZhqUyOGaOxZXeq1_6hKHY0',
    hongbao: 'JH5cSK32BFt6SCUFvwzynD0TmHTZ4KnYZRY3JJ8nv1k'
  },
  jsApiList: [
    'onMenuShareTimeline', 
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareWeibo',
    'onMenuShareQZone'
    ],
  sessionSecret: 'folkh5_f%95te*uw*r3cr5k59rmplz4d1(t*oe$u@#ct1!ytnt5133e_o',
  redisSetting: {
    wechatTokenKey: 'wechat-token',
    wechatTicketKey: 'wechat-ticket',
    expiredTime: 60 * 100
  },
  couponAPI: '/api/v1/coupon/grab/',
  socialAPI: '/api/v1/user/login/social',
  orderAPI:'api/v1/fund', 
  payAPI:'api/v1/payment',
  userDefaultImg: 'http://7xl9qr.com1.z0.glb.clouddn.com/a8dbb05530fa97efb02b9e46568b5d45',
  wechatTicket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=',
  wechatToken: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
  sendMessage:'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=',
  sendTemplateMessage:'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='
};

let config = {
  'dev': {
    port: 3000,
    apiUrl: 'http://test.zhid58.com:8080',
    domain: 'http://wetest.zhid58.com',
    // redis 配置，默认是本地
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
      prefix: 'folk:'  
    },
    authCookieName: 'slarkh5_',
    wechatAccess: {
      appid: 'wx490b6bfcf951da67',
      secret: 'a82772ce935e585536f4e56a1bfe1e55',
      debug: false
    },
    TemplateMessageList:{
      FreeCoupon:'qQc2Y0xIg__fMLux1v-0oMLUX-staRojFqJbjliqXz8',
      Coupon:'qQc2Y0xIg__fMLux1v-0oMLUX-staRojFqJbjliqXz8',
      Appoint:'_Ba3Q-mENktBo816khYnzIf8TwX5ZHQfKAQy-juCGC8'
    }
  },
  'test': {
    port: 3000,
    apiUrl: 'http://test.zhdi58.com:8080',
    domain: 'http://wetest.zhid58.com',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 1,
      prefix: 'folk:'
    },
    authCookieName: 'folkh5_',
    wechatAccess: {
      appid: 'wx490b6bfcf951da67',
      secret: 'a82772ce935e585536f4e56a1bfe1e55',
      debug: true
    },
    TemplateMessageList:{
      FreeCoupon:'qQc2Y0xIg__fMLux1v-0oMLUX-staRojFqJbjliqXz8',
      Coupon:'qQc2Y0xIg__fMLux1v-0oMLUX-staRojFqJbjliqXz8',
      Appoint:'_Ba3Q-mENktBo816khYnzIf8TwX5ZHQfKAQy-juCGC8'
    }
  },
  'production': {
    port: 3001,
    apiUrl: 'http://10.46.167.86:8080',
    domain: 'http://www.zhid58.com',
    environment:'production',
    redis: {
      host: '9b2e6b1d7bcd4bd0.m.cnbja.kvstore.aliyuncs.com',
      port: 6379,
      db: 0,
      prefix: 'folk:',
      password: '9b2e6b1d7bcd4bd0:LuotengPassw0rd'
    },
    authCookieName: 'folkh5_',
    wechatAccess: {
      appid: 'wx254dcfe98729df4b',
      secret: 'e3e28c51fb45d31bb1ae70c4c76afe26',
      debug: false
    },
    TemplateMessageList:{
      FreeCoupon:'JH5cSK32BFt6SCUFvwzynD0TmHTZ4KnYZRY3JJ8nv1k',
      Coupon:'JH5cSK32BFt6SCUFvwzynD0TmHTZ4KnYZRY3JJ8nv1k',
      Appoint:'WpDzCtSceE74vUwegg3XPRoP6cO12uv0tfZWhGmvMKc'
    }
  }
};

module.exports = Object.assign(baseConfig, config[process.env.NODE_ENV || 'dev'] || config.dev);
