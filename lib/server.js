/* 
module name: server
description: define server.
*/

// system depencies
var DEBUG = typeof(process.env.GDY_DEBUG) != "undefined" ? (process.env.GDY_DEBUG == 0 ? false : true) : false;
var	EventEmitter = require('events').EventEmitter
		,net = require('net')
		,fs = require('fs')
		,path = require('path')
		,crypto = require('crypto');

// project depencies
var player = require('./player');

// inherit from events.EventEmitter
var exports = module.exports = new EventEmitter();
var server; // reference server object.
var sessions = {};

/* get configuration filename */
function getConfigFileName(){
	// default configuration file in the same directory as gameserver.js
	var configFileName = path.normalize('./serverconf.json'); 
	if( typeof(require.main) === 'object'  ){
		configFileName = path.dirname(require.main.filename);
		configFileName += path.normalize('/serverconf.json');
	}
	return configFileName;		
}

initServer = function() { 
	exports.serverconf ={ // default server configuration.
		"name": "Gan Deng Yan",
		"version": "0.0.1",
		"server_port": "10086",
		"description": "A poker game."
	}

	// use fs.readFileSync to guarantee that me.serverconf gets a initial value.
	// JSON.parse can only parse json 
	try{
		exports.serverconf = JSON.parse(fs.readFileSync(getConfigFileName()), "utf8");
	}catch(e){
		if( DEBUG ){
			if( /SyntaxError/.test(e.toString()) )
				console.log("gdy - Error: Configuration error. use default configuration.");
		}
	}
}

/* 
Start sever
*/
exports.startServer = function (){
	initServer();
	server = net.createServer(function(s){
		newSession(s);
	});
	
	server.listen(exports.serverconf.server_port, function(){
		exports.emit("ready");
	});
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

function newSession(s){
	
	function sha1(input){
		var sha1 = crypto.createHash('sha1');
		sha1.update(input);
		return sha1.digest('hex');	
	}

	var sha1_data = s.remoteAddress 
		+ ":" 
		+ s.remotePort 
		+ Math.round(Math.random() * 9999999999) 
		+ (new Date()).getTime();

	var session ={
		socket : s
		,data : ""
		,ts : (new Date()).getTime()
	};
	
	var id = sha1(sha1_data); // generate session's id.
	sessions[id] = session; // store session object to sessions
	s.id = id;	// set id property for socket(s)

	s.setEncoding("utf8"); // use utf8 for data encoding
	s.on("data", onReceiveMessage); // Listenning for data event
}

if(DEBUG){
	setInterval(function(){
		console.log(sessions);
	}, 5000);
}

// Receive input message data
function onReceiveMessage(data){
	sessions[this.id].data += data; // store data to the corrposding session's data buffer.
	player.emit("msg", sessions[this.id]); // emit "msg" event for player to process messages.
}
