import * as d3 from "d3";

export default class Graph{
  constructor(){
    ;
  }
  init(json){
    var forecastlist = json.list;
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var w = 800 - margin.left - margin.right;
    var h = 700 - margin.top - margin.bottom;
    var padding = 20;



    var xScale = d3.scale.linear()
                    .domain([0,forecastlist.length])
                    .range([padding, w-padding]);

    var yScale = d3.scale.linear()
                    .domain([0, 50])
                    .range([h-padding, padding]);

    var svg = d3.select("#graph")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g");

    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");

    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

    var d3line = d3.svg.line()
      .x(function(d,i){return xScale(i);})
      .y(function(d){return yScale(d.main.temp - 273.15);})
      .interpolate("cardinal");

      svg.append("path")
        .attr("d", d3line(forecastlist))
        .attr({
          transform: "translate(0, 0)"})
        .style("stroke-width", 2)
        .style("stroke", "steelblue")
        .style("fill", "none");

      svg.append("g")
         .attr({
           class:"y axis",
           transform: "translate(20, 0)"})
         .call(yAxis);

      svg.append("g")
      .attr({
        class:"x axis",
        transform: "translate(0, 630)"})
      .call(xAxis);

        var circle = svg.selectAll('circle')
                  .data(forecastlist)
                  .enter()
                  .append('circle')
         .attr({
           // enterに入っているデータ一つ一つで下の処理を行う
           'cx': function(d,i){return xScale(i);},
           'cy': function(d){return yScale(d.main.temp - 273.15);},
           'r': function(d) { return 2; },
           transform: "translate(0, 0)"
         });
  }

  send(cityName){
      let url = "http://api.openweathermap.org/data/2.5/forecast?q=" +
      cityName +
      "&appid=9ab6492bf227782c3c7ae7417a624014";

      $.ajax({
          url:url
      }).then((json) =>{
          console.log(json);
          this.init(json);
      },(err) =>{
          console.log(err);
      });

  }
}
