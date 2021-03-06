//module name: index
//description: server entry point.
var debug = require("./lib/comm/debug")
	,server = require('./lib/server');

// ready event
server.on('ready', function(){
	DBG_LOG("i", 'GDY server ' + server.version() + ' started.');
});

// start server
server.startServer();
