var occurrences = {};
var filteredData = [];
var len, svg, bandScale;

//collect and filter data
d3.csv("policeData.csv").then(function(data){
    var format = d3.timeParse("%H:%M");
    data.forEach(function(d){
        d["Incident Time"] = format(d["Incident Time"]);
    });

    //get occurrences of a specific field
    for (var i = 0; i < data.length; i++) {
        occurrences[data[i]["Incident Category"]] = (occurrences[data[i]["Incident Category"]] || 0) + 1;
    }

    //sort the object of values from greatest to least
    var sortable = [];
    for (var category in occurrences) {
        sortable.push([category, occurrences[category]]);
    }
    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });

    //add the filtered data to an array
    for (var i = sortable.length-1; i > sortable.length-11; i--) {
        object={
            category: sortable[i][0],
            value: sortable[i][1]
        }
        filteredData.push(object);
    }
    createChart2();
});

function createChart2(){
    svg = d3.select("#vis2")
        .append("svg")
    
    var width = 950
    , height = 500
    , padding = 110;

    svg.attr("width", width)
       .attr("height", height)

    //maps category name to a variable
    var category_names = filteredData.map(function(d){
        return d.category;
    })

    //bar scale
    bandScale = d3.scaleBand()
        .domain(category_names)
        .range([0,width - padding])
        .padding(0.3);

    //height scale
    var heightScale = d3.scaleLinear()
        .domain([0, 4000])
        .range([0,height - padding]);

    //scale for the y axis
    var yScale = d3.scaleLinear()
        .domain([0, 4000])
        .range([height - padding, 0]);
    
    var yAxis = d3.axisLeft(yScale)
        .tickSize(-width)

    //adds the x axis and cusomizations
    svg.append("g")
        .classed("xAxis", true)
        .attr('transform', 'translate(+68, +480)')
        .call(d3.axisBottom(bandScale))
        .selectAll('.domain, .tick line').remove();

    //adds the y axis and cusomizations
    svg.append("g")
        .classed("yAxis",true)
        .attr('transform', 'translate(+68, +90)')
        .call(yAxis)
        .selectAll('.domain').remove();
                 
    //bar creation and customization
    svg.selectAll("rect")
        .data(filteredData)
        .enter()
        .append("rect")
        .attr("x", function(d, i){ 
            return bandScale(d.category) + 70;
        })
        .attr("y", function(d){
            return height - heightScale(d.value) - 20;
        })
        .attr("width", function(d){
            return bandScale.bandwidth()
        })
        .attr("height", function(d){
            return heightScale(d.value);
        })
        .style('fill', 'darkorange')
        .append("title")
        .text(function(d){
            return d.category;
        })
    
    //text labels
    svg.append('text')
        .attr('y', +70)
        .attr('x', +450)
        .attr('class', 'axis_label')
        .text("Incident Category")
    
    svg.append('text')
        .attr('y', +30)
        .attr('x', -340)
        .attr("transform", 'rotate(-90)')
        .attr('class', 'axis_label')
        .text("Number of Incidents")

    svg.append('text')
        .attr('y', +30)
        .attr('x', +300)
        .attr('class', 'title')
        .text("Top 10 Categories per Number of Incidents")

    //adds numbers to the tops of the bars
    svg.selectAll("text.filteredData")
        .data(filteredData)
        .enter()
        .append("text")
        .text(function(d) { return d.value; })
        .attr("x", function(d){
            return bandScale(d.category) + 99;
        })
        .attr("y", function(d){
            return height - heightScale(d.value) - 25;
        })
        .attr("font-family" , "sans-serif")
        .attr("font-size" , "11px")
        .attr("fill" , "black")
        .attr("text-anchor", "middle")
}





