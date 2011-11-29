/* main server.
*/

var gameserver = require('gameserver');

gameserver.on('start', function(){
	console.log('server ' + gameserver.version + ' started.');
});
