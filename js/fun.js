var current = {
    "sex": ["male", "female"],
    "age": [0, 80],
    "pclass": ["1", "2", "3"]
}

$(function () {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 80,
        values: [0, 80],
        slide: function (event, ui) {
            current["age"][0] = ui.values[0], current["age"][1] = ui.values[1];
            $("#amount").val(ui.values[0] + " - " + ui.values[1]);
        }
    });
    $("#amount").val($("#slider-range").slider("values", 0) +
        " - " + $("#slider-range").slider("values", 1));
});

var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
},
width = 900- margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var n = 1309,
    m = 3,
    padding = 7,
    radius = d3.scale.sqrt().range([0, 12]),
    color = d3.scale.category10().domain(d3.range(m)),
    x = d3.scale.ordinal().domain(d3.range(m)).rangePoints([0, width], 1);


var nodes = [];
d3.csv("../titanic3.csv", function(err, data) {
    for (var j = 0; j < data.length; j++) {
        //create node
        var i = data[j].pclass - 1;
        var v = (i + 1) / m * -Math.log(Math.random()); //value

        nodes.push({
            sex: data[j].sex,
            radius: 5,
            cx: x(i),
            cy: height / 2,
        })
    }
    //console.log(nodes);
});
var circle;
setTimeout(function() {
    console.log(nodes);

    var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(0)
        .charge(0)
        .on("tick", tick)
        .start();

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    circle = svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", function (d) {
        return d.radius;
    })
        .attr("fill", function(d) {
           if (d.sex == "female") {
               return "#FF90AF";
           } else {
               return "#22ABCE";
           }
        })
        .call(force.drag);

}, 500);
// var nodes = d3.range(n).map(function () {
//     var i = Math.floor(Math.random() * m), //color
//         v = (i + 1) / m * -Math.log(Math.random()); //value
//     return { //add each person fields here
//         //classGroup = 1
//         //age = 1
//         radius: 6,
//         color: color(i),
//         cx: x(i),
//         cy: height / 2,
//     };

// });

function tick(e) {
    circle.each(gravity(.4 * (e.alpha/3))) 
        .each(collide(.35))
        .attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
        return d.y;
    });
}

// Move nodes toward cluster focus.
function gravity(alpha) {
    return function (d) {
        d.y += (d.cy - d.y) * (alpha);
        d.x += (d.cx - d.x) * (alpha);
    };
}

// Resolve collisions between nodes.
function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function (d) {
        var r = d.radius + radius.domain()[1] + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}