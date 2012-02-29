// session module

// system module dependences
var EventEmitter = require('events').EventEmitter;

// project dependences
var message = require("./comm/message")
	,handlers = require("./message_handler").handler,
	gdyutil = require("./comm/gdyutil");

// Inherit from EventEmitter
module.exports = new EventEmitter();

var message_cnt = 0; // total count of messages received on the server
// exports functions
// Create a new session
function randSessionData(socket){
	var sha1_data = socket.remoteAddress 
		+ ":" 
		+ socket.remotePort 
		+ Math.round(Math.random() * 9999999999) 
		+ (new Date()).getTime();
	return sha1_data;
}

module.exports.newSessionId = function (socket){
	var sha1_data = randSessionData(socket);
	var sessionid = gdyutil.sha1(sha1_data); // generate sessionid.
	return sessionid;
}

module.exports.newSession = function(sessionid, socket, server){
	var session ={
		sessionid: sessionid
		,socket : socket
		,data : ""
		,mq : []
		,state : "CONNECT"
		,helloTimer : null
		,current_room : null
		,current_table : null
		,ts : (new Date()).getTime()
		,server : server
		,timer : setSessionTimer(2000)
		,sendMessage: sendMessage
		,receiveMessage : receiveMessage
		,end : endSession
		,getServerRooms : getServerRooms
	};
	
	session.socket.session = session;	// set id property for socket(s)
	session.socket.setEncoding("utf8"); // use utf8 for data encoding
	
	module.exports.on("processmessage", processMessage);
	module.exports.on("parsemessage", parseMessage);

	session.socket.on("data", receiveMessage);
	session.socket.on("close", cleanupSession);
	session.socket.on("error", handleSocketError);

	return session;
}

// send message function
function sendMessage(msg){
	try{
		var ret = this.socket.write(message.pack(msg), function(){
		});
	}
	catch(e){
		return false;
	}
	return true;
}

// receive message data
function receiveMessage(data){
	this.session.data += data;
	module.exports.emit("parsemessage", this.session);
}

// parse message from session message data buffer
function parseMessage(session){
	session.data = session.data.slice(message.parseMessage(session.data, session.mq)); // remove parsed messages.
	if( session.mq.length > 0)
		module.exports.emit("processmessage", session);
}

// handle socket error
function handleSocketError(err){
	DBG_LOG(err);
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

function setSessionTimer(interval){
	return setTimeout(function(){
		module.exports.emit("timeout", this);
	}, interval)
}

// disconnect session
function endSession(){
	DBG_LOG("session end");
	this.socket.end();
}

// cleaanup disconnected session
function cleanupSession(){
	/*
	if( server.sessions.hasOwnProperty(this.sessionid) ){
		// destroy session
		DBG_LOG("destroy session: " + this.sessionid);
		}
		// remove all listeners
		this.removeAllListeners();
		
		// clear timer
		clearTimeout(server.sessions[this.sessionid].timer);

		// clear hello timer
		clearTimeout(server.sessions[this.sessionid].helloTimer);

		// clear message queue
		server.sessions[this.sessionid].mq = [];

		// clear data buffer
		server.sessions[this.sessionid].data = "";

		// clear handlers
		server.sessions[this.sessionid].handlers=[];

		// clear this session
		delete server.sessions[this.sessionid];
*/
}

module.exports.on("timeout", function(session){
	DBG_LOG("session timeout");
});

function getServerRooms(){
	DBG_LOG(this.server.getServer().server_rooms);
}
