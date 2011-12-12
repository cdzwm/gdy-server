/*
module name: protocol
description: parse game server and client messages.

MESSAGE_CODE:
1. HELLO
2. LOGIN
3. LOGOUT
4. TALK
*/

var msg_re_begin = "GDY_MSG_BEGIN\{(";
var msg_re_body = ".*?";
var msg_re_end=")\}GDY_MSG_END";
var msg_re = new RegExp(msg_re_begin + msg_re_body + msg_re_end, "g");

exports.parseMessage = function(session){
	var ret = true;
	try{
		var m = session.data.match(msg_re);
		if(m != null){
			var l = 0;
			for(var i =0; i< m.length; i++) {
				l += m[i].length;
				session.mq.push(m[i]);
			}
			session.data = session.data.slice(l); // remove parsed messages.
			ret = RegExp.$1;
		}
	}
	catch(e){
		ret = false;
	}
	return ret;
}
