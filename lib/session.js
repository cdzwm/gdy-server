// session module

// system module dependences
var EventEmitter = require('events').EventEmitter;

// project dependences
var message = require("./comm/message")
	,gdyutil = require("./comm/gdyutil")
	,handlers = require("./message_handler").handler;


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

function newSessionId (socket){
	var sha1_data = randSessionData(socket);
	var sessionid = gdyutil.sha1(sha1_data); // generate sessionid.
	return sessionid;
}

module.exports.newSession = function(socket){
	var sessionid = newSessionId(socket);
	while( getServer().hasSession(sessionid) ){
		 sessionid = newSessionId(socket);
	}

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
		,timer : setSessionTimer(2000)
		,sendMessage: sendMessage
		,receiveMessage : receiveMessage
		,end : endSession
		,getRooms : getRooms
		,increasePlayerCount : increasePlayerCount
		,getPlayerCount : getPlayerCount
	};
	
	session.socket.sessionid = sessionid;	// set id property for socket(s)
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
	var server = getServer();
	server.getSession(this.sessionid).data += data;
	module.exports.emit("parsemessage", server.getSession(this.sessionid));
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

function call_handler(fname, session, msg){
	var function_name = fname;
	
	if( !handlers.hasOwnProperty(fname)  
		|| !typeof(handlers[fname]) == "function" )
			function_name = 'f_default';

		handlers[function_name](session, msg);
}

// dispatch message
function processMessage(session){
	if( session.mq.length > 0){
		while( session.mq.length>0){
			message_cnt++;
			var msg = session.mq.shift();
			var fname = "f_" + msg.cmd.toLowerCase();
				call_handler(fname, session, msg);
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
	var server = getServer();
	var thissession =  server.getSession([this.sessionid]);
	if( server.hasSession(this.sessionid) ){
		// destroy session
		DBG_LOG("destroy session: " + thissession.sessionid);
		}
		// remove all listeners
		this.removeAllListeners();
		
		// clear timer
		clearTimeout(thissession.timer);

		// clear hello timer
		clearTimeout(thissession.helloTimer);

		// clear message queue
		server.clearMessageQueue(thissession.sessionid);

		// clear data buffer
		server.clearDataBuffer(thissession.sessionid);

		// clear handlers
		server.clearHandlers(thissession.sessionid);

		// clear this session
		server.removeSession(thissession.sessionid);
}

module.exports.on("timeout", function(session){
	DBG_LOG("session timeout");
});

function getRooms(){
	return getServer().getRooms();
}

function increasePlayerCount (){
		getServer().increasePlayerCount();
}

function getPlayerCount(){
	return getServer().getPlayerCount();
}
