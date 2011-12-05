/* main server.
*/
var server = require('./lib/server');

server.on('ready', function(){
	console.log('server ' + server.serverconf.version + ' started.');
});
server.startServer();
