/*
* Annie Tao, Holden Stegman
* Februrary 17th, Info 474 Assignment 4
*/

// Object representing current baseline state (All boxes checked, etc)
var baseline = {
    "sex": ["male", "female"],
    "age": [0, 80],
    "pclass": ["1", "2", "3"]
}

// Object representing current state of selections
var current = {
    "sex": ["male", "female"],
    "age": [0, 80],
    "pclass": ["1", "2", "3"]
}
// Create event listeners for all inputs on the page
var checkboxes = Array.from(document.getElementsByTagName("input"));
for (var i = 0; i < checkboxes.length; i++) {
    var input = checkboxes[i];
    input.addEventListener("change", function(e) {
        var targetName = e.target.name;
        if (current.hasOwnProperty(targetName)) {
            if (targetName == "sex" || "pclass") {
                if (e.target.checked) {
                    current[targetName].push(e.target.value.toLowerCase());
                } else {
                    current[targetName].splice(current[targetName].indexOf(e.target.value.toLowerCase()), 1);
                }
                //console.log(current)
                update()
            }
        }
    })
}

var div = document.createElement("div");
div.setAttribute("id", "water");

// Function that listens and updates slider input

// Declare doubounce update
var debouceUpdate = debounce(update, 500);

$(function () {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 80,
        values: [0, 80],
        slide: function (event, ui) {
            current["age"][0] = ui.values[0], current["age"][1] = ui.values[1];
            $("#amount").val(ui.values[0] + " - " + ui.values[1]);
            debouceUpdate();
        }
    });
    $("#amount").val($("#slider-range").slider("values", 0) +
        " - " + $("#slider-range").slider("values", 1));
});

// DEAD BUTTON
var crashed = false;
document.getElementById("crash").addEventListener("click", function(e) {
   crashed = true;
   setTimeout(function() { $("#water").animate({height: "42%"}, 1500); }, 2500);
   update(); 
});

// Set up reset button
document.getElementById("resetBtn").addEventListener("click", function() {
    $("#water").animate({height: "0px"}, 300);
    //console.log("Resetting..");
    current = JSON.parse(JSON.stringify(baseline));
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 80,
        values: [0, 80],
        slide: function (event, ui) {
            current["age"][0] = ui.values[0], current["age"][1] = ui.values[1];
            $("#amount").val(ui.values[0] + " - " + ui.values[1]);
            debouceUpdate();
        }
    });
    $("#amount").val($("#slider-range").slider("values", 0) +
        " - " + $("#slider-range").slider("values", 1));
    for (var i = 0; i < checkboxes.length; i++) {
        var input = checkboxes[i];
        if (input.type == 'checkbox') {
            input.checked = true;
        }
    }
    crashed = false;
    update();
})

// Height, Weight, Page info variables
var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
},
width = 900- margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Chart variables
var n = 1309,
    m = 3,
    padding = 7,
    radius = d3.scale.sqrt().range([0, 12]),
    color = d3.scale.category10().domain(d3.range(m)),
    x = d3.scale.ordinal().domain(d3.range(m)).rangePoints([0, width], 1);

// nodesCopy holds a deep copy of nodes
// Nodes holds each node to be render (Put on screen)
var nodesCopy = [];
var nodes = [];

// Load CSV, load nodes and nodesCopy, call initial render
d3.csv("../titanic3.csv", function(err, data) {
    for (var j = 0; j < data.length; j++) {
        //create node
        var i = data[j].pclass - 1;
        var v = (i + 1) / m * -Math.log(Math.random()); //value
        
        nodes.push({
            sex: data[j].sex,
            age: data[j].age,
            pclass: data[j].pclass,
            survived: data[j].survived,
            name: data[j].name,
            radius: 5,
            cx: x(i),
            cy: height/2,
        });
        nodesCopy.push({
            sex: data[j].sex,
            age: data[j].age,
            pclass: data[j].pclass,
            survived: data[j].survived,
            name: data[j].name,
            radius: 5,
            cx: x(i),
            cy: height/2,
        });
    }
    update();
    //console.log(nodes);
});
// Declare svg and circle as globals for easy access
var circle;
var svg;

// Basic function takes nodes and displays them on the chart. Should only called on initial load
// or called when resetting the page
// Function that handles any updates that the user makes
function update() {
    nodes = JSON.parse(JSON.stringify(nodesCopy));
    nodes = nodes.filter(function (n) {
        for (var prop in current) {
            if (current.hasOwnProperty(prop)) {
                if (current[prop].indexOf(n[prop]) == -1) {
                    if (prop == "age") {
                        if (n["age"] < current["age"][0] || n["age"] > current["age"][1]) {
                            return false;
                        }
                    } else {
                        console.log(current[prop], n[prop], "should be returning false..");
                        return false;
                    }
                }
            }
        }
        return true;
    });
    
    if (crashed) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].cy = nodes[i].survived == 1 ? height / 4 : height / 4 * 3;
        }
        // Div/Container that holdes survivorRate, Survivor Amount
        $("#survivorStats").show();
        var survived = nodes.filter(function (n) {
            return n.survived == 1;
        });
        // Survivor Rate sets percent 
        $("#survivorRate").text(function() {
            return "(" + Math.floor(survived.length/nodes.length * 100) + "%)";
        });
        // Survivor amount sets the absolute amount of survivors
        $("#survivorAmount").text(function() {
            return "" + survived.length;
        });
    } else {
        $("#survivorStats").hide();
    }
    // Useful for stats?
    console.log(nodes.length, "nodes length");
    console.log(nodesCopy.length, "nodesCopy length");
    // Update stats here
    $('#passengerCount').text(function() {
        var p = nodes.length == 1 ? "passenger" : "passengers";
        return nodes.length;
    });
    // End Update Stats
    $('#chart').empty();
    var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(0)
        .charge(0)
        .on("tick", tick)
        .start();

    $('#chart').append(div);

    svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    circle = svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", function (d) {
            //console.log(d);
            return d.radius;
        })
        .attr("fill", function (d) {
            if (d.sex == "female") {
                return "#FF90AF";
            } else {
                return "#22ABCE";
            }
        })
        .on("mouseover", function (d) {
            $('#hoverHelpMessage').hide();
            $('#passengerInfo').show();
            $('#passengerName').text(d.name);
            $('#passengerAge').text(d.age);
            $('#passengerSex').text(function() {
                return d.sex.split('')[0].toUpperCase() + d.sex.split('').splice(1).join('');
            });
        })
        .on("mouseout", function (d) {
            $('#hoverHelpMessage').show();
            $('#passengerInfo').hide();
            console.log("Good bye!");
        })
        .call(force.drag);
}

// Function for gravity chart that control gravity, ticks, collissions
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

// Helper debouce function for efficiency!!
// Taken from: https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
