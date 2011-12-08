/* 
module name: server
description: define server.
*/

// system depencies
var events = require('events');
var util = require('util');
var net = require('net');
var fs = require('fs');
var path = require('path');
var os = require('os');
var crypto = require('crypto');

// project depencies
var game = require('./game');
var room = require('./room');
var table = require('./table');
var player = require('./player');
var protocol = require('./protocol');
var mq = require('./mq');

// inherit from events.EventEmitter
module.exports = new events.EventEmitter();
var me = module.exports;

var server; // reference server object.

var playerHash = {}; //  Object which includes all users.
var playerMsgBuf = {};

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

function calcPlayerKey(s){
	//TODO: use md5, header, time to generate player key.
	return s.remoteAddress + ':' + s.remotePort;
}

/*handle connection request */
function handlePlayerConnection(s){
	// Initialize player connection
	s.setEncoding("utf8");

	//  make a mark on socket to use in receiving data.
	var playerKey = s.playerKey = calcPlayerKey(s);

	playerMsgBuf[playerKey] = {"data":""};

	s.on("data", onData);
	me.on('parsecmd', parseCmd);
}

function onData(data){
	playerMsgBuf[this.playerKey].data += data;
	me.emit('parsecmd', this.playerKey);
}

// emitted when server is ready.
function startListenEvents(){
// finally emit 'ready' event
		me.emit('ready');
}

function parseCmd(playerKey){
	console.log(protocol.getMessage(playerMsgBuf[playerKey]));
}
