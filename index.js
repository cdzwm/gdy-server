//module name: index
//description: server entry point.

require("./lib/comm/debug");
require("./lib/comm/util");
var server = require('./lib/server');
require("./lib/poker").getCards();


// ready event
server.on('ready', function(){
	DBG_LOG("i", 'GDY server ' + serverconf.version + ' started.');
});

// start server
server.startServer();
