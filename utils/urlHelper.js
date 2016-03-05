/**
 * Created by luowei on 3/2/16.
 */
const config = require('../config');

exports.createCouponUrl = (user, pid) => {
  return {
    url: config.apiUrl + config.couponAPI + pid,
    method: 'POST',
    form: {
      'openId': user.openid,
      'accessToken': user.access_token
    }
  }
};