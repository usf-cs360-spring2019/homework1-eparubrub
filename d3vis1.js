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
    
    var spacer = 0;
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
        if (spacer == 0){
            timeAxis.push(object)
        }
        timeData.push(object2);
        if (spacer == 1)
            spacer = 0;
        else
            spacer = 1
    }          
    object = {
        time: "12AM",
        value: 120
    }  
    timeAxis.push(object)

    console.log("time Axis:", timeAxis);
    console.log("time data:", timeData);
    createChart1();
})

function createChart1(){
    var margin = {top: 50, right: 50, bottom: 100, left: 50}
    , width = 950 
    , height = 400; 

    var n = 24;
    
    var times = timeAxis.map(function(d){
        return d.time;
    })

    console.log("yer: ", times)

    var vScale = d3.scaleBand()
        .domain(times)
        .range([0, 725]); 

    var xScale = d3.scaleLinear()
        .domain([0, n-1])
        .range([0, 700]);
    
    var yScale = d3.scaleLinear()
        .domain([0, 800]) 
        .range([height, 0]);
    
    var line = d3.line()
        .x(function(d) { return xScale(d.time)+80; }) 
        .y(function(d) { return yScale(d.value)+40; }) 

    var svg = d3.select("#vis1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate("+ margin.left + "," + margin.top + ")");

    var yAxis = d3.axisLeft(yScale)
            .tickSize(-width + 150)

    var yAxisCustom = svg.append("g")
            .classed("yAxis",true)
            .attr('transform', 'translate(+40, +40)')
            .call(yAxis)
            .selectAll('.domain').remove();
            
        svg.append("g")
            .classed("xAxis", true)
            .attr('transform', 'translate(+45, +440)')
            .call(d3.axisBottom(vScale))
            .selectAll('.domain, .tick line').remove()
        
    svg.append("path")
        .datum(timeData)
        .attr("class", "line") 
        .attr("d", line);
        
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
