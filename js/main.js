// load in the states names and abbreviations to check in data
var states_file = [];
d3.json("data/states_titlecase.json").then(function(data){
	states_file = data;
	//console.log(states_file);
});

// create array to house how many breaches occurred in each state
var states_amount  = [];
for(var i = 0; i<52;i++){
	states_amount.push(0);
}

d3.csv("data/breaches.csv").then(function(data){
	
	// load the years in and store into array
	var years = {};
	for(var i=0; i < data.length; i++){
		// where the start of the year is
		var start = data[i].date.lastIndexOf("/");
		// the acutal year
		years[i] = "20"+data[i].date.substring(start+1,data[i].date.length);
		console.log(years[i]);
	}
	
	// see the json loaded
	console.log(states_file);

	// run through all data
	for (var i=0; i < data.length; i++) {
		// run though all the states and check for proper state
		for (var j=0; j < states_file.length; j++) {
			// if state is found then increment its place in array
			if(data[i].location.indexOf(states_file[j].abbreviation) != -1) {
				states_amount[j] += 1;
			}
			else if (data[i].location.indexOf(states_file[j].name) != -1) {
				states_amount[j] += 1;
			}
		}
	}

	console.log(states_amount);

	// draw the US in this svg id
	uStates.draw("#statesvg");

	//sets the color of each state
	for(var i=0;i<states_amount.length;i++){
		var curr = '#'+states_file[i].abbreviation;
		var color = d3.interpolate("#ffffcc", "#800026")(states_amount[i]/100);
		$(curr).css('fill',color);
	}

	// displays the total amount of breaches
	$("#breach-amount").text("There Were " + data.length + " Total Breaches");
	
	// gives a random reason for one of the breaches
	$("#reason").text('"'+data[getRandom(0,data.length-1)].type+'"');

	// checks for hover and display amount of breaches
	$(document).ready(function(){
 		$("path").hover(function(){
 			// index in array of state
 			var index = states_file.findIndex(x => x.abbreviation==this.id);
    		
    		// console.log(this.id + ": " + states_amount[index]);
    		// bring tooltip to view
    		d3.select("#tooltip").transition().duration(200).style("opacity", 1);  

    		// change text in tooltip
    		d3.select("#tooltip").html(tooltipHtml(this.id, states_amount[index]))  
				.style("left", (event.pageX) + "px")     
				.style("top", (event.pageY - 28) + "px");
    	}, function(){
    		// set tooltip back to 0 opacity
    		d3.select("#tooltip").transition().duration(500).style("opacity", 0); 
    		
  		});
	});


});


// simple fucntion to add tooltip and display breaches
function tooltipHtml(n, d){
		return "<h4>"+n+"</h4><table>"+
			"<tr><td>Breaches: </td><td>"+(d)+"</td></tr>"+
			"</table>";
}

// quick function to return a random num between hi and low
function getRandom(lo = 0, hi){
	return Math.floor(Math.random() * hi) + lo;
}






