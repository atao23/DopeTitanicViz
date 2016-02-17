// var width = 600;
// var height = 400;
// var curX = 15;
// var curY = 25;

var classGroups = [{data:[]},{data:[]},{data:[]}];

d3.csv("../titanic3.csv", function(err, data) {
    for (var i = 0; i < data.length; i++) {
        var person = data[i];
        var pclass = person.pclass;
        classGroups[pclass - 1]["data"].push(person);
    }
    for (var i = 0; i < classGroups.length; i++) {
        classGroups[i]["parent"] = render(classGroups[i].data, 0)
    }
});

function render(data) {
    //console.log(data.length);
    // data = data.slice(0, 100);
    // var treeData = {children : data.map(function(d) {
    //     return {size: 5}
    // })};
    // var w = 400;
    // var m = 20;
    // var maxRadius = 50;
    // var padding = 10;
    
    // // size scale for data
    // var radiusScale = d3.scale.sqrt()
    //     .domain([0, 20])
    //     .range([0, maxRadius]);
    
    // var roughCircumference = 5;

    // // make a radial tree layout
    // var tree = d3.layout.tree()
    //     .size([360, 50])
    //     .separation(function(a, b) {
    //         //return radiusScale(a.size) + radiusScale(b.size);
    //         return 10;
    //     });
        
    // var svg = d3.select("body").append("svg")
    //     .attr("width", w + m * 2)
    //     .attr("height", w + m * 2)
    //     .append("g")
    //     .attr("transform", "translate(" + (w / 2 + m) + "," + (w / 2 + m) + ")");

    // var nodes = tree.nodes(treeData);

    // // create dom elements for the node
    // var node = svg.selectAll(".node")
    //     .data(function() {
    //         console.log(nodes, "1");
    //         var n = nodes.slice(1);
    //         console.log(nodes, "2");
    //         return n;
    //     }) // cut out the root node, we don't need it
    //     .enter().append("g")
    //     .attr("class", "node")
    //     .attr("transform", function (d) {
    //         return "rotate(" + (d.x - 90) + ") translate(" + d.y + ")";
    //     })

    // node.append("circle")
    //     .attr("r", function (d) { return 10; });
    
    
    
    
    var adjustedWidth = width * (1 + Math.floor(data.length / 600));
    var xPos = 0;
    var yPos;
    svg = d3.select("body").append("svg")
        .attr("width", adjustedWidth)
        .attr("height", height)
        .style("border", "1px solid black");
        
    var circles = svg.selectAll("circle")
        .data(function() {
                // Sort by age acending order
                return data.sort(function(a, b) {return a.age - b.age});
        })
        .enter()
        .append("circle")
        .attr("cx", function(d, i) {
            xPos = ((i * 20) + 10) % adjustedWidth;
            if (xPos > adjustedWidth) {
                xPos = 0;
            }
            return xPos;
        })
        .attr("cy", function(d, i) {
            yPos = (50/2) * Math.floor(((i * 20) + 10) / adjustedWidth) + 15;
            return yPos;
        })	
       .attr("stroke", function(d) {
           if (d.age < 18) {
               return "white";
           }
       })
       .attr("stroke-width", 7)
       .attr("r", function(d) {
            return 8;
       })
       .attr("fill", function(d) {
           if (d.sex == "female") {
               return "pink";
           } else {
               return "blue";
           }
       });
       return svg;
}

function update() {
    for(var i = 0; i < classGroups.length; i++) {
       var classList = classGroups[i].data;
       var circles = classGroups[i].parent.selectAll("circle")
        .data(classList.filter(function(d) {
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
               return "white";
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
        circles.exit().remove(); 
    }
}
