//module name: index
//description: server entry point.
var debug = require("./lib/comm/debug")
	,myutil = require("./lib/comm/util")
	,server = require('./lib/server');

// ready event
server.on('ready', function(){
	DBG_LOG("i", 'GDY server ' + _server.serverconf.version + ' started.');
});

// start server
server.startServer();
