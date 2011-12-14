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
var DEBUG = require('./debug').DEBUG;
var EventEmitter = require('events').EventEmitter,
		crypto = require('crypto');
module.exports = new EventEmitter();

module.exports.createPlayer = function(name){
	var player = {
		name : name
		,level : 0
		,sex : ""
	};
	if( DEBUG )
		console.log("create player " + name);
	return player;
}