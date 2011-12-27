//module name: index
//description: define server entry point.

var server = require('./lib/server');

// catch ready event
server.on('ready', function(){
	console.log('server ' + global.serverconf.version + ' started.');
});

// start server
server.startServer();
