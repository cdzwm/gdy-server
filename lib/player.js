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
var mq = require('./mq');
exports.Player = function(s){
	this.s = s;
	this.mq = mq.createMQ();
}

// dump 
exports.Player.prototype.dumpPlayer =  function (){
}
