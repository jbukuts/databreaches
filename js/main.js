// data time

d3.csv("data/breaches.csv").then(function(data){

	console.log(data);

	data.forEach(function(d){
		console.log(d.type);
	});


});