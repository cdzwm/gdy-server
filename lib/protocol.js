//module name: protocol
//description: parse game server and client messages.
//
var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();

var msg = require("./msg");

var msg_begin = msg.msgBegin()
	,msg_end = msg.msgEnd();

var msg_re = new RegExp(msg.msgReBegin() + "(.*?)" + msg.msgReEnd(), "g");

function parseMessage(session){
	session.data = session.data.slice(msg.parseMessage(session.data, session.mq)); // remove parsed messages.
	if( session.mq.length > 0)
		module.exports.emit("processmessage", session);
}

module.exports.on("parsemessage", parseMessage);

module.exports.newMessage = function(cmd){
	var cmd = {
		cmd: cmd
	};

	return msg_begin + JSON.stringify(cmd) + msg_end;
}