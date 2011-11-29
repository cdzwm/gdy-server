/* main server.
*/

var gameserver = require('./gameserver.js');

gameserver.on('start', function(){
	console.log('server started');
});

gameserver.initServer();
