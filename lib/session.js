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

module.exports.newSession = function(socket, protocol){

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
	while(session.callbacks.length > 0)
		session.callbacks.shift()();

	if( session.mq.length > 0){
		var msg = session.mq.shift();
		switch(msg.cmd){
			case "HELLO":
				clearTimeout(session.timer);
				if( session.state == "CONNECTED"){
					session.state = "LOGIN";
					session.socket.write(protocol.newMessage("HELLO_OK"));
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
					session.socket.write(protocol.newMessage("LOGIN_FAILED"));
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
	console.log(s.substring(s.length - 10) + ":" + msg.cmd);
}
