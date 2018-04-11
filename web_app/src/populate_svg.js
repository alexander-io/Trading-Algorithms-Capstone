// handle response from server with data, draw data  elements to svg
var res_price_n_periods = function(price_data, time_periods) {

  var minimum_val = d3.min(price_data.price_array)
  var maximum_val = d3.max(price_data.price_array)
  price_data.price_array.push(minimum_val*.999)

  var n = 1 // number of series
  var m = time_periods+1
  var xz = d3.range(m)
  xz = inverse_array(xz) // inverse

  var yz = d3.range(n).map(function() {
    return price_array_to_reduced_price_array(price_data.price_array);
  })

  var y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz))
  var yMax = d3.max(yz, function(y) {
    return d3.max(y);
  })
  var y1Max = d3.max(y01z, function(y) {
    return d3.max(y, function(d) {
      return d[1];
    });
  });

  var svg = d3.select("#"+price_data.symbol)
      margin = {top: 5, right: 5, bottom: 5, left: 5},
      width = +svg.attr("width") /*- margin.left - margin.right*/,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + 25 + "," + -10 + ")");

  var x = d3.scaleBand()
      .domain(xz)
      .rangeRound([0, width])
      .padding(0.08);

  var y = d3.scaleLinear()
      .domain([0, y1Max])
      .range([height, 0]);

  var color = d3.scaleOrdinal()
      .domain(d3.range(n))
      .range(color_arr);

  var series = g.selectAll(".series")
    .data(y01z)
    .enter().append("g")
    .attr("border", "1px solid  black ")
    .attr("fill", function(d, i) { return '#bd9e39'; });


  var rect = series.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d, i) { return x(i); })
      .attr("y", height)
      .attr("color", "black")
      .attr("width", x.bandwidth())
      .attr("height", 0)

  svg.append("rect")
    .attr("height", 2)
    .attr("width", width)
    .attr("x", 0)
    .attr("y", height -10)
    .attr("fill", "#000000")

  svg.append("rect")
    .attr("height", height)
    .attr("width", 2)
    .attr("x", 45)
    .attr("y", 10 )
    .attr("fill", "#000000")

  svg.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .text(round(maximum_val,3))

  svg.append("text")
    .attr("x", 0)
    .attr("y", height -13)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .text(round(minimum_val, 3))

  svg.append("text")
    .attr("x", 50)
    .attr("y", height + 1)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .text('past')

  svg.append("text")
    .attr("x", width*.925)
    .attr("y", height + 1)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .text('present')


  rect.transition()
      .delay(function(d, i) { return i ; })
      .attr("y", function(d) {
        return y(d[1]);
      })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); });

  document.getElementById("dimmer_"+price_data.symbol).setAttribute("style", "visibility:hidden;")
}
