//module name: protocol
//description: parse game server and client messages.
//
var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();

var msg = require("./msg");

var msg_begin = msg.msgBegin()
	,msg_end = msg.msgEnd();

var msg_re_begin = msg.msgBegin().replace(/([\[\]$()*+.?\\^{|}])/g,'\\$1')
	,msg_re_body = "(.*?)"
	,msg_re_end=msg.msgEnd()
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