d3.csv("data/data_breaches.csv").then(function(data){
	
	console.log(data);

	// create array to house how many breaches occurred in each state
	var states_amount  = [];
	for(var i = 0; i<51;i++){
		states_amount.push(0);
	}

	// run through all data
	for (var i=0; i < data.length; i++) {
		// run though all the states and check for proper state
		for (var j=0; j < states_file.length; j++) {
			// if state is found then increment its place in array
			if (data[i].State == states_file[j].name) {
				states_amount[j] += 1;
			}
		}
	}

	console.log(states_amount);

	// draw the US in this svg id
	uStates.draw("#statesvg");

	// min and max amount of breaches per state
	var min = Math.min(...states_amount);
	var max = Math.max(...states_amount);

	// log them
	// console.log(min+", "+max);

	// this defines the color range
	var color = d3.scaleLog()
    	.domain([min, max])
    	.range(["#dbdbdb", "#af2b2b"]);

	//sets the color of each state
	for(var i=0;i<states_amount.length;i++){
		var curr = states_file[i].name;

		//console.log(states_file[i].name + ": "+  color(states_amount[i]));
		$("[id='"+curr+"']").css('fill',color(states_amount[i]));
	}

	// displays the total amount of breaches
	$("#breach-amount").text("there were " + data.length + " total breaches");
	
	// checks for hover and display amount of breaches
	$(document).ready(function(){
 		$(".state").hover(function(){
 			// index in array of state
 			var index = states_file.findIndex(x => x.name==this.id);
    		
    		// console.log(this.id + ": " + states_amount[index]);
    		// bring tooltip to view
    		d3.select("#tooltip").transition().duration(200).style("opacity", .9);  

    		// change text in tooltip
    		d3.select("#tooltip").html(tooltipHtml(this.id, states_amount[index]))  
				.style("left", (event.pageX) + "px")     
				.style("top", (event.pageY - 28) + "px");
    	}, function(){
    		// set tooltip back to 0 opacity
    		d3.select("#tooltip").transition().duration(500).style("opacity", 0); 
  		});
	});

	// upon clicking a state time to show some stuff
	$(".state").click(function() {
  		$("#depth").html(inDepth(this.id));

  		console.log(this.id);

  		var display_data = {};
  		for(var i=0;i<data.length;i++){
  			console.log(data[i].State);
  		}
	});
});

function inDepth(state){
	return "<p>"+state+"</p>";
}


var margin = {left: 80, right: 20, top: 50, bottom: 100};
var height = 450 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

// Define the div for the tooltip
var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

d3.json("data/data.json").then(function (data) {

    parseDate = d3.timeParse("%Y-%m-%d")

    // creates formatted data
    const formattedData = data.map(function (state) {
        return state["Breaches"].filter(function (breaches) {
            var dataExists = (breaches.Breach_Type && breaches.Total_Records && breaches.Date);
            return dataExists
        }).map(function (breaches) {
            breaches.Total_Records = +breaches.Total_Records;
            breaches.Date = parseDate(breaches.Date);
            breaches.Breach_Type = breaches.Breach_Type;
            return breaches;
        })
    });

    // check new data
    console.log(formattedData);


    // create array to house how many breaches occurred in each state
    var states_amount = [];
    for (var i = 0; i < 51; i++) {
        states_amount.push(0);
    }

    // run through all data
    for (var i = 0; i < formattedData.length; i++) {
        states_amount[i] = formattedData[i].length
    }

    console.log(states_amount);
    console.log(data);

    // svg for map
    var map = d3.select("#map-viz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id","states-map")
        .append("g")
        .attr("transform", "translate(" + margin.left +
            ", " + margin.top + ")");

    // draw the US in this svg id
    uStates.draw("#states-map");

    // adds the title for the chart
    map.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Amount of Breaches In Each State From 2004 to 2018");

    // add the legend   
    var mapLengend = map.append('g')
      .attr("class", "legend")
      .attr("x", 0)
      .attr("y", 25)
      .attr("height", 100)
      .attr("width", 100);

    mapLengend.selectAll('.legend')
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 200)
        .attr("height", 25)
        .style("fill", "red");


    // min and max amount of breaches per state
    var min = Math.min(...states_amount);
    var max = Math.max(...states_amount);

    // log them
    // console.log(min+", "+max);

    // this defines the color range
    var color = d3.scaleLog()
        .domain([min, max])
        .range(["#dbdbdb", "#af2b2b"]);

    //sets the color of each state
    for (var i = 0; i < data.length; i++) {
        var curr = data[i].State;
        $("[id='" + curr + "']").css('fill', color(formattedData[i].length));
    }

    // calculates total breaches
    var tot = 0
    for(var i=0;i<formattedData.length;i++)
        tot += formattedData[i].length;

    // displays the total amount of breaches
    $("#breach-amount").text("From 2004 to 2018 There Were " + tot + " Total Breaches");
    
    //keeps track of which state is plotted
    //Starts at 41 for South Carolina
    var active_index = 40

    // adds chart 
    var g = d3.select("#chart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left +
            ", " + margin.top + ")");

    // adds the title for the chart
    g.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(data[active_index].State);

    // x axis label
    var xLabel = g.append("text")
        .attr("y", height + 50)
        .attr("x", width / 2)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Date");

    // y axis label
    var yLabel = g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -(height/2))
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Number of Records")

    // determines color of the dot on graph
    var typeColor = d3.scaleOrdinal(d3.schemeCategory10);

    // add the legend   
    var legend = g.append("g")
      .attr("class", "legend")
      .attr("x", 0)
      .attr("y", 25)
      .attr("height", 100)
      .attr("width", 100);

    // array of different breach types 
    var differentBreaches = ["DISC","PORT","INSD","STAT","PHYS","HACK","CARD"];

    // rectangles for legend
    legend.selectAll('g')
        .data(differentBreaches)
        .enter()
        .append("rect")
        .attr("x", width)
        .attr("y", function(d,i){ return i*25})
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d){
            console.log(d);
            return typeColor(d);
        });

    // text for legend
    legend.selectAll('g')
        .data(differentBreaches)
        .enter()
        .append("text")
        .attr("x", width - 45)
        .attr("y", function(d,i){ return i*25+10})
        .text(function(d){return d});


    var records = [];
    for (i = 0; i < formattedData[active_index].length; i++) {
        records.push(formattedData[active_index][i].Total_Records)
    }
    
    
    var maxBreaches = Math.max(...records)
    //Moves to the next highest power of 10 to force the axis to never include
    //non-labeled ticks
    maxBreaches = Math.pow(10, Math.ceil(Math.log10(maxBreaches)))

    // scale for the x axis
    var x = d3.scaleTime()
        .range([0, width])
        .domain([new Date(2004, 0, 1), new Date(2018, 11, 31)]);

    // scale for the y axis
    var y = d3.scaleLog()
        .base(10)
        .range([height, 0])
        .domain([1, maxBreaches]);

    // x axis call
    var xAxisCall = d3.axisBottom(x)
        .scale(x)
        .tickFormat(d3.timeFormat("%b. %Y"));
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisCall);

    // x axis call
    var yAxisCall = d3.axisLeft(y)
        .scale(y, "s")
        .ticks(5, ".0s")
    g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

    // adds circles to the graph
    g.selectAll("circles")
        .data(formattedData[active_index])
        .enter()
        .append("circle")
        .attr("cx", function (s) {
            return x(s.Date)
        })
        .attr("cy", function (s) {
            return y(s.Total_Records)
        })
        .attr("r", 4)
        .attr("fill", function (s) {
            return typeColor(s.Breach_Type)
        })

    // number of breaches and records lost
    changeText(active_index);
    enterPlot(formattedData[active_index]);

    // function that is given state and displays the proper data 
    function enterPlot(state) {

        var records = [];
        for (i = 0; i < state.length; i++) {
            records.push(state[i].Total_Records)
        }
        var maxBreaches = Math.max(...records)
        maxBreaches = Math.pow(10, Math.ceil(Math.log10(maxBreaches)))

        var y = d3.scaleLog()
            .base(10)
            .range([height, 0])
            .domain([1, maxBreaches]);

        g.selectAll(".title")
            .remove()
        g.append("text")
            .attr("class", "title")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text(data[active_index].State);

        // Y Axis
        var yAxisCall = d3.axisLeft(y)
            .scale(y, "s")
            .ticks(5, ".0s")

        g.select(".y")
            .transition()
            .call(yAxisCall)

        //should return to center, load new data, move to postion
        //skips right to loading and assigned position
        g.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cx", width / 2)
            .attr("cy", height / 2)
        g.selectAll("circle")
            .remove()
            .exit()
        g.selectAll("circle")
            .data(state)
            .enter()
            .append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", 4)
            .attr("fill", function (s) {
                return typeColor(s.Breach_Type)
            })
            .transition()
            .ease(d3.easeCircleOut)
            .duration(1000)
            .attr("cx", function (s) {
                return x(s.Date)
            })
            .attr("cy", function (s) {
                return y(s.Total_Records)
            });

            // tooltip on hover for chart
            g.selectAll("circle")
                .on("mouseover", function(s) {      
                    // bring to view
                    div.transition()        
                        .duration(200)      
                        .style("opacity", .9);  

                    // edit the text       
                    div.html(s.Total_Records + " Records Lost")  
                        .style("left", (d3.event.pageX) + "px")     
                        .style("top", (d3.event.pageY - 28) + "px");
                    
                    // regex for commons
                    $(".tooltip").digits();
                })                  
                .on("mouseout", function(d) {       
                    div.transition()        
                        .duration(500)      
                        .style("opacity", 0);   
                });
    }

     // checks for hover and display amount of breaches
    $(document).ready(function () {
        //index of state

        var index = 0;
        $("path").hover(function () {
            // index in array of state
            index = data.findIndex(x => x.State == this.id);

            // bring tooltip to view
            d3.select("#tooltip").transition().duration(200).style("opacity", 1);
            // change text in tooltip
            d3.select("#tooltip").html(tooltipHtml(this.id, formattedData[index].length))
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        }, function () {
            // set tooltip back to 0 opacity
            d3.select("#tooltip").transition().duration(500).style("opacity", 0);
        });

        // draws grapth on click of state
        $('path').click(function () {
            //Doesn't redraw the plot if it's the same state
            if (index != active_index) {
                active_index = index
                enterPlot(formattedData[index])
            }

            changeText(index);
            $('html, body').animate({
                scrollTop: ($('#chart-area').offset().top)
            },500);
        });
    });

    //changes text for breach amount and records lost
    function changeText(index){
        var recordsLost = 0;
        for(var i=0;i<data[index].Breaches.length;i++){
            recordsLost += data[index].Breaches[i].Total_Records;
        }
       
        $("#records-lost").text("In "+data[index].State+" There Were "+recordsLost+" Records Lost");
        $("#breaches-total").text("With a Total of "+data[index].Breaches.length+" Breaches");

        $("#records-lost").digits();
        $("#breaches-total").digits();
    }
});

// simple fucntion to add tooltip and display breaches
function tooltipHtml(n, d) {
    return "<h4>" + n + "</h4><table>" +
        "<tr><td>Breaches: </td><td>" + (d) + "</td></tr>" +
        "</table>";
}

 // Thanks @Paul Creasey for the regex 
$.fn.digits = function(){ 
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
}






