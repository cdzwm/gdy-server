var DEBUG = require('./debug').DEBUG;
var EventEmitter = require('events').EventEmitter,
		crypto = require('crypto');
module.exports = new EventEmitter();

var protocol = require('./protocol')
		,createPlayer = require('./player').createPlayer;

var sessions = {};

function sha1(input){
	var sha1 = crypto.createHash('sha1');
	sha1.update(input);
	return sha1.digest('hex');	
}

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
module.exports.newSession = function(socket, protocol){

	var sha1_data = socket.remoteAddress 
		+ ":" 
		+ socket.remotePort 
		+ Math.round(Math.random() * 9999999999) 
		+ (new Date()).getTime();

	var sessionid = sha1(sha1_data); // generate session's id.
	while( sessions.hasOwnProperty(sessionid) )
		sessionid = sha1(sha1_data);

	var session ={
		sessionid: sessionid
		,socket : socket
		,data : ""
		,msg_cnt : 0
		,mq : []
		,protocol: protocol
		,callbacks : []
		,ts : (new Date()).getTime()
	};
	
	sessions[sessionid] = session; // store session object to sessions
	socket.sessionid = sessionid;	// set id property for socket(s)
	protocol.on("processmessage", processMessage);
	
	socket.setEncoding("utf8"); // use utf8 for data encoding
	socket.on("data", receiveMessage);
	socket.on("close", cleanupSession);
	return session;
}

function receiveMessage(data){
	sessions[this.sessionid].data += data;
	sessions[this.sessionid].protocol.emit("parsemessage", sessions[this.sessionid]);
}

function processMessage(session){
	if( session.mq.length > 0){
		var msg = session.mq.shift();
		switch(msg.cmd){
			case "HELLO":
				if( session.msg_cnt == 1){
					session.socket.write(protocol.newMessage("HELLO_OK"));
				}
				else{
					session.socket.end();
				}
				// create a new user.
				session.player = createPlayer("player");
				break;
			default:
				defaultProcessMessage(session);
				break;
		}
	}
}

function cleanupSession(){
	
	if( sessions.hasOwnProperty(this.sessionid) ){
		// destroy session
		if( DEBUG ){
			console.log("destroy session: " + this.sessionid);
		}
		delete sessions[this.sessionid];
	}
}

function defaultProcessMessage(session){
	var s = session.sessionid;
	console.log(s.substring(s.length - 10) + ": unhandled message");
}