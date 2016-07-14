/**
 * Created by luowei on 3/2/16.
 */
const config = require('../config');
function createUrl(config){
  return Object.assign({
    method:'POST',
    headers:{
      'osType':'WEB',
      'code':25
    }
  },config);
}


exports.createCouponUrl = (user, pid, mobile) => {
  return createUrl({
    url: `${config.apiUrl}${config.couponAPI}${pid}`,
    form: {
      'openId': user.openid,
      'accessToken': user.access_token,
      'mobile': mobile
    }
  });
};

exports.createSocialUrl = (user) => {
  return createUrl({
    url: `${config.apiUrl}${config.socialAPI}`,
    headers:{
      deviceId:'web123123123',
      osType:'WEB',
      code:25
    },
    form: {
      channel:'ZHIDIAN_WECHAT_H5',
      socialId: user.openid,
      loginName: encodeURIComponent(user.nickname),
      gender: user.sex === 1  ? 'MALE' : user.sex === 2 ? 'FEMALE' : 'SECRET',
      avatar: user.headimgurl || config.userHeadDefaultImg,
      type: 'WEIXIN_PUBLIC_ACCOUNT',
      account: user.unionid
    }
  });
};

exports.createOrderUrl = (user,answerId,price,subject,body) => {
  return createUrl({
    url: `${config.apiUrl}${config.orderAPI}`,
    form:{
      openid: user.openid,
      avatar: user.headimgurl || config.userDefaultImg,
      loginName: user.nickname,
      account: user.unionid,
      gender: user.sex === 1  ? 'MALE' : user.sex === 2 ? 'FEMALE' : 'SECRET',
      answerId: answerId,
      subject:subject,
      body:body,
      price: price
    }
  });

};