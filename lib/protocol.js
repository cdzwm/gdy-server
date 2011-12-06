/*
module name: protocol
description: parse game server and client messages.

MESSAGE_CODE:
1. HELLO
2. LOGIN
3. LOGOUT
4. TALK
*/

var msg_re_begin = "^GDY_MSG_BEGIN\{(";
var msg_re_body = ".*?";
var msg_re_end=")\}GDY_MSG_END";
var msg_re = new RegExp(msg_re_begin + msg_re_body + msg_re_end);
msg_re.compile

exports.isMessage = function (msg, cmd){
	if( cmd === msg.cmd )
		return true;
}

exports.getMessage = function(buffer){
	var ret = null;
	var m = buffer.data.match(msg_re);
	if(m != null){
		buffer.data = buffer.data.slice(m[0].length);
		ret = JSON.parse(m[1]);
	}
		
	return ret;
}
