var pack = d3.layout.pack();

d3.csv("../titanic3.csv", function(err, data) {
    render(data)
});

function render(data) {
    console.log(data);
    var chart = d3.select("body").append("svg:svg")
        .attr("width", 100)
        .attr("height", 100)
        .attr("class", "bubble");

    var node = chart.selectAll("g.node")
        .data(pack.nodes(data))
        .enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
            
    node.append("svg:circle")
        .attr("r", function (d) { return d.r; })
        .style("fill", function (d) { return fill(d.packageName); });
}