/*
Parse game server and client command.

MESSAGE_CODE:
1. HELLO
2. LOGIN
3. LOGOUT
4. TALK
*/


exports.isMessage = function (msg, cmd){
	if( cmd === msg.cmd )
		return true;
}
