var net = require('net');

var hello = {"id":"hello gdy"};

try{
var client = net.connect(10086, '127.0.0.1', function(){
	client.write(JSON.stringify(hello));
	setInterval(helloAgain, 2000);
});
function helloAgain(){
	client.write(JSON.stringify(hello));
}

}
catch(e){
	console.log(e.errno);
}

