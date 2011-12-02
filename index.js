/* main server.
*/
var server = require('./lib/server');

server.on('start', function(){
	console.log('server ' + server.serverconf.version + ' started.');
});

server.on('newplayer', function(userkey){
	server.getPlayer(userkey).dumpPlayer();
});

server.startServer();
