import * as d3 from "d3";
import OneDayWeatherForecast from "./oneDayWeatherForecast";

export default class WeeklyWeatherForecast {
  constructor(oneDay) {
    this.init("Tokyo",oneDay);
  }

  /**
   * 一週間の天気データ取得
   * print()の呼び出し
   * @param  cityName
   */
  init(cityName,oneDay) {
    let url = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" +
    cityName +
    "&appid=9ab6492bf227782c3c7ae7417a624014";

    $.ajax({
      url:url
    }).then((json) =>{
      console.log(json);
      this.json = json;
      this.print(oneDay);
    },(err) =>{
      console.log(err);
    });
  }

  /**
   * 週間天気予報表示
   */
  print(oneDay) {
    d3.select("#weekly > svg").remove();

    let w = 850;
    let h = 200;
    let padding = 25;

    //曜日表示用配列
    let day = [];

    day[0] = "Sun";
    day[1] = "Mon";
    day[2] = "Tue";
    day[3] = "Wed";
    day[4] = "Thu";
    day[5] = "Fri";
    day[6] = "Sat";

    //表の行名表示テキスト用配列
    let rowTitleData = [];

    rowTitleData[0] = "DATE";
    rowTitleData[1] = "WEATHER";
    rowTitleData[2] = "MAX";
    rowTitleData[3] = "MIN";

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

    let xScale = d3.scale.linear()
      .domain([0,dataset.length])
      .range([padding,w-padding]);

    //表の行名表示用グループ作成
    let rowTitle = svg.append("g").selectAll("g")
      .data(rowTitleData)
      .enter()
      .append("text");

    //表の行名表示
    rowTitle.attr({
        x: 0,
        y: function(d,i) {return yPoint[i];}
      })
      .text(function(d) {return d;});

    //週間天気予報表示用グループ作成
    let weekly = svg.append("g").selectAll("g")
      .data(dataset)
      .enter();

    //週間天気予報の日付表示
    weekly.append("text")
      .attr({
        x: function(d,i){return xScale(i) + 70;},
        y: function() {return yPoint[0];}
      })
      .text(function(d) {
        let date = new Date(d.dt * 1000);
        return (date.getMonth() + 1) + "/" +
                date.getDate() +
                "(" + day[date.getDay()] + ")";
      });

    //週間天気予報の天気アイコン表示
    this.image = weekly.append("image");
      //on click 未実装

    this.image
      .on("click", function(d,i) {
        console.log(d.dt);
        oneDay.updateForecastList(d.dt);
        console.log(d.dt);
        oneDay.print();
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
        x: function(d,i){return xScale(i) + 70;},
        y: function() {return yPoint[1];}
      });

    //週間天気予報の最高気温表示
    weekly.append("text")
      .attr({
        x: function(d,i){return xScale(i) + 85;},
        y: function() {return yPoint[2];}
      })
      .text(function(d) {
        return new Number(d.temp.max - 273.15).toFixed(1) + "℃";
      });

    //週間天気予報の最低気温表示
    weekly.append("text")
      .attr({
        x: function(d,i){return xScale(i) + 85;},
        y: function() {return yPoint[3];}
      })
      .text(function(d) {
        return new Number(d.temp.min - 273.15).toFixed(1) + "℃";
      });
  }
}
