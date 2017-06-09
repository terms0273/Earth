import * as d3 from "d3";

export default class Graph{
  constructor(){
    ;
  }

  //グラフ呼ぶときはこれ
  init(cityName){
    d3.select("svg").remove();
    let url = "http://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=9ab6492bf227782c3c7ae7417a624014";

    $.ajax({
        url:url
    }).then((json) =>{
        console.log(json);
        this.print(json);//下でprintメソッドを定義している
    },(err) =>{
        console.log(err);
    });
  }

  print(json){
    //jsonからリストを受け取る
    var forecastlist = json.list;
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var w = 1000 - margin.left - margin.right;
    var h = 700 - margin.top - margin.bottom;
    var padding = 20;

    var xScale = d3.scale.linear()
                    .domain([forecastlist[0].dt, forecastlist[forecastlist.length-1].dt])
                    .range([padding, w-margin.left]);

    var yScale = d3.scale.linear()
                    .domain([0, 100])
                    .range([h-padding, padding]);

    var svg = d3.select("#graph")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g");

    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickFormat(function(d){
                        var date = new Date(d * 1000);
                        return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getHours() + " :00";
                      });

    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");
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


    /*ここまではグラフの共通部分
    ここから4つのグラフにチェックボックスのチェック有無で分岐
    */

    //気温グラフ
    if($("#chkTemp:checked").val()){
      var d3line = d3.svg.line()
        .x(function(d){return xScale(d.dt);})
        .y(function(d){return yScale(d.main.temp - 273.15);})
        .interpolate("cardinal");


      svg.append("path")
        .attr("d", d3line(forecastlist))
        .attr({
          transform: "translate(0, 0)"})
        .style("stroke-width", 2)
        .style("stroke", "#ff00ff")
        .style("fill", "none");


      var circle = svg.selectAll("circle")
        .data(forecastlist)
        .enter()
        .append("circle")
        .attr({
          // enterに入っているデータ一つ一つで下の処理を行う
          'cx': function(d){return xScale(d.dt);},
          'cy': function(d){return 0;},
          'r': function(d) { return 2; },
          transform: "translate(0, 0)"
        });

      circle.transition()
      .delay(400)
      .duration(1000)
      .ease("bounce")
      .attr("cy", function(d){return yScale(d.main.temp-273.15);});
    }


    //湿度チェック
    if($("#chkHumide:checked").val()){
      var d3line = d3.svg.line()
        .x(function(d){return xScale(d.dt);})
        .y(function(d){return yScale(d.main.humidity);})
        .interpolate("cardinal");


      svg.append("path")
        .attr("d", d3line(forecastlist))
        .attr({
          transform: "translate(0, 0)"})
        .style("stroke-width", 2)
        .style("stroke", "#313198")
        .style("fill", "none");


      var circle = svg.selectAll("circle2")
        .data(forecastlist)
        .enter()
        .append("circle")
        .attr({
          'cx': function(d){return xScale(d.dt);},
          'cy': function(d){return 0;},
          'r': function(d) { return 2; },
          transform: "translate(0, 0)"
        });

      circle.transition()
        .delay(400)
        .duration(1000)
        .ease("bounce")
        .attr("cy", function(d){return yScale(d.main.humidity);});
    }


    //体感温度チェック
    if($("#chkTaikan:checked").val()){
      var d3line = d3.svg.line()
        .x(function(d){return xScale(d.dt);})
        .y(function(d){
          var v = Math.pow(d.wind.speed, 0.75);
          var a = 1.76 + 1.4*v;
          return yScale(37-(37-(d.main.temp-273.15))/(0.68 - (0.0014)*(d.main.humidity) + (1/a)));
        })
        .interpolate("cardinal");

      svg.append("path")
        .attr("d", d3line(forecastlist))
        .attr({
          transform: "translate(0, 0)"})
        .style("stroke-width", 3)
        .style("stroke", "ff6699")
        .style("fill", "none");

      var circle = svg.selectAll("circle3")
        .data(forecastlist)
        .enter()
        .append("circle")
        .attr({
          'cx': function(d){return xScale(d.dt);},
          'cy': function(d){return 0;},
          'r': function(d) { return 2; },
          transform: "translate(0, 0)"
        });

      circle.transition()
        .delay(400)
        .duration(1000)
        .ease("bounce")
        .attr("cy", function(d){
          var v = Math.pow(d.wind.speed, 0.75);
          var a = 1.76 + 1.4*v;
          return yScale(37-(37-(d.main.temp-273.15))/(0.68 - (0.0014)*(d.main.humidity) + (1/a)));
        });
    }

    if($("#chkFukai:checked").val()){
      var d3line = d3.svg.line()
        .x(function(d){return xScale(d.dt);})
        .y(function(d){
          return yScale(0.81*(d.main.temp - 273.15) + 0.01*d.main.humidity*(0.99*(d.main.temp - 273.15) - 14.3)+46.3);
        })
        .interpolate("cardinal");


      svg.append("path")
        .attr("d", d3line(forecastlist))
        .attr({
          transform: "translate(0, 0)"})
        .style("stroke-width", 2)
        .style("stroke", "#892706")
        .style("fill", "none");


      var circle = svg.selectAll("circle4")
        .data(forecastlist)
        .enter()
        .append("circle")
        .attr({
          'cx': function(d){return xScale(d.dt);},
          'cy': function(d){return 0;},
          'r': function(d) { return 2; },
          transform: "translate(0, 0)"
        });

      circle.transition()
        .delay(400)
        .duration(1000)
        .ease("bounce")
        .attr("cy", function(d){
          var v = Math.pow(d.wind.speed, 0.75);
          var a = 1.76 + 1.4*v;
          return yScale(0.81*(d.main.temp - 273.15) + 0.01*d.main.humidity*(0.99*(d.main.temp - 273.15) - 14.3) + 46.3);
        });
    }
  }


  //サークルとグラフ線を消すだけのメソッド
  hideGraph(){
    d3.select("path").remove();
    d3.select("circle").remove();
  }
}
