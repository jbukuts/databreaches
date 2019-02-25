// data time

d3.csv("data/breaches.csv").then(function(data){
	// log the data
	console.log(data);

	data.forEach(function(d){
		// display the reason for breach
		// console.log(d.type);
	});

	console.log(data.length);

	$("#breach-amount").text("There Were " + data.length + " Total Breaches");


});