var net = require('net');

var msg_begin = "GDY_MSG_BEGIN{";
var msg_end="}GDY_MSG_END";

var hello = {"cmd": "HELLO"};

var client = net.connect(10086, '127.0.0.1', function(){
	setInterval(helloAgain, 2000);
});

function helloAgain(){
	client.write(msg_begin + JSON.stringify(hello) + msg_end);
}

