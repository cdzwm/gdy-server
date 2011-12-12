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
var DEBUG = typeof(process.env.GDY_DEBUG) != "undefined" ? (process.env.GDY_DEBUG == 0 ? false : true) : false;
var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();

var mq = require('./mq')
	,protocol = require('./protocol');

module.exports.Player = function(s){
	var a = 123;
	this.s = s;
	this.mq = mq.createMQ();
	this.data = "";
}

module.exports.on("msg", function(session){
	if( DEBUG )
		console.log("gdy - Debug:  Received message: " + session.data);

	protocol.getMessage(session);
});
