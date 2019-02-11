// let thisData = [];

// const svg = select('svg');
// const width = +svg.attr('width');
// const height = +svg.attr('height');

// const render = data =>{
//     svg.selectAll('rect').data(data)
//         .enter().append('rect')
//             .attr('width', 300)
//             .attr('height', 300)

// }





var occurrences = {};
var len;

d3.csv("policeData.csv").then(function(data){
    var format = d3.timeParse("%H:%M");
    data.forEach(function(d){
        d["Incident Time"] = format(d["Incident Time"]);
    });
    console.log(data[0]);
    console.log(data.length);
    //get occurrences of a specific field
    for (var i = 0; i < data.length; i++) {
        occurrences[data[i]["Incident Category"]] = (occurrences[data[i]["Incident Category"]] || 0) + 1;
    }

    //sort the object of values
    var sortable = [];
    for (var category in occurrences) {
        sortable.push([category, occurrences[category]]);
    }
    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });

    //add the filtered data to an array
    var filteredData = [];
    for (var i = sortable.length-1; i > sortable.length-11; i--) {
        filteredData.push(sortable[i]);
    }
    console.log(filteredData);
    createChart();
});

function createChart(){
    var svg = d3.select("#vis1")
    .append("svg")
    
    var width = 500;
    var height = 300;

    svg.attr("width", width)
    .attr("height", height)

    svg.selectAll("rect")
    .data(thisData)
    .enter()
    .append("rect")
    .attr("x", function(d, i){ //index multiplied by 20 to space out
        return i * 20 + i;
    })
    .attr("y", function(d){//flip the x axis because it naturally grows down
        return height - d
    })
    .attr("width", 20)
    .attr("height", function(d){
        return d;
    });

}





