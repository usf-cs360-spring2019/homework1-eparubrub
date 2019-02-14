var occurrences_time = {};
var timeData = [];
var timeAxis = [];
var len, svg, bandScale;

d3.csv("policeData.csv").then(function(data){

    // var format = d3.timeParse("%H:%M");
    data.forEach(function(d){
        d["Incident Time"] = d["Incident Time"].substring(0, d["Incident Time"].length -3);
    });
    // console.log(data[0]);

    // //get occurrences of a specific field
    for (var i = 0; i < data.length; i++) {
        occurrences_time[data[i]["Incident Time"]] = (occurrences_time[data[i]["Incident Time"]] || 0) + 1;
    }

    
    // console.log("after:", occurrences_time);
    var sortable = [];
    for (var category in occurrences_time) {
        sortable.push([category, occurrences_time[category]]);
    }
    sortable.sort(function(a, b) {
        return a[0] - b[0];
    });
    console.log("sortable: ", sortable)
    
    // //add the filtered data to an array
    for (i in sortable) {
        var convert_var = i.toString();
        console.log(i)

        //hour conversions
        if(i == 0){
            convert_var = "12AM"
        }
        else if(i<12 && i>0){
            convert_var += "AM"
        }
        else if(i == 12){
            convert_var = "12PM"
        }
        else if(i < 24){
            convert_var = (i - 12).toString() + "PM"
        }
        object = {
            time: convert_var,
            value: sortable[i][1]
        }
        object2 = {
            time: parseInt(i),
            value: sortable[i][1]
        }
        timeAxis.push(object)
        timeData.push(object2);
    }
    console.log("time data:", timeData);
    createChart1();
})



function createChart3(){
    svg = d3.select("#vis1")
    .append("svg")
    
    var width = 950;
    var height = 500;
    var padding = 160;
    
    svg.attr("width", width)
        .attr("height", height)

    var times = timeData.map(function(d){
        return d.time;
    })

    var xScale = d3.scaleLinear()
                .domain(times)
                .range([0,width])
                // .padding(0.3);

    var yScale = d3.scaleLinear()
                .domain([0, 800])
                .range([height, 0]);

    var xAxisCustom = svg.append("g")
                .classed("xAxis", true)
                .attr('transform', 'translate(+68, +440)')
                .call(d3.axisBottom(xScale))
                .selectAll('.domain, .tick line').remove()

    var yAxis = d3.axisLeft(yScale)
                .tickSize(-width)

    var yAxisCustom = svg.append("g")
                 .classed("yAxis",true)
                 .attr('transform', 'translate(+68, +90)')
                 .call(yAxis)
                 .selectAll('.domain').remove();

    var line = d3.line()
                .x(function(d,i) { return i})
                .y(function(d) { return d.value})
                .curve(d3.curveMonotoneX)
    
    // svg.selectAll(".dot")
    //     .data(timeData)
    //     .enter().append("circle") 

    svg.append("path")
                .datum(timeData) 
                .attr("class", "line") 
                .attr('transform', 'translate(+180, -180)')
                .attr("d", line);

    svg.append('text')
        .attr('y', +480)
        .attr('x', +450)
        .attr('class', 'axis_label')
        .text("Hour of Incident Time")
    
    svg.append('text')
        .attr('y', +30)
        .attr('x', -340)
        .attr("transform", 'rotate(-90)')
        .attr('class', 'axis_label')
        .text("Number of Incident")

    svg.append('text')
        .attr('y', +30)
        .attr('x', +300)
        .attr('class', 'title')
        .text("Number of Incidents by Time(Hour) of Day")

}


function createChart1(){
    var margin = {top: 50, right: 50, bottom: 100, left: 50}
    , width = 950 // Use the window's width 
    , height = 400; // Use the window's height

  // The number of datapoints
  var n = 24;
  
    var times = timeAxis.map(function(d){
        return d.time;
    })
    var xScale = d3.scaleLinear()
      .domain([0, times]) // input
      .range([0, 700]); // output

  var xScale = d3.scaleLinear()
      .domain([0, n-1]) // input
      .range([0, 700]); // output
  
  // 6. Y scale will use the randomly generate number 
  var yScale = d3.scaleLinear()
      .domain([0, 800]) // input 
      .range([height, 0]); // output 
  
  // 7. d3's line generator
  var line = d3.line()
      .x(function(d) { return xScale(d.time)+80; }) // set the x values for the line generator
      .y(function(d) { return yScale(d.value)+40; }) // set the y values for the line generator 
    //   .curve(d3.curveMonotoneX) // apply smoothing to the line
  
  // 1. Add the SVG to the page and employ #2
  var svg = d3.select("#vis1").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate("+ margin.left + "," + margin.top + ")");

  var yAxis = d3.axisLeft(yScale)
        .tickSize(-width + 150)

  var yAxisCustom = svg.append("g")
        .classed("yAxis",true)
        .attr('transform', 'translate(+50, +40)')
        .call(yAxis)
        .selectAll('.domain').remove();
    
// console.log("times: ", times)
//     var vScale = d3.scaleLinear()
//         .domain(times)
//         .range([0,width])
        
//     svg.append("g")
//         .classed("xAxis", true)
//         .attr('transform', 'translate(+68, +440)')
//         .call(d3.axisBottom(vScale))
//         .selectAll('.domain, .tick line').remove()
  
//   3. Call the x axis in a group tag
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(+50, +440)")
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom
    
  svg.append("path")
      .datum(timeData) // 10. Binds data to the line 
      .attr("class", "line") // Assign a class for styling 
      .attr("d", line); // 11. Calls the line generator 
    
  svg.append('text')
      .attr('y', +480)
      .attr('x', +420)
      .attr('class', 'axis_label')
      .text("Hour of Incident Time")
  
  svg.append('text')
      .attr('y', +0)
      .attr('x', -300)
      .attr("transform", 'rotate(-90)')
      .attr('class', 'axis_label')
      .text("Number of Incidents")

  svg.append('text')
      .attr('y', +0)
      .attr('x', +300)
      .attr('class', 'title')
      .text("Number of Incidents by Time(Hour) of Day")

}
