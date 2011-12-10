/* 
module name: server
description: define server.
*/

// system depencies
var	events = require('events'),
		net = require('net'),
		fs = require('fs'),
		path = require('path');

// project depencies
var Player = require('./player').Player;

// inherit from events.EventEmitter
module.exports = new events.EventEmitter();
var me = module.exports;

var server; // reference server object.

var players = {}; //  Object which includes all users.

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
	me.serverconf = JSON.parse(fs.readFileSync(getConfigFileName()), "utf8");
}

/* 
Start sever
*/
me.startServer = function (){
	initServer();

	server = net.createServer(function(s){
		handlePlayerConnection(s);
	});
	
	server.listen(me.serverconf.server_port, function(){
		startListenEvents();
	});
}

function handlePlayerConnection(s){
	new Player(s, players);
}

function startListenEvents(){
		me.emit('ready');
		setInterval(function(){
			console.dir(players);
		}, 2000);
}

