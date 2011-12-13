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

var protocol = require('./protocol');

var sessions = {};

module.exports.on("msg", function(session){
	if( DEBUG )
		console.log("gdy - Debug:  Received message: " + session.data);

	protocol.parseMessage(session);
});

// Usage:  
//		newSession(s)
//
// Input:  
//		s		a socket
//
// Output: 
//		none.
//
// External references:  
//		server.sessions
//
// Description: 
//		1. create a session object.
//		2. create a id, and assign the session object to sessions[id].
//		3.  assign id to s.id

module.exports.newSession = function(s){
	
	function sha1(input){
		var sha1 = crypto.createHash('sha1');
		sha1.update(input);
		return sha1.digest('hex');	
	}

	var sha1_data = s.remoteAddress 
		+ ":" 
		+ s.remotePort 
		+ Math.round(Math.random() * 9999999999) 
		+ (new Date()).getTime();

	var session ={
		socket : s
		,data : ""
		,mq : []
		,ts : (new Date()).getTime()
	};
	
	var id = sha1(sha1_data); // generate session's id.
	sessions[id] = session; // store session object to sessions
	s.id = id;	// set id property for socket(s)

	s.setEncoding("utf8"); // use utf8 for data encoding
	s.on("data", onReceiveMessage); // Listenning for data event
	s.on("close", onClose);
	s.on("error", onError);
}

// Receive input message data
function onReceiveMessage(data){
	sessions[this.id].data += data; // store data to the corrposding session's data buffer.
	module.exports.emit("msg", sessions[this.id]); // emit "msg" event for player to process messages.
}

function onClose(){
	delete sessions[this.id]; // clear disconnected session
}

function onError(e){
	consoel.log(e);
}

module.exports.getSessions = function(){
	return sessions;
}
