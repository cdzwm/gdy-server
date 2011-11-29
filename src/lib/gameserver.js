/* server module file.
*/

var events = require('events');
var util = require('util');
var net = require('net');
var fs = require('fs');

var game = require('../lib/game');
var gameZone = require('../lib/gamezone');
var gameRoom = require('../lib/gameroom');
var gameTable = require('../lib/gametable');
var gameUser = require('../lib/gameuser');

module.exports = new events.EventEmitter();
var me = module.exports;


/* Init server
*/
var server;
me.initServer = function() {
	me.serverconf = JSON.parse(fs.readFileSync(process.cwd() + "\\serverconf.json", "utf8"));
}

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

me.startServer();
