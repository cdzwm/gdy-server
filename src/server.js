/* main server.
*/
var gameserver = require('./lib/gameserver');

gameserver.on('start', function(){
	console.log('server ' + gameserver.serverconf.version + ' started.');
});

process.on('SIGINT', function (){
	console.log('SIGINT');
});
