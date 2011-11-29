/* server module file.

*/
var http = require('http');
var host = '0.0.0.0';
var port = 10086;

var server = http.createServer(function (req, res){
	res.end('Welcome to gdy v0.0.1\n', 'utf8');
});

server.listen(port, host);
console.log('Server is running at ' + host + ' ' + port);

