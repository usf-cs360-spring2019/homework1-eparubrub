var occurrences = {};
var filteredData = [];
var len, svg, bandScale;

d3.csv("policeData.csv").then(function(data){
    var format = d3.timeParse("%H:%M");
    data.forEach(function(d){
        d["Incident Time"] = format(d["Incident Time"]);
    });
    // console.log(data[0]);
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
    // console.log(filteredData);
    createChart2();
});

function createChart2(){
    svg = d3.select("#vis2")
    .append("svg")
    
    var width = 950;
    var height = 500;
    var padding = 110;

    svg.attr("width", width)
       .attr("height", height)

    var category_names = filteredData.map(function(d){
        return d.category;
    })

    bandScale = d3.scaleBand()
                      .domain(category_names)
                      .range([0,width - padding])
                      .padding(0.3);

    var heightScale = d3.scaleLinear()
                        .domain([0, 4000])
                        .range([0,height - padding]);

    var yScale = d3.scaleLinear()
                        .domain([0, 4000])
                        .range([height - padding, 0]);



    var xAxisCustom = svg.append("g")
                .classed("xAxis", true)
                .attr('transform', 'translate(+68, +480)')
                .call(d3.axisBottom(bandScale))
                .selectAll('.domain, .tick line').remove();
                

    var yAxis = d3.axisLeft(yScale)
                .tickSize(-width)

    var yAxisCustomize = svg.append("g")
                 .classed("yAxis",true)
                 .attr('transform', 'translate(+68, +90)')
                 .call(yAxis)
                 .selectAll('.domain').remove();
                 

    svg.selectAll("rect")
        .data(filteredData)
        .enter()
        .append("rect")
        .attr("x", function(d, i){ //index multiplied by 20 to space out
            return bandScale(d.category) + 70;
        })
        .attr("y", function(d){//flip the x axis because it naturally grows down
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

    svg.selectAll("text.filteredData")
        .data(filteredData)
        .enter()
        .append("text")
        .text(function(d) { return d.value; })
        .attr("x", function(d, i){ //index multiplied by 20 to space out
            return bandScale(d.category) + 99;
        })
        .attr("y", function(d){
            return height - heightScale(d.value) - 25;
        })
        .attr("font-family" , "sans-serif")
        .attr("font-size" , "11px")
        .attr("fill" , "black")
        .attr("text-anchor", "middle")

    


        
    //SORTING FUNCTION FOR LATER ON
    
    // d3.select("input")
    //   .on("change", toggleSort);

    // function toggleSort(){

    //     var sortComparer;
    //     if (this.checked) {
    //         //sort by occurrences
    //         sortComparer = function(a,b){
    //             return b.category - a.category;
    //         }
    //     }
    //     else{
    //         //sort by original order
    //         sortComparer = function(a,b){
    //             return a.category - b.category;
    //         }
    //     }

    //     filteredData.sort(sortComparer);
    //     var categoryOrder = filteredData.map(function(d){
    //         return d.category;
    //     });

    //     bandScale.domain(categoryOrder);

    //     svg.transition()
    //        .selectAll("rect")
    //        .attr("x", function(d){
    //             return bandScale(d.category)
    //        });
    // }

    

}





