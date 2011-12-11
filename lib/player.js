/* 
module name: player
description:  player module file.
properties:
	id
	playerKey
	socket
	name
	nickname
	description
	sex
	level
	money
	lastLoginTime
	loginTimes
	game
	room
	table
	mq

methods:
	sendMessage

events:
	onHello
	onLogin
	onLoginSuccess
	onLoginFailed
	onDeal
	onReceiveMessage
	onBeginGame
	onEndGame
	onQuitGame
	onTimeout
	onLogout
*/

// GameUser class construction function.
var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();
var mq = require('./mq');

module.exports.Player = function(s){
	var a = 123;
	this.s = s;
	this.mq = mq.createMQ();
	this.data = "";
}

module.exports.on("msg", function(session){
	console.log("msg: " + session.id);
});
