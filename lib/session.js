// session module

// system module dependences
var EventEmitter = require('events').EventEmitter,
		crypto = require('crypto');

// project dependences
var message = require("./comm/message")
	,handlers = require("./message_handler").handler;

// Inherit from EventEmitter
module.exports = new EventEmitter();

// Hancle events
module.exports.on("processmessage", processMessage);
module.exports.on("parsemessage", parseMessage);

var message_cnt = 0; // total count of messages received on the server

// exports functions
// Create a new session
module.exports.newSession = function(socket){
	var sha1_data = socket.remoteAddress 
		+ ":" 
		+ socket.remotePort 
		+ Math.round(Math.random() * 9999999999) 
		+ (new Date()).getTime();

	var sessionid = sha1(sha1_data); // generate sessionid.
	while( _server.sessions.hasOwnProperty(sessionid) )
		sessionid = sha1(sha1_data);

	var session ={
		sessionid: sessionid
		,socket : socket
		,data : ""
		,mq : []
		,state : "CONNECT"
		,ts : (new Date()).getTime()
		,timer : 	setTimeout(function(){
							session.end();
							console.log("session timeout");
						}, 2000)
		,helloTimer : null
		,sendMessage: sendMessage
		,end : sessionEnd
	};
	
	_server.sessions[sessionid] = session; // store session object to sessions
	socket.sessionid = sessionid;	// set id property for socket(s)

	socket.setEncoding("utf8"); // use utf8 for data encoding
	socket.on("data", receiveMessage);
	socket.on("close", cleanupSession);
	socket.on("error", handleSocketError);
	socket.on("drain", onDrain);
	return session;
}

// genergate sha1 function
function sha1(input){
	var sha1 = crypto.createHash('sha1');
	sha1.update(input);
	return sha1.digest('hex');
}

// receive message data
function receiveMessage(data){
	_server.sessions[this.sessionid].data += data;
	module.exports.emit("parsemessage", _server.sessions[this.sessionid]);
}

// dispatch message
function processMessage(session){
	if( session.mq.length > 0){
		while( session.mq.length>0){
			message_cnt++;
			var msg = session.mq.shift();
			var fname = "f_" + msg.cmd.toLowerCase();
			if( handlers.hasOwnProperty(fname)  && typeof(handlers[fname]) == "function" ){
				handlers[fname](session, msg);
			}
			else{
				handlers["f_default"](session, msg);
			}
		}
	}
}

// cleaanup disconnected session
function cleanupSession(){
	
	if( _server.sessions.hasOwnProperty(this.sessionid) ){
		// destroy session
		DBG_LOG("destroy session: " + this.sessionid);
		}
		// remove all listeners
		this.removeAllListeners();
		
		// clear timer
		clearTimeout(_server.sessions[this.sessionid].timer);

		// clear hello timer
		clearTimeout(_server.sessions[this.sessionid].helloTimer);

		// clear message queue
		_server.sessions[this.sessionid].mq = [];

		// clear data buffer
		_server.sessions[this.sessionid].data = "";

		// clear handlers
		_server.sessions[this.sessionid].handlers=[];

		// clear this session
		delete _server.sessions[this.sessionid];
}

// handle socket error
function handleSocketError(err){
	DBG_LOG(err);
}

// send message function
function sendMessage(msg){
	try{
		var ret = this.socket.write(message.pack(msg), function(){
			DBG_LOG("i", "write ok");
		});
	}
	catch(e){
		return false;
	}
	return true;
}

// disconnect session
function sessionEnd(){
	DBG_LOG("session end");
	this.socket.end();
}

// parse message from session message data buffer
function parseMessage(session){
	session.data = session.data.slice(message.parseMessage(session.data, session.mq)); // remove parsed messages.
	if( session.mq.length > 0)
		module.exports.emit("processmessage", session);
}

function onDrain(){
	DBG_LOG("i", "onDrain");
}
