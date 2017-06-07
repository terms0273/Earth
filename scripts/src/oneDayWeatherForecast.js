import * as d3 from "d3";

export default class OneDayWeatherForecast{
  constructor(){}

  init(cityName){
    let url = "http://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=9ab6492bf227782c3c7ae7417a624014";
    $.ajax({
        url:url
    }).then((json) =>{

      this.print(json);  //成功時
    },
      (err) =>{
        console.log(err);
      }
    );
  }

  print(json){
    console.log(json);

    var width = 760;
    var height = 600;
    var radius = 100;
    var margin = 50;

    var svg = d3.select("#one-day").append("svg")
      .attr("width", width)
      .attr("height", height);

    // translateで画面中央に移動。
    var translated = svg.append("g")
      .attr("transform","translate(" + (radius + margin) +","+ (radius + margin) +")");


    // var data = [45,90,135,180,225,270,315,360];
    var data = [];
    for(var i = 0; i < 8; i++){
      data[i] = json.list[i];
    }

    // d3.extent()で、データの最大値と最小値が[最大値,最小値]で出る。
    var dataExtent = d3.extent(data);

    // データリストの位置が0で角度0、最後の位置で360度になるように均等に角度を割りふる。
    var r = d3.scale.linear()
      .domain([0,data.length])
      .range([180,540]);

    var rotated = translated.selectAll("g").data(data).enter()
      .append("g");

    var image = rotated.append("image")
      .attr({
        x:0,
        y:0
      })
      .transition()
        .delay((d,i) => {
        return i * 50;
      })
      .duration(500)
      .ease("linear")
      .attr({
        // transform:(d,i) => { return "rotate(" + 360 + ")"; },
        x:(d,i) => {return Math.cos(r(i) * Math.PI / 180) * radius},
        y:(d,i) => {return Math.sin(r(i) * Math.PI / 180) * radius},
        href:(d) => {return "http://openweathermap.org/img/w/"+d.weather[0].icon+".png"}
      });

      var text = rotated.append("text")
        .attr({
          x:0,
          y:0
        })
        .transition()
          .delay((d,i) => {
          return i * 50;
        })
        .duration(500)
        .ease("linear")
        .attr({
          transform:(d,i) => { return "rotate(" + 360 + ")"; },
          x:(d,i) => {return Math.cos(r(i) * Math.PI / 180) * radius},
          y:(d,i) => {return Math.sin(r(i) * Math.PI / 180) * radius}
        })
        .text((d) => {return new Date(d.dt * 1000).getHours() + ":00"});
  }
}
