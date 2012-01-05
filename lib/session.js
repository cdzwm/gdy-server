// session module

// system module dependences
var EventEmitter = require('events').EventEmitter,
		crypto = require('crypto');

// project dependences
var message = require("./comm/message")
	,createPlayer = require('./player').createPlayer;

// Inherit from EventEmitter
module.exports = new EventEmitter();

// Hancle events
module.exports.on("processmessage", processMessage);
module.exports.on("parsemessage", parseMessage);

var callbacks={} // message handle callback functions
	,message_cnt = 0; // total count of messages received on the server

// Set message handle callback functions

// default message handle function
callbacks["f_default"] = function(session, msg){
	DBG_LOG("i", msg);
	if( session.state != "LOGINED" )
		session.sendMessage(message.new("ERROR"));
		session.end();
}

// hello_ok message handle function
callbacks["f_hello_ok"] = function(session, msg){
	clearTimeout(session.helloTimer);

	session.timer = setTimeout(function(){
			session.sendMessage(message.new("HELLO"));
		}, 5000);

	DBG_LOG("i", "receive hello_ok");
}

// connect message handle function
callbacks["f_connect"] = function(session, msg){
	if( DEBUG )
		dumpMessage(msg);
	
	clearTimeout(session.timer);
	if( session.state == "CONNECT"){
		session.state = "LOGIN";
		session.sendMessage(message.new("CONNECT_OK"));
		session.timer = setTimeout(function(){
			DBG_LOG("i", "Session timeout.");
			session.end();
		}, 2000);
	}
	else{
		session.end();
	}
}

// login message handle function
callbacks["f_login"] = function(session, msg){
	if( DEBUG )
		dumpMessage(msg);

	if( typeof(session.socket) == "undefined" )
		throw "Error";

	var query = mysql_client.query("select * from player where name =? and password=?", [msg.username, msg.password], function(err, results, fields){
	// create a new user.
		clearTimeout(session.timer);
		if( err ){
			DBG_LOG("e", "Access database error.");
			session.sendMessage(message.new("LOGIN_FAILED"));
		}
		else{
			if( results.length == 1 && msg.username == results[0].name
				&& msg.password ==results[0].password ){

				try{
					session.sendMessage(message.new("LOGIN_OK"));
				}
				catch(e){
					DBG_LOG("Socket error.");
				}
				session.state="LOGINED";
				session.player = createPlayer("player");

				session.timer = setTimeout(function(){
						DBG_LOG("send hello");
						session.sendMessage(message.new("HELLO"));
						session.helloTimer = setTimeout(function(){
							session.end();
							DBG_LOG("e", "hello timeout");
						}, 2000);
					}, 2000);
			}
			else{// 登录失败 TODO: MUST CATCH ERROR
				try{
					session.sendMessage(message.new("LOGIN_FAILED"));
					session.end();
				}
				catch(e){
					DBG_LOG("e", e);
				}
			}
		}
	});
}

// test message handle function
callbacks["f_test"] = function(session, msg){
	if( DEBUG )
		dumpMessage(msg);
}

// exports functions

// Create a new session
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
	
	sessions[sessionid] = session; // store session object to sessions
	socket.sessionid = sessionid;	// set id property for socket(s)

	socket.setEncoding("utf8"); // use utf8 for data encoding
	socket.on("data", receiveMessage);
	socket.on("close", cleanupSession);
	socket.on("error", handleSocketError);
	return session;
}

// util functions
function dumpMessage(msg){
	process.stdout.write(message_cnt + ":");
	DBG_LOG(msg);
}

// genergate sha1 function
function sha1(input){
	var sha1 = crypto.createHash('sha1');
	sha1.update(input);
	return sha1.digest('hex');
}

// receive message data
function receiveMessage(data){
	sessions[this.sessionid].data += data;
	module.exports.emit("parsemessage", sessions[this.sessionid]);
}

// dispatch message
function processMessage(session){
	if( session.mq.length > 0){
		while( session.mq.length>0){
			message_cnt++;
			var msg = session.mq.shift();
			var fname = "f_" + msg.cmd.toLowerCase();
			if( callbacks.hasOwnProperty(fname)  && typeof(callbacks[fname]) == "function" ){
				callbacks[fname](session, msg);
			}
			else{
				callbacks["f_default"](session, msg);
			}
		}
	}
}

// cleaanup disconnected session
function cleanupSession(){
	
	if( sessions.hasOwnProperty(this.sessionid) ){
		// destroy session
		DBG_LOG("destroy session: " + this.sessionid);
		}
		// remove all listeners
		this.removeAllListeners();
		
		// clear timer
		clearTimeout(sessions[this.sessionid].timer);

		// clear hello timer
		clearTimeout(sessions[this.sessionid].helloTimer);

		// clear message queue
		sessions[this.sessionid].mq = [];

		// clear data buffer
		sessions[this.sessionid].data = "";

		// clear callbacks
		sessions[this.sessionid].callbacks=[];

		// clear this session
		delete sessions[this.sessionid];
}

// handle socket error
function handleSocketError(err){
	DBG_LOG(err);
}

// send message function
function sendMessage(msg){
	try{
		this.socket.write(message.pack(msg));
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
