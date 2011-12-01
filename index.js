/* main server.
*/
var server = require('./lib/server');

server.on('start', function(){
	console.log('server ' + server.serverconf.version + ' started.');
});

server.on('newplayer', function(player){
	console.log(player);
});
server.startServer();
