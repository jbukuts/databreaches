
//Width and height of map
var width = 960;
var height = 500;


var states_file = [];
d3.json("data/states_titlecase.json").then(function(data){
	states_file = data;
	//console.log(states_file);
});

var states_amount  = [];
for(var i = 0; i<59;i++){
	states_amount.push(0);
}


d3.csv("data/breaches.csv").then(function(data){
	// log the data
	// console.log(data);

	data.forEach(function(d){
		// display the reason for breach
		// console.log(d.type);
	});

	console.log(states_file);

	for (var i=0; i < data.length; i++){
		for (var j=0; j < states_file.length; j++){
			if(data[i].location.indexOf(states_file[j].abbreviation) != -1){
				states_amount[j] += 1;
			}
			if(data[i].location.indexOf(states_file[j].name) != -1){
				states_amount[j] += 1;
			}

		}
	}

	for(var i=0;i<59;i++){
		// console.log(states_file[i].abbreviation + ": "+ states_amount[i]);
	}


	var final_data = {};
	for(var i=0;i<59;i++){
		final_data[i] = {amount:states_amount[i],color:"blue"};
	}

	console.log(final_data);




	uStates.draw("#statesvg",final_data);

	$("#breach-amount").text("There Were " + data.length + " Total Breaches");
	$("#reason").text('"'+data[getRandom(0,data.length-1)].type+'"');
});



function getRandom(lo, hi){
	return Math.floor(Math.random() * hi) + lo;
}






