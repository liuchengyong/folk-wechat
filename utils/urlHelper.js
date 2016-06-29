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
    form: {
      type: 'WEIXIN_PUBLIC_ACCOUNT',
      socialId: user.openid,
      avatar: user.headimgurl || config.userDefaultImg,
      loginName: user.nickname,
      account: user.unionid,
      gender: user.sex === 1  ? 'MALE' : user.sex === 2 ? 'FEMALE' : 'SECRET'
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