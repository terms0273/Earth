import * as d3 from "d3";

export default class Graph{
  constructor(){
    ;
  }

  //チェックボックスにチェックが入るとこのメソッドが呼ばれる
  init(cityName){
    d3.select("svg").remove(); //残っているグラフを消して初期化する
    let url = "http://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=9ab6492bf227782c3c7ae7417a624014";

    $.ajax({
      url:url
    }).then((json) =>{
      //jsonが正しく受け取れているとき
      console.log(json);
      this.print(json);//下でprintメソッドを定義している
    },(err) =>{
      console.log(err);
    });
  }

  //jsonから正しくデータが受け取れているときに呼ばれるメソッド
  print(json){
    //jsonからリストを受け取る
    let forecastlist = json.list;
    //画面レイアウトの設定
    let margin = {top: 20, right: 20, bottom: 30, left: 40};
    let w = 1000 - margin.left - margin.right;
    let h = 700 - margin.top - margin.bottom;
    let padding = 20;

    //スケール関数でグラフ表示の範囲を決める
    let xScale = d3.scale.linear()
      .domain([forecastlist[0].dt, forecastlist[forecastlist.length-1].dt])
      .range([padding, w-margin.left]);

    let yScale = d3.scale.linear()
      .domain([0, 100])
      .range([h-padding, padding]);

    //svg領域を確保
    let svg = d3.select("#graph")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g");

    //縦軸と横軸の設定
    let xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .tickFormat(function(d){
          let date = new Date(d * 1000);
          return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getHours() + " :00";
        });
    let yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

    //svg領域に縦軸と横軸を描く
    svg.append("g")
      .attr({
        class:"x axis",
        transform: "translate(0, 630)"})
      .call(xAxis);
　  svg.append("g")
      .attr({
        class:"y axis",
        transform: "translate(20, 0)"})
      .call(yAxis);

    /*ここまではグラフの共通部分
    ここから4つのグラフにチェックボックスのチェック有無で分岐
    */

    //気温チェック
    if($("#chkTemp:checked").val()){
      //lineメソッドで線を用意している
      let d3line = d3.svg.line()
        .x(function(d){return xScale(d.dt);})
        .y(function(d){return yScale(d.main.temp - 273.15);})
        .interpolate("cardinal");//線の種類。cardinalは曲線

      //用意した線を描画
      svg.append("path")
        .attr("d", d3line(forecastlist))
        .attr({
          transform: "translate(0, 0)"})
        .style("stroke-width", 2)
        .style("stroke", "#ff00ff")
        .style("fill", "none");

      //気温を示す点を描画
      let circle = svg.selectAll("circle")
        .data(forecastlist)
        .enter()
        .append("circle")
        .attr({
          'cx': function(d){return xScale(d.dt);},
          'cy': 0,
          'r': 2,
          transform: "translate(0, 0)"
        });
      //点が上から降ってきてバウンドするアニメーション
      circle.transition()
      .delay(400)
      .duration(1000)
      .ease("bounce")
      .attr("cy", function(d){return yScale(d.main.temp-273.15);});
    }

    //以下気温チェック参照。同じ手順で行っている。

    //湿度チェック
    if($("#chkHumide:checked").val()){
      let d3line = d3.svg.line()
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


      let circle = svg.selectAll("circle2")
        .data(forecastlist)
        .enter()
        .append("circle")
        .attr({
          'cx': function(d){return xScale(d.dt);},
          'cy': 0,
          'r': 2,
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
      let d3line = d3.svg.line()
        .x(function(d){return xScale(d.dt);})
        .y(function(d){
          let v = Math.pow(d.wind.speed, 0.75);
          let a = 1.76 + 1.4*v;
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

      let circle = svg.selectAll("circle3")
        .data(forecastlist)
        .enter()
        .append("circle")
        .attr({
          'cx': function(d){return xScale(d.dt);},
          'cy': 0,
          'r':2,
          transform: "translate(0, 0)"
        });

      circle.transition()
        .delay(400)
        .duration(1000)
        .ease("bounce")
        .attr("cy", function(d){
          let v = Math.pow(d.wind.speed, 0.75);
          let a = 1.76 + 1.4*v;
          return yScale(37-(37-(d.main.temp-273.15))/(0.68 - (0.0014)*(d.main.humidity) + (1/a)));
        });
    }

    //不快指数チェック
    if($("#chkFukai:checked").val()){
      let d3line = d3.svg.line()
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


      let circle = svg.selectAll("circle4")
        .data(forecastlist)
        .enter()
        .append("circle")
        .attr({
          'cx': function(d){return xScale(d.dt);},
          'cy': 0,
          'r': 2,
          transform: "translate(0, 0)"
        });

      circle.transition()
        .delay(400)
        .duration(1000)
        .ease("bounce")
        .attr("cy", function(d){
          let v = Math.pow(d.wind.speed, 0.75);
          let a = 1.76 + 1.4*v;
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
