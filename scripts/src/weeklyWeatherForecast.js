import * as d3 from "d3";

export default class WeeklyWeatherForecast {
  constructor() {
    this.init("Tokyo");
  }

  /**
   * 一週間の天気データ取得
   * print()の呼び出し
   * @param  cityName
   * @return
   */
  init(cityName) {
    d3.select("svg").remove();
    let url = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" +
    cityName +
    "&appid=9ab6492bf227782c3c7ae7417a624014";

    $.ajax({
      url:url
    }).then((json) =>{
      console.log(json);
      this.json = json;
      this.print();
    },(err) =>{
      console.log(err);
    });
  }

  /**
   * 週間天気予報表示
   * @return
   */
  print() {
    let w = 850;
    let h = 700;
    let padding = 25;

    //曜日表示用配列
    let weekday = [];

    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    //表の行名表示テキスト用配列
    let indexData = [];

    indexData[0] = "DATE";
    indexData[1] = "WEATHER";
    indexData[2] = "MAX";
    indexData[3] = "MIN";

    //表の行位置用配列
    let yPoint = [];

    yPoint[0] = 30;
    yPoint[1] = 70;
    yPoint[2] = 140;
    yPoint[3] = 170;

    let svg = d3.select("#weekly").append("svg").attr({width:w, height:h});

    let dataset = [];
    for (let i = 0; i < this.json.list.length; i++) {
      dataset[i] = this.json.list[i];
    }

    let xscale = d3.scale.linear()
      .domain([0,dataset.length])
      .range([padding,w-padding]);

    let weekly = svg.append("g").selectAll("g")
      .data(dataset)
      .enter();

    let index = svg.append("g").selectAll("g")
      .data(indexData)
      .enter()
      .append("text");

    //表の行名表示
    index.attr({
        x: 0,
        y: function(d,i) {return yPoint[i];}
      })
      .text(function(d) {return d;});

    //日付表示
    weekly.append("text")
      .attr({
        x: function(d,i){return xscale(i) + 70;},
        y: function() {return yPoint[0];}
      })
      .text(function(d) {
        let date = new Date(d.dt * 1000);
        return (date.getMonth() + 1) + "/" +
        date.getDate() +
        "(" + weekday[date.getDay()] + ")";
      });

    //天気アイコン表示
    weekly.append("image")
      //on click 未実装
      .on("click", function(d,i) {

      })
      .transition()
      .duration(1000)
      .delay(function(d, i) {
        return i * 200;
      })
      .each("start", function() {
        d3.select(this).attr({
          x: 1000,
          y: function() {return yPoint[1];}
        });
      })
      .attr({
        href: function(d){
          return 'http://openweathermap.org/img/w/'+d.weather[0].icon+'.png';
        },
        x: function(d,i){return xscale(i) + 70;},
        y: function() {return yPoint[1];}
      });

    //最高気温表示
    weekly.append("text")
      .attr({
        x: function(d,i){return xscale(i) + 85;},
        y: function() {return yPoint[2];}
      })
      .text(function(d) {
        return Math.round(d.temp.max - 273.15);
      });

    //最低気温表示
    weekly.append("text")
      .attr({
        x: function(d,i){return xscale(i) + 85;},
        y: function() {return yPoint[3];}
      })
      .text(function(d) {
        return Math.round(d.temp.min - 273.15);
      });
  }
}
