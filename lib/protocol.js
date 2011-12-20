//module name: protocol
//description: parse game server and client messages.
//
var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();

var message = require("../deps/comm/message");
function parseMessage(session){
	session.data = session.data.slice(message.parseMessage(session.data, session.mq)); // remove parsed messages.
	if( session.mq.length > 0)
		module.exports.emit("processmessage", session);
}

module.exports.on("parsemessage", parseMessage);
