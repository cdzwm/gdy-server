// system module dependences
var EventEmitter = require('events').EventEmitter;

// project dependences
var message = require("./comm/message")
	,gdyutil = require("./comm/gdyutil")
	,handlers = require("./message_handler").handler;

//generate random data for creating sessionid
function randSessionData(socket){
	var rand_session_data = socket.remoteAddress 
		+ ":" 
		+ socket.remotePort 
		+ Math.round(Math.random() * 9999999999) 
		+ (new Date()).getTime();

	return rand_session_data;
}

//generate random sessionid
function newSessionId (socket){
	var rand_session_data = null
		,sessionid = null
		,server = getServer();;
	
	do{
		rand_session_data = randSessionData(socket);
		sessionid = gdyutil.sha1(rand_session_data);
	}while( server.hasSession(sessionid) )

	return sessionid;
}

// exports functions
// Create a new session
module.exports.newSession = function(socket){
	
	// Inherit from EventEmitter for handling events.
	var session = new EventEmitter();
	var sessionid = newSessionId(socket);

	socket.setEncoding("utf8"); // use utf8 for data encoding
	socket.sessionid = sessionid;	// set id property for socket(s)

	// listen events on socket
	socket.on("data", receiveMessage);
	socket.on("close", cleanupSession);
	socket.on("error", handleSocketError);

	// setup session object properties
	session.sessionid = sessionid;
	session.socket = socket;
	session.data = "";
	session.mq = [];
	session.state = "CONNECT";
	session.helloTimer = null;
	session.currentRoom = null;
	session.currentTable = null;
	session.ts = (new Date()).getTime();
	session.timer = setSessionTimer(session, 2000);
	session.sendMessage = sendMessage;
	session.end = endSession;
	session.appendData = appendData;

	// start connection timer
	session.on("timeout", function(){
		DBG_LOG("session timeout");
		session.end();
	});

	// listen session events.
	session.on("parseMessage", parseMessage);
	session.on("processMessage", processMessage);

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
	var session = server.getSession(this.sessionid);
	session.appendData(data);
	session.emit("parseMessage");
}

// parse message from session message data buffer
function parseMessage(){
	this.data = this.data.slice(message.parseMessage(this.data, this.mq)); // remove parsed messages.
	if( this.mq.length > 0)
		this.emit("processMessage");
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
function processMessage(){
	if( this.mq.length > 0){
		while( this.mq.length>0){
			var msg = this.mq.shift();
			var fname = "f_" + msg.cmd.toLowerCase();
				call_handler(fname, this, msg);
		}
	}
}

function setSessionTimer(session, delay){
	return setTimeout(function(){
		session.emit("timeout", session);
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
		
		// decrease player count
		server.decreasePlayerCount();

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

// Session class member function
function appendData(data){
	if( data != null )
		this.data += data;
}
