import * as d3 from "d3";

export default class Graph{
  constructor(){
    this.margin = {top: 20, right: 20, bottom: 30, left: 40};
    this.w = 1000 - this.margin.left - this.margin.right;
    this.h = 700 - this.margin.top - this.margin.bottom;
    this.padding = 30;

    //svg領域を確保
    this.svg = d3.select("#graph")
      .append("svg")
      .attr("width", this.w)
      .attr("height", this.h)
      .append("g");

  }

  //チェックボックスにチェックが入るとこのメソッドが呼ばれる
  init(cityName){
    //d3.select("svg").remove(); //残っているグラフを消して初期化する
    let url = "http://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=9ab6492bf227782c3c7ae7417a624014";

    $.ajax({
      url:url
    }).then((json) =>{
      //jsonが正しく受け取れているとき
      console.log(json);
      this.json = json;

      let forecastlist = json.list;
      let xScale = d3.scale.linear()
        .domain([forecastlist[0].dt, forecastlist[forecastlist.length-1].dt])
        .range([this.padding, this.w-this.margin.left]);

      let yScale = d3.scale.linear()
        .domain([-100, 100])
        .range([this.h-this.padding, this.padding]);

      //縦軸と横軸の設定
      let xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickFormat(function(d){
            let date = new Date(d * 1000);
            return (date.getMonth() + 1) + "/" +
                    date.getDate() + "/" + date.getHours() + " :00";
          });
      let yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

      //svg領域に縦軸と横軸を描く
      this.svg.append("g")
        .attr({
          class:"x axis",
          transform: "translate(0, 630)"})
        .call(xAxis);
  　  this.svg.append("g")
        .attr({
          class:"y axis",
          transform: `translate(${this.padding}, 0)`})
        .call(yAxis);

    },(err) =>{
      console.log(err);
    });
  }

  //jsonから正しくデータが受け取れているときに呼ばれるメソッド
  print(id){
    //jsonからリストを受け取る
    let forecastlist = this.json.list;

    if($("#"+id+":checked").val()){
      let data = [];
      switch(id){
        //気温チェック
        case "chkTemp":
          for(let d of forecastlist){
            data.push({
              "dt":d.dt,
              "value":d.main.temp - 273.15
            });
          }
          this.drowLine(this.svg,data,"#ff00ff","linear",id);
          break;
        //湿度チェック
        case "chkHumide":
          for(let d of forecastlist){
            data.push({
              "dt":d.dt,
              "value":d.main.humidity
            });
          }
          this.drowLine(this.svg,data,"#313198","linear",id);
          break;
        //体感温度チェック
        case "chkTaikan":
          for(let d of forecastlist){
            let v = Math.pow(d.wind.speed, 0.75);
            let a = 1.76 + 1.4*v;
            let windchill = 37-(37-(d.main.temp-273.15))/
              (0.68 - (0.0014)*(d.main.humidity) + (1/a));
            data.push({
              "dt":d.dt,
              "value":windchill
            });
          }
          this.drowLine(this.svg,data,"#ff6699","cardinal",id);
          break;
        //不快指数チェック
        case "chkFukai":
          for(let d of forecastlist){
            let di = 0.81*(d.main.temp - 273.15) +
              0.01*d.main.humidity*(0.99*(d.main.temp - 273.15) - 14.3) + 46.3;
            data.push({
              "dt":d.dt,
              "value":di
            });
          }
          this.drowLine(this.svg,data,"#892706","cardinal",id);
          break;
      }
    }else{
      d3.select("#"+id+ "line").remove();
    }
  }
  /*
   *dataは
   *[
      dt:"時間",
      value:"値"
   *]
   の形式
   */
  drowLine(tag,data,color,interpolate,id){
    let xScale = d3.scale.linear()
      .domain([data[0].dt, data[data.length-1].dt])
      .range([this.padding, this.w-this.margin.left]);

    let yScale = d3.scale.linear()
      .domain([-100, 100])
      .range([this.h-this.padding, this.padding]);

    let tooltip = d3.select("body").select("#tooltip");
    //lineメソッドで線を用意している
    let d3line = d3.svg.line()
      .x(function(d){return xScale(d.dt);})
      .y(function(d){return yScale(d.value);})
      .interpolate(interpolate);//線の種類。cardinalは曲線

    let g = tag.append("g")
      .attr("id",id + "line");
    g.append("path")
      .attr("d", d3line(data))
      .style("stroke-width", 2)
      .style("stroke", color)
      .style("fill", "none");

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr({
        'cy': 0,
      })
      .on("mouseover", function(d){
        return tooltip.style("visibility", "visible").text(d.value);})
      .on("mousemove", function(){
        return tooltip.style("top", (event.pageY-20)+"px")
          .style("left",(event.pageX+10)+"px");
      })
      .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
      })
      .transition()
      .delay(400)
      .duration(1000)
      .ease("bounce")
      .attr({
        cx: function(d){return xScale(d.dt);},
        cy:function(d){return yScale(d.value);},
        r:3
      });
  }
  //サークルとグラフ線を消すだけのメソッド
  hideGraph(){
    d3.select("path").remove();
    d3.select("circle").remove();
  }
}
