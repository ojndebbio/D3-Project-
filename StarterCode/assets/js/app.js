// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//  Create SVG wrapper, append SVG group that will hold chart & set margins
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import & format data, Step 1
d3.csv("assets/data/data.csv").then(function(CensusData) {
    CensusData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      // console.log(CensusData);
    });

// Step 2: Create Scale functions
const xScale = d3.scaleLinear()
.domain(d3.extent(CensusData, d => d.poverty))
.range([0, width])
// rounds domain to nice round values
.nice(); 

const yScale = d3.scaleLinear()
.domain([6,d3.max(CensusData, d => d.healthcare)])
.range([height, 0])
.nice();

// Create axis & append axes to the chart; Steps 3 & 4
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);
chartGroup.append("g").call(yAxis);

// Create Scatter Plot, Step 5
chartGroup.selectAll("circle")
.data(CensusData)
.enter()
.append("circle")
.attr("cx", d=>xScale(d.poverty))
.attr("cy", d=>yScale(d.healthcare))
.attr("r", "10")
.attr("stroke-width", "1")
.classed("stateCircle", true)
.attr("opacity", 0.75);

// Adding Text inside of cirles/datapoint, Step 6
chartGroup.append("g")
  .selectAll('text')
  .data(CensusData)
  .enter()
  .append("text")
  .text(d=>d.abbr)
  .attr("x",d=>xScale(d.poverty))
  .attr("y",d=>yScale(d.healthcare))
  .classed(".stateText", true)
  .attr("font-family", "sans-serif")
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .attr("font-size", "10px")
  .style("font-weight", "bold")
  .attr("alignment-baseline", "central");

// Create axes titles, Step 7
chartGroup.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 13})`)
.attr("text-anchor", "middle")
.attr("font-size", "16px")
.attr("fill", "black")
.style("font-weight", "bold")
.text("Lacks Healthcare (%)");

chartGroup.append("text")
.attr("y", 0 - ((margin.left / 2) + 2))
.attr("x", 0 - (height / 2))
.attr("text-anchor", "middle")
.attr("font-size", "16px")
.attr("fill", "black")
.style("font-weight", "bold")
.attr("transform", "rotate(-90)")
.text("In Poverty (%)");
}).catch(function(error) {
console.log(error);
});

