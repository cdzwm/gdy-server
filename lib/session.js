//	onHello
//	onLogin
//	onLoginSuccess
//	onLoginFailed
//	onDeal
//	onReceiveMessage
//	onBeginGame
//	onEndGame
//	onQuitGame
//	onTimeout
//	onLogout

var EventEmitter = require('events').EventEmitter,
		crypto = require('crypto');
module.exports = new EventEmitter();

var message = require("../deps/comm/message")
	,createPlayer = require('./player').createPlayer
	,protocol = require("./protocol");

var sessions = {}
	,callbacks={};

callbacks["f_hello"] = function(msg){
	if( DEBUG )
		console.log("receive message: " + msg.cmd);
}

callbacks["f_login"] = function(msg){
	if( DEBUG )
		console.log("receive message: " + msg.cmd);
}

callbacks["f_msg"] = function(msg){
	if( DEBUG )
		console.log("receive message: " + msg.cmd);
}

function sha1(input){
	var sha1 = crypto.createHash('sha1');
	sha1.update(input);
	return sha1.digest('hex');	
}

module.exports.newSession = function(socket){

	var sha1_data = socket.remoteAddress 
		+ ":" 
		+ socket.remotePort 
		+ Math.round(Math.random() * 9999999999) 
		+ (new Date()).getTime();

	var sessionid = sha1(sha1_data); // generate sessionid.
	while( sessions.hasOwnProperty(sessionid) )
		sessionid = sha1(sha1_data);

	var session ={
		sessionid: sessionid
		,socket : socket
		,data : ""
		,mq : []
		,protocol: protocol
		,state : "CONNECTED"
		,callbacks : []
		,ts : (new Date()).getTime()
		,timer : 	setTimeout(function(){
							session.socket.end();
							console.log("session timeout");
						}, 2000)
		,sendMessage:  function(msg){
							if( DEBUG )
								console.log(msg);
						}
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
		var fname = "f_" + msg.cmd.toLowerCase();
		if( callbacks.hasOwnProperty(fname)  && typeof(callbacks[fname]) == "function" )
			callbacks[fname](msg);

		switch(msg.cmd){
			case "HELLO":
				clearTimeout(session.timer);
				if( session.state == "CONNECTED"){
					session.state = "LOGIN";
					session.socket.write(message.newMessage("HELLO_OK"));
					session.timer = setTimeout(function(){
						console.log("Session timeout.");
						session.socket.end();
					}, 1000);
				}
				else{
					session.socket.end();
				}
				break;
			case "LOGIN":
				// create a new user.
				clearTimeout(session.timer);
				if( session.state == "LOGIN" ){
					session.player = createPlayer("player");
				}
				else{
					session.socket.write(message.newMessage("LOGIN_FAILED"));
				}
				break;
			default:
				session.mq.unshift(msg);
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
	var msg = session.mq.shift();
	if( DEBUG ){
		console.log(s.substring(s.length - 10) + ":" + msg.cmd);
	}
}
