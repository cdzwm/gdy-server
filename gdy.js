/* main server.
*/
var gameserver = require('./lib/server');

gameserver.on('start', function(){
	console.log('server ' + gameserver.serverconf.version + ' started.');
});

gameserver.startServer();
