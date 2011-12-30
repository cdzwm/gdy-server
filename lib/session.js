var EventEmitter = require('events').EventEmitter,
		crypto = require('crypto');
module.exports = new EventEmitter();

var message = require("./comm/message")
	,createPlayer = require('./player').createPlayer
	,protocol = require("./protocol");

protocol.on("processmessage", processMessage);

var sessions = {}
	,callbacks={}
	,message_cnt = 0;

function dumpMessage(msg){
	process.stdout.write(message_cnt + ":");
	console.dir(msg);
}

callbacks["f_hello_ok"] = function(session, msg){
	clearTimeout(session.helloTimer);

	session.timer = setTimeout(function(){
			session.socket.write(message.packMessage(message.newMessage("HELLO")));
		}, 5000);

	DBG_LOG("receive hello_ok");
}

callbacks["f_connect"] = function(session, msg){
	if( DEBUG )
		dumpMessage(msg);
	
	clearTimeout(session.timer);
	if( session.state == "CONNECT"){
		session.state = "LOGIN";
		session.socket.write(message.packMessage(message.newMessage("CONNECT_OK")));
		session.timer = setTimeout(function(){
		DBG_LOG("Session timeout.");

			session.socket.end();
		}, 2000);
	}
	else{
		session.socket.end();
	}
}
callbacks["f_login"] = function(session, msg){
	if( DEBUG )
		dumpMessage(msg);

	if( typeof(session.socket) == "undefined" )
		throw "Error";

	mysql_client.query("select * from player where name =? and password=?", [msg.username, msg.password], function(err, results, fields){
	// create a new user.
		clearTimeout(session.timer);
		if( results.length == 1 && msg.username == results[0].name
			&& msg.password ==results[0].password ){
			session.socket.write(message.packMessage(message.newMessage("LOGIN_OK")));
			session.state="LOGINED";
			session.player = createPlayer("player");

			session.timer = setTimeout(function(){
					session.socket.write(message.packMessage(message.newMessage("HELLO")));
					session.helloTimer = setTimeout(function(){
						session.socket.end();
						DBG_LOG("hello timeout");
					}, 2000);
				}, 2000);
		}
		else{
			session.socket.write(message.packMessage(message.newMessage("LOGIN_FAILED")));
			dumpMessage(msg);
		}

	});
}

callbacks["f_msg"] = function(session, msg){
	if( DEBUG )
		dumpMessage(msg);

	defaultProcessMessage(session, msg);
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
		,state : "CONNECT"
		,callbacks : []
		,ts : (new Date()).getTime()
		,timer : 	setTimeout(function(){
							session.socket.end();
							console.log("session timeout");
						}, 2000)
		,helloTimer : null
	};
	
	sessions[sessionid] = session; // store session object to sessions
	socket.sessionid = sessionid;	// set id property for socket(s)

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
		while( session.mq.length>0){
			message_cnt++;
			var msg = session.mq.shift();
			var fname = "f_" + msg.cmd.toLowerCase();
			if( callbacks.hasOwnProperty(fname)  && typeof(callbacks[fname]) == "function" )
				callbacks[fname](session, msg);
		}
	}
}

function cleanupSession(){
	
	if( sessions.hasOwnProperty(this.sessionid) ){
		// destroy session
		DBG_LOG("destroy session: " + this.sessionid);
		}
		clearTimeout(sessions[this.sessionid].timer);
		delete sessions[this.sessionid];
	}

function defaultProcessMessage(session, msg){
	if( session.state != "LOGINED" )
		session.socket.end(message.packMessage(message.newMessage("ERROR")));
}
