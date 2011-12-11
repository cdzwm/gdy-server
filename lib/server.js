/* 
module name: server
description: define server.
*/

// system depencies
var DEBUG = true;
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
	// use fs.readFileSync to guarantee that me.serverconf gets a initial value.
	// JSON.parse can only parse json 
	try{
		exports.serverconf = JSON.parse(fs.readFileSync(getConfigFileName()), "utf8");
	}catch(e){
		// default server configuration.
		exports.serverconf ={
			"name": "Gan Deng Yan",
			"version": "0.0.1",
			"server_port": "10086",
			"description": "A poker game."
		}
	}
}

/* 
Start sever
*/
exports.startServer = function (){
	initServer();
	server = net.createServer(function(s){
		var session = createSession(s);
		sessions[session.id] = session;
		s.id = session.id;

		s.setEncoding("utf8");
		s.on("data", onReceiveMessage);
	});
	
	server.listen(exports.serverconf.server_port, function(){
		exports.emit("ready");
	});
}

function createSession(s){
	var s = s.remoteAddress 
		+ ":" 
		+ s.remotePort 
		+ Math.round(Math.random() * 9999999999) 
		+ (new Date()).getTime();
	
	var session ={
		id : sha1(s)
		,socket : s
		,data : ""
		,time : (new Date()).getTime()
	};
	return session;
}

function sha1(s){
	var sha1 = crypto.createHash('sha1');
	sha1.update(s);
	return sha1.digest('hex');	
}

if(DEBUG){
	setInterval(function(){
		console.log("current sessions:");
		for(var id in sessions)
			console.log(id);
	}, 2000);
}

function onReceiveMessage(data){
	sessions[this.id].data += data;
	player.emit("msg", sessions[this.id]);
}
