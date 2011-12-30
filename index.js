//module name: index
//description: server entry point.

global.DEBUG = (process.env.GDY_DEBUG || false) == 1;
global.DBG_LOG = function(msg){
	if( DEBUG )
		console.log(msg);
}
var server = require('./lib/server');

// ready event
server.on('ready', function(){
	console.log('GDY server ' + serverconf.version + ' started.');
});

// start server
server.startServer();
