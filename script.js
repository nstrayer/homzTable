//just some nonsense to move objects to front easily.
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

var width = parseInt(d3.select("#viz").style("width").slice(0, -2)) - 20,
    height = $(window).height() - 85,
    padding = 30,
    color = "#4daf4a"
    selectedColor = "#e41a1c";

var svg = d3.select("#viz").append("svg")
    .attr("height", height)
    .attr("width", width)

//We want to have the steps equaly spaced across the screen
var x = d3.scale.linear()
    .domain([-0.3,1.3])
    .range([padding*4, width - padding*4]);

//A counter variable to keep track of where we are in the visualization.
var count = 0

d3.csv("asfTable.csv", function(data){

    //Quick! Clean up the import!
    data.forEach(function(d){
        d["alleleFreq"] = +d["allele.freq"]
        d["asHomz"] = +d["as.homz"]
    })
    console.table(data)

        //Set up scaling functions for each of the displayed statistics.
        //There is probably a more efficient way of doing this, but given that
        //both scales are called at the same time in the lines I couldn't think of one.

        var freqScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d){return d.alleleFreq})])
            .range([height - padding, padding*2])

        var homzScale = d3.scale.linear()
            .domain([0,1])
            .range([height - padding, padding*2])

        var scales = [freqScale, homzScale]

        svg.selectAll(".axis")
            .data(scales).enter()
            .append("g")
            .attr("transform", function(d,i){return "translate(" + x(i) + ", 0)"})
            .attr("class", function(d,i){return "axis axis" + i })
            .each(function(d,i){
                d3.select(this).call(
                    d3.svg.axis()
                      .scale(d)
                      .orient("left")  )
            })

        //First we draw the axis lines:
        steps = ["Allele Frequency", "Homozygosity"]

        svg.selectAll(".axisLineText")
            .data(steps).enter()
            .append("text")
            .attr("x", function(d,i){return x(i)})
            .attr("y", padding)
            .text(function(d){return d})
            .attr("font-family", "optima")
            .attr("font-size", "15px")
            .attr("text-anchor", "middle")
            .style("fill", "black")

        //Start drawing the trend lines.
        //This is broken up into different steps because in order to animate the lines,
        //they must already be drawn. This also allows us to attach data to them.

        svg.selectAll(".step0")
            .data(data)
            .enter()
            .append("line")
            .attr("id", function(d,i){return "step0_line" + i})
            .attr("class", "lines")
            .attr("x1", x(0) )     // x position of the first end of the line
            .attr("y1", function(d){return freqScale(d.alleleFreq)})      // y position of the first end of the line
            .attr("x2", x(1))     // x position of the second end of the line
            .attr("y2", function(d){return homzScale(d.asHomz)})    // y position of the second end of the line
            .attr("stroke", color)
            .attr("stroke-width", 1)
            .on("mouseover", function(d){
                d3.select("#loci").text(d.loci)
                d3.select("#focal").text(d.focal)
                d3.select("#allele").text(d.allele)
                d3.selectAll(".lines").attr("stroke-width", 1)
                    .attr("stroke", color)
                d3.select(this).attr("stroke-width", 4)
                    .attr("stroke", selectedColor)
            })



})
