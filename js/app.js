var pack = d3.layout.pack();

var width = 800;
var height = 800;
var curX = 15;
var curY = 25;

obj = {"sex" : "male"}
var d;

d3.csv("../titanic3.csv", function(err, data) {
    d = data;
    render(data, 0)
});

var svg;

btn = document.getElementById("hello");
btn.addEventListener("click", function() {
    update();
})

function render(data, filter) {
    //console.log(data.length);
    svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
        
    var circles = svg.selectAll("circle")
        .data(function() {
            if (filter) {
                return data.filter(function (d) {
                    return d.sex == "male";
                });
            } else {
                return data;
            }
        })
        .enter()
        .append("circle");
        
    circles
        .attr("cx", function(d, i) {
            return ((i * 20) + 10) % width;
        })
        .attr("cy", function(d, i) {
            return (50/2) * Math.floor(((i * 20) + 15) / width) + 15;
        })	
       .attr("stroke", function(d) {
           if (d.age < 18) {
               return "red";
           } else {
               return "black";
           }
       })
       .attr("stroke-width", 2)
       .attr("r", function(d) {
            return 5;
       })
       .attr("fill", function(d) {
           if (d.sex == "female") {
               return "pink";
           } else {
               return "blue";
           }
       });
}

function update() {
    var circles = svg.selectAll("circle")
        .data(d.filter(function(d) {
            return d.sex == "male";
        }))
        .attr("cx", function(d, i) {
            return ((i * 20) + 10) % width;
        })
        .attr("cy", function(d, i) {
            return (50/2) * Math.floor(((i * 20) + 15) / width) + 15;
        })	
       .attr("stroke", function(d) {
           if (d.age < 18) {
               return "red";
           } else {
               return "black";
           }
       })
       .attr("stroke-width", 2)
       .attr("r", function(d) {
            return 5;
       })
       .attr("fill", function(d) {
           if (d.sex == "female") {
               return "pink";
           } else {
               return "blue";
           }
       });
    // ENTER
    // Create new elements as needed.
    // circles.enter().append("circle")
        
    // circles.text(function (d) { return d; });
    // EXIT
    // Remove old elements as needed.
    circles.exit().remove();
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