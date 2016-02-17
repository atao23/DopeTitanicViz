var width = 800;
var height = 400;

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
    var adjustedWidth = width * (1 + Math.floor(data.length / width));
    var adjustedHeight = Math.ceil((data.length / 40)) * 27.7777;
    var xPos = 0;
    var yPos;
    svg = d3.select("#chart").append("svg")
        .attr("width", adjustedWidth)
        .attr("height", adjustedHeight);
        
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
       .attr("stroke-width", 5)
       .attr("r", function(d) {
            return 6;
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