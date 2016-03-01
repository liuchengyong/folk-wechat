/**
 * Created by luowei on 2/29/16.
 */
'use strict';
const redis = require('redis');
const redisConfig = require('../config').redis;

let redisClient;
let createRedisServer = (redis, redisConfig) => {
  if (!redisClient) {
    redisClient = redis.createClient(redisConfig.port, redisConfig.host, {prefix: redisConfig.prefix});

    redisClient.on('error', (err) => {
      console.log("Error " + err);
    });

    redisClient.on('ready', () => {
      console.log('redis is ready!');
    });
  }
  return redisClient;
};

module.exports = createRedisServer(redis, redisConfig);