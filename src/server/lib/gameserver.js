/* server module file.
*/

var events = require('events');

module.exports = new events.EventEmitter();
var me = module.exports;
var util = require('util');
var net = require('net');
var game = require('../lib/game');
var gameZone = require('../lib/gamezone');
var gameRoom = require('../lib/gameroom');
var gameTable = require('../lib/gametable');
var gameUser = require('../lib/gameuser');
var fs = require('fs');

var server;

/* Init server
*/
me.initServer = function() {

	fs.readFile(process.cwd() + "\\serverconf.json", "utf8", function(err, data){
			if(err) throw err;
			var serverconf = JSON.parse(data);
			me.version = serverconf.version;
			me.name = serverconf.name;
		}
	);
	
}
me.startServer = function (){
	me.initServer();
	server = net.createServer(function(s){
		s.end(me.name + ' server ' + me.version + '.');
	});
	server.listen(10086);
	setTimeout(function(){
			me.emit('start');
	}, 500);
}

me.startServer();
