module.exports.DEBUG = false;

var gdy_debug = process.env.GDY_DEBUG;

if( typeof(gdy_debug) != "undefinded" 
	&& gdy_debug == 1)
		module.exports.DEBUG = true;

if( module.exports.DEBUG ){
	console.log("Debug mode is enabled.");
}
