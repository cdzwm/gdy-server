/* server module file.
*/

var events = require('events');
var util = require('util');
var net = require('net');
var fs = require('fs');
var path = require('path');
var os = require('os');

var game = require('./game');
var zone = require('./zone');
var room = require('./room');
var table = require('./table');
var player = require('./player');
var protocol = require('./protocol');

module.exports = new events.EventEmitter();
var me = module.exports;

var server;

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
		handleUserConnection(s);
	});
	server.listen(me.serverconf.server_port);
	setTimeout(function(){
		me.emit('start');
	}, 500);
}

/*handle connection request */
var playerlist = new Array();

var socket;
function handleUserConnection(s){
	socket = s;
	playerlist.push(new player.Player(getPlayerId(), s));
	console.log(playerlist.length);
	s.on('data',  onReceiveData);
	console.dir(playerlist);
	s.write('Welcome to ' +  me.serverconf.name + ' server ' + me.serverconf.version + '.\n', 'utf8');
	s.write('Type "quit" to exit.', 'utf8');
}


function onReceiveData(data){
	socket.write(data);
}

me.dumpPlayers = function (){
	for( var i = 0; i< playerlist.length ; i++){
		console.log(playerlist[i].id);
	}
	console.log("--- --- ---");
}

var playerid = 0;
function getPlayerId(){
	return playerid++;
}
