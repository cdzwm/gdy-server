//module name:  poker
//description: define poker
module.exports.poker = [
"黑桃A",
"黑桃2",
"黑桃3",
"黑桃4",
"黑桃5",
"黑桃6",
"黑桃7",
"黑桃8",
"黑桃9",
"黑桃10",
"黑桃J",
"黑桃Q",
"黑桃K",
"红心A",
"红心2",
"红心3",
"红心4",
"红心5",
"红心6",
"红心7",
"红心8",
"红心9",
"红心10",
"红心J",
"红心Q",
"红心K",
"梅花A",
"梅花2",
"梅花3",
"梅花4",
"梅花5",
"梅花6",
"梅花7",
"梅花8",
"梅花9",
"梅花10",
"梅花J",
"梅花Q",
"梅花K",
"方块A",
"方块2",
"方块3",
"方块4",
"方块5",
"方块6",
"方块7",
"方块8",
"方块9",
"方块10",
"方块J",
"方块Q",
"方块K",
"小王",
"大王"
];

module.exports.shuffle = function(poker){
	var t, result=[];
	for( var i=poker.length; i>0; i--){
		var pos = Math.floor(Math.random() * i);
		result.push(poker[pos]);
		delete poker[pos];

		t = [];
		for(var p in poker)
			t.push(poker[p]);

		for(var p in t )
			poker[p] = t[p];
	}
	return result;
}
