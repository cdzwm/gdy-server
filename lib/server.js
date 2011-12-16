//module name: server
//description: define server.

// set debug mode
global.DEBUG = (process.env.GDY_DEBUG || false) == 1;

// system depencies
var	EventEmitter = require('events').EventEmitter
		,net = require('net')
		,fs = require('fs')
		,path = require('path');

// project depencies
var session = require("./session");
var protocol = require('./protocol');

// inherit from events.EventEmitter
var exports = module.exports = new EventEmitter();
var server; // reference server object.

// get configuration filename
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

//Start sever

exports.startServer = function (){
	initServer();
	server = net.createServer(function(s){
		session.newSession(s, protocol);
	});
	
	server.listen(exports.serverconf.server_port, function(){
		exports.emit("ready");
	});
}
