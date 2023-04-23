//variables for height and width of svg
var width = window.screen.width - 100,
    height = window.screen.height - 200;

// load the data
var pathToCsv = "data/neural_net_output.csv";

//variable for timer    
var timer = null;

// enter code to create color scale
var predicted_temp_data = [];
var baseTemp = {};

var selectedCo2 = 0;
var selectedForestArea = 0;

var baseCo2 = 0
var baseForestArea = 0

var mapType = "temp";

//code to create svg    
var svg = d3.select("#choropleth")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

//code to create group element
var g = svg.append("g")
    .attr("id", "countries")
    .attr("width", width - 10)
    .attr("height", height - 10);

//variables for projection and path
var projection = d3.geoCylindricalStereographic()
    .scale(200)
    .center([0, 20])
    .translate([width / 2, height / 2]);

var path = d3.geoPath();

//create legend


var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 190) + ",80)")
    .attr("id", "legend");

//create tooltip
var tip = d3.tip()
    .attr("id", "tooltip")
    .attr('class', 'd3-tip')
    .html(function (d) {
        var tip_val = predicted_temp_data.filter(function (y) {
            if (y.country == d.properties.name)
                return y
        });
        if (tip_val.length > 0)
            return "<p><strong>Country:</strong> " + tip_val[0].country + "<br>"
                + "<strong>CO2 emission change %:</strong>" + tip_val[0].co2 + "<br>"
                + "<strong>Forest area change %:</strong>" + tip_val[0].forestarea + "<br>"
                + "<strong>Avg Temp:</strong> " + tip_val[0].average_temp + "<br>"
                + ((mapType == "temp_diff") ? "<strong>Temp change from base values:</strong> " + tip_val[0].temp_diff + "<br>" : "")
                + "</p>"
        else
            return "<p><strong>Country:</strong> " + d.properties.name + "<br>"
                + "<strong>CO2 emission change %:</strong>" + selectedCo2 + "<br>"
                + "<strong>Forest area change %:</strong>" + selectedForestArea + "<br>"
                + "</p>"
    });

// variables for color scale and color range
var color_range = [];

var colorScale = d3.scaleQuantile();

//define function getCountryName
function getCountryName(country) {
    switch (country) {
        case "Congo (Democratic Republic Of The)":
            return "Democratic Republic of the Congo";
        case "Congo":
            return "Republic of the Congo";
        case "Burma":
            return "Myanmar";
        case "United States":
            return "USA";
        case "United Kingdom":
            return "England";
        case "Bahamas":
            return "The Bahamas";
        case "Serbia":
            return "Republic of Serbia";
        case "Bosnia And Herzegovina":
            return "Bosnia and Herzegovina";
        case "Korea":
            return "North Korea";
        case "CÃ\´te D'Ivoire":
            return "Ivory Coast";
        case "Tanzania":
            return "United Republic of Tanzania";
        default:
            return country;
    }
}

function getData(base_co2, base_forest, color, map_type) {
    mapType = map_type;
    baseCo2 = base_co2;
    baseForestArea = base_forest;

    selectedCo2 = base_co2;
    selectedForestArea = base_forest;

    var p1 = new Promise(function (resolve, reject) {
        d3.json("world_countries.json").then(function (json) {
            resolve(json)
        }).catch(e => { reject(e) })
    })

    var p2 = new Promise(function (resolve, reject) {

        d3.dsv(",", pathToCsv, function (d) {
            //get country name
            var country = getCountryName(d['Country']);
            //parse float 2 digits after decimal
            var avgTemp = parseFloat(d['Predicted_Avg_Temp']).toFixed(2);

            if (parseInt(d['CO2_Percent_Change']) == baseCo2 && parseInt(d['Forest_Area_Percent_Change']) == baseForestArea)
                baseTemp[country] = (avgTemp == "NaN") ? 0 : avgTemp;

            return {
                co2: d['CO2_Percent_Change'],
                forestarea: d['Forest_Area_Percent_Change'],
                country: country,
                average_temp: avgTemp,
                //calculate change in temprature from base year
                //temp_diff: (avgTemp - baseTemp[country]).toFixed(2)
            }

        }).then(d => { resolve(d) }).catch(e => { reject(e) })
    })
    Promise.all([
        // enter code to read files
        p1,
        p2
    ]).then(
        // enter code to call ready() with required arguments
        function (values) {
            ready(values[0], values[0], values[1], color, base_co2, base_forest)
        }
    );

}

// enter code to define ready() function
function ready(error, world, tempData, color, base_co2, base_forest) {

    //calculate change in temprature from base year
    tempData.forEach(function (d) {
        d.temp_diff = (d.average_temp - baseTemp[d.country]).toFixed(2);
    });

    //filter tempData for extream values
    // tempData = tempData.filter(function (d) {
    //     if (mapType == "temp_diff") {
    //         if (d.temp_diff >= -5 && d.temp_diff <= 10)
    //             return d;
    //     }
    //     else {
    //         if (d.average_temp >= 0 && d.average_temp <= 40)
    //             return d;
    //     }
    // });

    // enter code to create dropdown
    var co2 = d3.map(tempData, function (d) { return d.co2; }).keys();
    var dropdown = d3.select("#co2Dropdown");
    dropdown
        .selectAll("option")
        .data(co2)
        .enter()
        .append("option")
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; });

    //dropdown change event
    dropdown.on("change", function () {
        selectedCo2 = d3.select(this).property("value");
        update(world, tempData);
    });

    // enter code to create dropdown for forest area change
    var forestArea = d3.map(tempData, function (d) { return d.forestarea; }).keys();
    var ddForestArea = d3.select("#forestAreaDropdown");
    ddForestArea
        .selectAll("option")
        .data(forestArea)
        .enter()
        .append("option")
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; });

    //dropdown change event
    ddForestArea.on("change", function () {
        selectedForestArea = d3.select(this).property("value");
        update(world, tempData);
    });

    // enter code to create color range
    color_range = tempData.map(function (d) {
        if (mapType == "temp_diff")
            return d.temp_diff;
        else
            return d.average_temp;
    }).sort(d3.ascending);

    // enter code to create color scale
    colorScale.domain(color_range)
        .range(color);

    // enter code to create legend title
    if (mapType == "temp_diff")
        legend.append("text")
            .attr("class", "legendlabel")
            .attr("x", 0)
            .attr("y", 0)
            .text("Average Temperature Change (°C)");
    else
        legend.append("text")
            .attr("class", "legendlabel")
            .attr("x", 0)
            .attr("y", 0)
            .text("Temperature Change (°C)");

    // enter code to create legend
    legend.selectAll("rect")
        .data(colorScale.range().map(function (d) {
            return d;
        }))
        .enter().append("rect")
        .attr("width", 8).attr("height", 8)
        .attr("x", 0)
        .attr("y", function (d, i) {
            return 10 + i * 15
        })
        .attr("fill", function (d) {
            return d
        });
    //add legend labels
    legend.selectAll("mylabels")
        .data(colorScale.range().map(function (d) {
            return colorScale.invertExtent(d);
        }))
        .enter()
        .append("text")
        .attr("class", "legendlabel")
        .attr("x", 20)
        .attr("y", function (d, i) {
            return 17 + i * 15
        })
        .text(function (d) {
            return d[0].toFixed(2) + " to " + d[1].toFixed(2)
        });

    d3.select("#playButton").on("click", function () {
        //disable play button
        d3.select("#playButton").attr("disabled", true);

        // set the initial value from the dropdown
        selectedCo2 = dropdown.property("value");
        selectedForestArea = ddForestArea.property("value");

        update(world, tempData);
    });
    //trigger click event to start the animation
    d3.select("#playButton").node().click();
}

// enter code to define update() function
function update(world, tempData) {
    // variable to filter data based on selected year
    predicted_temp_data = tempData.filter(function (d) { return d.co2 == selectedCo2 && d.forestarea == selectedForestArea; });

    d3.selectAll('path').remove();

    //call tooltip
    g.call(tip);

    // enter code to create the map
    g.selectAll("path")
        //filter out Greenland, Antarctica and French Southern Territories
        .data(world.features.filter(d => d.id !== "ATA" && d.id !== "ATF"))//d.id !== "GRL" &&
        .enter()
        .append("path")
        .attr("d", path.projection(projection))
        .style("fill", function (d) {
            var prop = predicted_temp_data.filter(function (y) {
                if (y.country == d.properties.name)
                    return y
            });

            var v = (prop.length == 0) ? "grey" : (mapType == "temp_diff") ? colorScale(parseFloat(prop[0].temp_diff)) : colorScale(parseFloat(prop[0].average_temp));
            return v
        })
        .style("stroke", "white")
        .style("stroke-width", ".5")
        .style("opacity", 0.8)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

}