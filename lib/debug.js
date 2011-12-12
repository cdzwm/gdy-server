module.exports.DEBUG == typeof(process.env.GDY_DEBUG) != "undefined" 
	? (process.env.GDY_DEBUG == 0 
	? false : true) : false;
