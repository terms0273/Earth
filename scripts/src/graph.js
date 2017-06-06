import * as d3 from "d3";

export default class Graph{
  constructor(){
    var dataset = [];
    for(var i = -10;i<10;i++){
      var a = Math.sqrt(6.28);
      var b = Math.exp(i*i / (0-2));
      dataset.push(300 / a * b);
    }

    var w = 500;
    var h = 500;
    var svg = d3.select("#graph")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
    var pathinfo = [];
    var b_x = w / dataset.length;
    for(var i = 0; i < dataset.length; i++){
      pathinfo.push({x:b_x*i+2, y:((h - 50) - dataset[i]) });
    }

    var d3line = d3.svg.line()
      .x(function(d){return d.x;})
      .y(function(d){return d.y;})
      .interpolate("cardinal");

      svg.append("path")
        .attr("d", d3line(pathinfo))
        .style("stroke-width", 2)
        .style("stroke", "steelblue")
        .style("fill", "none");

        var circle = svg.selectAll('circle')
                  .data([c1]).enter().append('circle')
         .attr({
           // enterに入っているデータ一つ一つで下の処理を行う
           'cx': function(d) { return d[0]; },
           'cy': function(d) { return d[1]; },
           'r': function(d) { return d[2]; },
         });
  }


}
