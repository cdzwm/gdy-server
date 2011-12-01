/* main server.
*/
var gdy = require('./lib/server');

gdy.on('start', function(){
	console.log('server ' + gdy.serverconf.version + ' started.');
});

gdy.startServer();

setInterval(function(){
	gdy.dumpPlayers();
}, 5000);