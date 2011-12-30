global.DEBUG = (process.env["GDY_DEBUG"] == 1);
global.DBG_LOG = function(arg1, arg2){
	if( DEBUG ){
		var tag_message = "", tag_name="GDY - ", message="";
		if( arguments.length == 2 ){
			switch(arg1){
				case "i":
					tag_message = "Info: ";
					break;
				case "d":
					tag_message = "Debug: ";
					break;
				case "e":
					tag_message = "Error: ";
					break;
				default:
					tag_name="";
					message = arg1;
					break;
			}
			message += tag_name + tag_message  + arg2;
		}
		else{
			message = arg1;
		}
		console.log(message);
	}
}
