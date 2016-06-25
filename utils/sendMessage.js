/**
 *
 * Created by liuchengyong on 2016/06/24
 */

'use strict';
const config = require('../config');
const request = require('request');

/**
 * [sendTemplateMessage description] 发送模版信息
 * @param  {[type]} token  [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
exports.sendTemplateMessage = function(token,params){
	params.template_id = config.TemplateMessageList[params.type];
	params.url = "http://www.zhid58.com/downApp";
	delete params.type; 
	console.log(params);
	return new Promise((resolve, reject) => {
		request({
			url:`${config.sendTemplateMessage}${token}`,
			method: 'POST',
			json: params
		},(error, response, body) => {
			if(error){
				reject('request error');
			}else{
				resolve(body);
			}
		});
	});
};

/**
 * [sendMessage description]  发送消息
 * @param  {[type]} token  [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
exports.sendMessage = function(token,params){
	return new Promise((resolve, reject) =>{
		request({
			url:`${config.sendMessage}${token}`,
			method: 'POST',
			json: params
		},(error, response, body) => {
			if(error){
				reject('request error');
			}else{
	            resolve(body);
			}
		});
	});
}