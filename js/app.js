var pack = d3.layout.pack();

d3.csv("../titanic3.csv", function(err, data) {
    render(data)
});

function render(data) {
    //console.log(data.length);
    var svg = d3.select("body").append("svg")
        .attr("width", 1000)
        .attr("height", 500);
        
    var circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle");
        
    circles
        .attr("cx", function(d, i) {
            return (i * 25) + 15;
        })
       .attr("cy", 50/2)
       .attr("r", function(d) {
            return 5;
       })
       .attr("fill", function(d) {
           if (d.sex == "female") {
               return "purple"
           } else {
               return "blue"
           }
       });
}

/*
    data = {className:"", children:data};
    var chart = d3.select("#chart").append("svg:svg")
        .attr("width", 100)
        .attr("height", 100)
        .attr("class", "bubble");

    var node = chart.selectAll("g.node")
        .data(pack.nodes(data))
        .enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", function(d, i) {
                console.log(d);
                return "translate(" + i * 100 + "," + i * 100 + ")";
            });
            
    node.append("svg:circle")
        .attr("r", function (d) { return 100; })
        .style("fill", function (d) { return "purple"; });
*/