function t(){
	var a = 1;
	var s = {
		t1 : function(){
			a=2;
		},
		d : function(){
			console.log(a);
		}
	}
	return s;
}

var tt1 = t();
tt1.d();
tt1.t1();
tt1.d();

var tt2 = t();
tt2.d();
