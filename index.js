//module name: index
//description: server entry point.

require("./lib/comm/debug");

var server = require('./lib/server');

// ready event
server.on('ready', function(){
	DBG_LOG("i", 'GDY server ' + serverconf.version + ' started.');
});

// start server
server.startServer();
