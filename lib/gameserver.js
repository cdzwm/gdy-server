/* server module file.
*/

var events = require('events');
var util = require('util');
var net = require('net');
var fs = require('fs');
var path = require('path');
var os = require('os');

var game = require('../lib/game');
var gameZone = require('../lib/gamezone');
var gameRoom = require('../lib/gameroom');
var gameTable = require('../lib/gametable');
var gameUser = require('../lib/gameuser');

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
	me.serverconf = JSON.parse(fs.readFileSync(getConfigFileName()), "utf8");
}

/* 
Export
Start sever
*/
me.startServer = function (){
	me.initServer();
	server = net.createServer(function(s){
		s.end(me.serverconf.name + ' server ' + me.serverconf.version + '.');
	});
	server.listen(me.serverconf.server_port);
	setTimeout(function(){
		me.emit('start');
	}, 500);
}
