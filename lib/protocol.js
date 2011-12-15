/*
module name: protocol
description: parse game server and client messages.

MESSAGE_CODE:
1. HELLO
2. LOGIN
3. LOGOUT
4. TALK
*/

var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();

var msg_begin = "GDY_MSG_BEGIN{"
	,msg_end = "}GDY_MSG_END";

var msg_re_begin = "GDY_MSG_BEGIN\{("
	,msg_re_body = ".*?"
	,msg_re_end=")\}GDY_MSG_END"
	,msg_re = new RegExp(msg_re_begin + msg_re_body + msg_re_end, "g");

function parseMessage(session){
	var ret = true;
	try{
		var msg_text, l = 0;
		while((msg_text = msg_re.exec(session.data)) != null){
			l += msg_text[0].length;
			session.mq.push(JSON.parse(msg_text[1]));
		}
		session.data = session.data.slice(l); // remove parsed messages.
		module.exports.emit("processmessage", session);
	}
	catch(e){ // TODO: error handle
		ret = false;
	}
	return ret;
}

module.exports.on("parsemessage", parseMessage);

module.exports.newMessage = function(cmd){
	var cmd = {
		cmd: cmd
	};

	return msg_begin + JSON.stringify(cmd) + msg_end;
}