/* main server.
*/

var gameserver = require('gameserver');

gameserver.on('start', function(){
	console.log('server ' + require('version').version + ' started.');
});

gameserver.initServer();
