/* server module file.
*/

var events = require('events');

module.exports = new events.EventEmitter();
var me = module.exports;

/* Init server
*/
me.initServer = function() {
	util = require('util');
	net = require('net');
	game = require('./game.js');
	gameZone = require('./gamezone.js');
	gameRoom = require('./gameroom.js');
	gameTable = require('./gametable.js');
	gameUser = require('./gameuser.js');

	me.emit('start');
}

