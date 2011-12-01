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
	me.emit('start');
}

/*handle connection request */
var playerHash = {};

function handleUserConnection(s){
	var userkey = s.remoteAddress + ":" + s.remotePort;
	 playerHash[userkey] = new player.Player(s);
	
	s.on('data',  onReceiveData);
	me.emit('newplayer', playerHash[userkey] );
}

function onReceiveData(data){
	var userkey = this.remoteAddress + ":" + this.remotePort;
	playerHash[userkey].s.write(userkey, "utf8");
}
