// margins for the svg
var margin = {left: 80, right: 20, top: 50, bottom: 100};
var height = 500 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

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
        $("[id='" + curr + "']").css('fill', color(formattedData[i].length));
    }

    // calculates total breaches
    var tot = 0
    for (var i = 0; i < formattedData.length; i++)
        tot += formattedData[i].length;

    // displays the total amount of breaches
    $("#breach-amount").text("During this time there were " + tot + " total breaches");

    //keeps track of which state is plotted
    //Starts at 40 for South Carolina
    var active_index = 40

    // adds chart 
    var g = d3.select("#chart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left +
            ", " + margin.top + ")");


    var plot_title = changeText(formattedData[active_index])
    console.log(plot_title)
    // adds the title for the chart
    g.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(plot_title);

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
        .attr("x", -170)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Number of Records")

    // determines color of the dot on graph
    var typeColor = []
    typeColor[0] = d3.scaleOrdinal(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2"]);
    typeColor[1] = d3.scaleOrdinal(["#1f77b4", "#ff7f0e00", "#2ca02c00", "#d6272800", "#9467bd00", "#8c564b00", "#e377c200"]);
    typeColor[2] = d3.scaleOrdinal(["#1f77b400", "#ff7f0e", "#2ca02c00", "#d6272800", "#9467bd00", "#8c564b00", "#e377c200"]);
    typeColor[3] = d3.scaleOrdinal(["#1f77b400", "#ff7f0e00", "#2ca02c", "#d6272800", "#9467bd00", "#8c564b00", "#e377c200"]);
    typeColor[4] = d3.scaleOrdinal(["#1f77b400", "#ff7f0e00", "#2ca02c00", "#d62728", "#9467bd00", "#8c564b00", "#e377c200"]);
    typeColor[5] = d3.scaleOrdinal(["#1f77b400", "#ff7f0e00", "#2ca02c00", "#d6272800", "#9467bd", "#8c564b00", "#e377c200"]);
    typeColor[6] = d3.scaleOrdinal(["#1f77b400", "#ff7f0e00", "#2ca02c00", "#d6272800", "#9467bd00", "#8c564b", "#e377c200"]);
    typeColor[7] = d3.scaleOrdinal(["#1f77b400", "#ff7f0e00", "#2ca02c00", "#d6272800", "#9467bd00", "#8c564b00", "#e377c2"]);
console.log(d3.schemeCategory10)

    // add the legend
    var legend = g.append("g")
        .attr("class", "legend")
        .attr("x", 0)
        .attr("y", 25)
        .attr("height", 100)
        .attr("width", 100);

    // array of different breach types 

    var differentBreaches = ["DISC", "PORT", "INSD", "STAT", "PHYS", "HACK", "CARD"];
    var breachNames = ["Unintended Disclosure","Portable Device","Insider","Stationary Device","Physical Loss","Hacking","Card Fraud"];

    // rectangles for legend
    legend.selectAll('g')
        .data(differentBreaches)
        .enter()
        .append("rect")
        .attr("y", height + 30)
        .attr("x", function (d, i) {
            return i * 45
        })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d) {
            console.log(d);
            return typeColor[0](d);
        });

    // text for legend
    legend.selectAll('g')
        .data(differentBreaches)
        .enter()
        .append("text")
        .attr("y", height + 55)
        .attr("x", function (d, i) {
            return i * 45 -12
        })
        .text(function (d) {
            return d
        });


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

    var active_scheme = 0

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
            return typeColor[active_scheme](s.Breach_Type)
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
            .text(changeText(formattedData[active_index]));

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
                return typeColor[active_scheme](s.Breach_Type)
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
            .on("mouseover", function (s) {
                // bring to view
                div.transition()
                    .duration(200)
                    .style("opacity", .9);

                // edit the text
                if (s.Total_Records == 1.001) {
                    div.html("Unknown Records Lost")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                } else if (s.Total_Records == 1) {
                    div.html(s.Total_Records + " Record Lost")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                } else {
                    div.html(s.Total_Records + " Records Lost")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                }

                // regex for commons
                $(".tooltip").digits();
            })
            .on("mouseout", function (d) {
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

            // change title of the graph
            changeText(index);
            $('html, body').animate({
                scrollTop: ($('#chart-area').offset().top)
            }, 500);
        });
    });

    // changes text in the title of the scatterplot
    function changeText(state) {
        var recordsLost = 0;
        for (var i = 0; i < state.length; i++) {
            recordsLost += state[i].Total_Records;
        }

        return data[active_index].State + " - Records Exposed: " + d3.format(",")(Math.floor(recordsLost)) + " - Breaches: " + state.length
    }

    // sourced from https://codepen.io/tarsusi/pen/reovOV
    // on change of the dropdown
    d3.select("select")
        .on("change", function (d) {
            active_scheme = selected = d3.select("#d3-dropdown").node().value;
            console.log(active_scheme)
            g.selectAll("circle")
                .attr("fill", function (s) {
                    return typeColor[active_scheme](s.Breach_Type)
                })
        })
});

// simple fucntion to add tooltip and display breaches
function tooltipHtml(n, d) {
    return "<h4>" + n + "</h4><table>" +
        "<tr><td>Breaches: </td><td>" + (d) + "</td></tr>" +
        "</table>";
}

