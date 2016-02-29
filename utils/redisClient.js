/**
 * Created by luowei on 2/29/16.
 */
var redis = require('redis');
var redisConfig = require('../config').redis;
var redisClient = redis.createClient(redisConfig.port, redisConfig.host, {prefix: redisConfig.prefix});

redisClient.on('error', function (err) {
  console.log("Error " + err);
});

redisClient.on('ready', function() {
  console.log('redis is ready!');
});

module.exports = redisClient;