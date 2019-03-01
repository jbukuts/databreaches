// load in the states names and abbreviations to check in data
var states_file = [];
d3.json("data/states_titlecase.json").then(function (data) {
    states_file = data;
    //console.log(states_file);
});

var margin = {left: 80, right: 20, top: 50, bottom: 100};
var height = 500 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

d3.json("data/data.json").then(function (data) {

    parseDate = d3.timeParse("%Y-%m-%d")

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

    var tot = 0;
    for(var i=0;i<data.length;i++){
        tot += data[i].Breaches.length;
    }
    console.log(tot);

    console.log(formattedData);

    // see the json loaded
    console.log(states_file);

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
    for (var i = 0; i < data.length; i++) {
        var curr = data[i].State;
        $("[id='"+curr+"']").css('fill', color(data[i].Breaches.length));
    }

    // displays the total amount of breaches
    $("#breach-amount").text("there were " + states_amount.reduce(function (total, num) {
        return total + num
    }) + " total breaches");
    //keeps track of which state is plotted
    var active_index = 0
    // checks for hover and display amount of breaches
    $(document).ready(function () {
        //index of state

        var index = 0;
        $("path").hover(function () {
            // index in array of state
            index = states_file.findIndex(x => x.name == this.id);

            // console.log(this.id + ": " + states_amount[index]);
            // bring tooltip to view
            d3.select("#tooltip").transition().duration(200).style("opacity", 1);
            // change text in tooltip
            d3.select("#tooltip").html(tooltipHtml(this.id, data[index].Breaches.length))
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        }, function () {
            // set tooltip back to 0 opacity
            d3.select("#tooltip").transition().duration(500).style("opacity", 0);
        }); 

        // draws grapth on click of state
        $('path').click(function(){
            //Doesn't redraw the plot if it's the same state
            if(index != active_index){
                enterPlot(formattedData[index])
                active_index = index
            }
        });
    });




    var g = d3.select("#chart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left +
            ", " + margin.top + ")");

    var xLabel = g.append("text")
        .attr("y", height + 50)
        .attr("x", width / 2)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Date");
    var yLabel = g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -170)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Number of Records")
    var typeColor = d3.scaleOrdinal(d3.schemeAccent)
    var records = [];
    for (i = 0; i < formattedData[0].length; i++) {
        records.push(formattedData[0][i].Total_Records)
    }

    var maxBreaches = Math.max(...records)
    //Moves to the next highest power of 10 to force the axis to never include
    //non-labeled ticks
    maxBreaches = Math.pow(10, Math.ceil(Math.log10(maxBreaches)))

    var x = d3.scaleTime()
        .range([0, width])
        .domain([new Date(2004, 0, 1), new Date(2018, 11, 31)]);

    var y = d3.scaleLog()
        .base(10)
        .range([height, 0])
        .domain([1, maxBreaches]);

// X Axis
    var xAxisCall = d3.axisBottom(x)
        .scale(x)
        .tickFormat(d3.timeFormat("%b. %Y"));
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisCall);

// Y Axis
    var yAxisCall = d3.axisLeft(y)
        .scale(y, "s")
        .ticks(5, ".0s")

    g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

    g.selectAll("circles")
        .data(formattedData[0])
        .enter()
        .append("circle")
        .attr("cx", function (s) {
            return x(s.Date)
        })
        .attr("cy", function (s) {
            return y(s.Total_Records)
        })
        .attr("r", 3)
        .attr("fill", function (s) {
            return typeColor(s.Breach_Type)
        })


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
            .attr("r", 3)
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
                })


        /*        g.selectAll("circle")
                    .remove()
                    .enter()
                    .data(state)
                    .enter()
                    .append("circle")
                    .transition()
                    .attr("cx", function (s) {
                        return x(s.Date)
                    })
                    .attr("cy", function (s) {
                        return y(s.Total_Records)
                    })
                    .attr("r", 3)
                    .attr("fill", function (s) {
                        return typeColor(s.Breach_Type)
                    })*/
    }
});


// simple fucntion to add tooltip and display breaches
function tooltipHtml(n, d) {
    return "<h4>" + n + "</h4><table>" +
        "<tr><td>Breaches: </td><td>" + (d) + "</td></tr>" +
        "</table>";
}


// quick function to return a random num between hi and low
function getRandom(lo = 0, hi) {
    return Math.floor(Math.random() * hi) + lo;
}






