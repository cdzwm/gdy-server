var net = require('net');

var msg_begin = "GDY_MSG_BEGIN{";
var msg_end="}GDY_MSG_END";

var hello1 = {"cmd": "HELLO{*}", "description":"handshake"};
var hello2 = {"cmd": "HELLO", "description":"handshake", "test":"a test"};


var client = net.connect(10086, '127.0.0.1', function(){
	setInterval(helloAgain1, 1000);
	//setInterval(helloAgain2, 100);
	client.setEncoding('utf8');
	client.on('data', onReceiveMessage);
});

function helloAgain1(){
	hello1.cmd =  "HELLO";
	client.write(msg_begin + JSON.stringify(hello1) + msg_end);
}

function helloAgain2(){
	for(var i=0;i<1;i++){
		hello2.cmd =  "HELLO" + Math.round((1000*Math.random())).toString();
		hello2.id = i;
		client.write(msg_begin + JSON.stringify(hello2) + msg_end);
	}
}

function onReceiveMessage(data){
	console.log(data);
}