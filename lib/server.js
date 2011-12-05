/* server module file.
*/

// system depencies
var events = require('events');
var util = require('util');
var net = require('net');
var fs = require('fs');
var path = require('path');
var os = require('os');

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
var helloHash = {};

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

/* 
 Export
  Init server
*/
me.initServer = function() { 
	// use fs.readFileSync to guarantee that me.serverconf gets a initial value.
	// JSON.parse can only parse json 
	me.serverconf = JSON.parse(fs.readFileSync(getConfigFileName()), "utf8");
}


/* 
Export
Start sever
*/
me.startServer = function (){
	me.initServer();

	server = net.createServer(function(s){
// handle player's connection.
		handlePlayerConnection(s);
	});
	
	server.listen(me.serverconf.server_port, function(){
// bind server events.
		startListenEvents();
	});
}

/*handle connection request */

function handlePlayerConnection(s){
	hello(s);
}

function onData(data){
	helloHash[this.playerKey].data += data;
	console.log(helloHash[this.playerKey].data);
}

function hello(s){
	s.setEncoding("utf8");
	
	var playerKey = s.remoteAddress + ':' + s.remotePort;
	s.playerKey = playerKey;

	helloHash[playerKey] = {"socket":s, "data":"", "hellook":false};
	s.on("data", onData);
}

// emitted when server is ready.
function startListenEvents(){
// finally emit 'ready' event
		me.emit('ready');
}

function onHelloOk(){
	console.log("hello ok");
}