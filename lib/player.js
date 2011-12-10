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
module.exports.Player = function(s, t){
	var a = 123;
	this.s = s;
	this.mq = mq.createMQ();
	this.data = "";
	
	s.setEncoding("utf8");
	t[calcPlayerKey(s)] = this;
	s.player = this;
	s.on("data", onReceiveData);
}

function calcPlayerKey(s){
	//TODO: use md5, header, time to generate player key.
	return s.remoteAddress + ':' + s.remotePort;
}

function onReceiveData(data){
	this.player.data += data;
//	console.log(data);
}
