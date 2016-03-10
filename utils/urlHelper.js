/**
 * Created by luowei on 3/2/16.
 */
const config = require('../config');

exports.createCouponUrl = (user, pid, mobile) => {
  return {
    url: `${config.apiUrl}${config.couponAPI}${pid}`,
    method: 'POST',
    form: {
      'openId': user.openid,
      'accessToken': user.access_token,
      'mobile': mobile
    }
  }
};

exports.createSocialUrl = (user) => {
  return {
    url: `${config.apiUrl}${config.socialAPI}`,
    method: 'POST',
    form: {
      type: 'WEIXIN_PUBLIC_ACCOUNT',
      socialId: user.openid,
      avatar: user.headimgurl || config.userDefaultImg,
      loginName: user.nickname,
      account: user.unionid,
      gender: user.sex === 1  ? 'MALE' : user.sex === 2 ? 'FEMALE' : 'SECRET'
    }
  };
};