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
	var rand_session_data = socket.remoteAddress 
		+ ":" 
		+ socket.remotePort 
		+ Math.round(Math.random() * 9999999999) 
		+ (new Date()).getTime();
	return rand_session_data;
}

function newSessionId (socket){
	var rand_session_data = randSessionData(socket);
	var sessionid = gdyutil.sha1(rand_session_data);
	return sessionid;
}

module.exports.newSession = function(socket){
	var sessionid = newSessionId(socket);
	var server = getServer();
	while( server.hasSession(sessionid) ){
		 sessionid = newSessionId(socket);
	}

	var session ={
		sessionid: sessionid
		,socket : socket
		,data : ""
		,mq : []
		,server : server
		,state : "CONNECT"
		,helloTimer : null
		,currentRoom : null
		,currentTable : null
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
	
	module.exports.on("processMessage", processMessage);
	module.exports.on("parseMessage", parseMessage);

	session.socket.on("data", receiveMessage);
	session.socket.on("close", cleanupSession);
	session.socket.on("error", handleSocketError);

	return session;
}

// send message function
function sendMessage(msg){
	var ret = null;
	try{
		ret = this.socket.write(message.pack(msg), function(){
		});
	}
	catch(e){
		ret = false;
	}
	return ret;
}

// receive message data
function receiveMessage(data){
	var server = getServer();
	server.getSession(this.sessionid).data += data;
	module.exports.emit("parseMessage", server.getSession(this.sessionid));
}

// parse message from session message data buffer
function parseMessage(session){
	session.data = session.data.slice(message.parseMessage(session.data, session.mq)); // remove parsed messages.
	if( session.mq.length > 0)
		module.exports.emit("processMessage", session);
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

function setSessionTimer(delay){
	return setTimeout(function(){
		module.exports.emit("timeout", this);
	}, delay)
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
	session.endSession();
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
