import * as d3 from "d3";

export default class OneDayWeatherForecast{
  constructor(){}

  /**
   *jsonを新しく持ってくる
   *そしてprint()を呼び出す
   */
  init(weather){


    //TODO:朝9時まではすべて夜になってしまうバグを治す
    //現在の日付の時間を変更する デバッグ用コメント
    //this.date.setHours(3);

    let url = "http://api.openweathermap.org/data/2.5/forecast?q=" +
      weather.city +
      "&appid=9ab6492bf227782c3c7ae7417a624014";

    $.ajax({
      url:url
    }).then((json) =>{
      //成功したときの処理
      console.log(json);
      //メンバー変数の初期化
      this.timeZone = this.timeZoneOffset(weather.lat,weather.lon) * 1000;
      console.log(this.timeZone);
      this.date = new Date(Date.now() + this.timeZone);
      this.sunrise = weather.sunrise;
      this.sunset = weather.sunset;
      this.json = json;
      this.updateForecastList(json.list[0].dt - 1);
      this.print();
    },
      (err) =>{
        console.log(err);
      }
    );
  }

  /**
   *1日の詳細の天気予報を表示する
   */
  print(){
    d3.select("#one-day > svg").remove();

    let width = 760;
    let height = 350;
    let radius = 100;
    let margin = 50;

    let svg = d3.select("#one-day").append("svg")
      .attr("width", width)
      .attr("height", height);

    // translateで画面中央に移動。
    let translated = svg.append("g")
      .attr("transform","translate("
        + (radius + margin) +","
        + (radius + margin + 20) +")"
      );

    // 360度になるように均等に角度を割りふる。
    let rScale = d3.scale.linear()
      .domain([0,24])
      .range([90,450]);

    //日付を表示する
    let dateFormat = require('dateformat');
    let now = svg.append("g")
      .selectAll("text")
      .data([this.forecastList[this.notDataCount]])
      .enter()
      .append("text")
      .attr({
        x:radius + margin,
        y:20
      })
      .text((d) => {
        return dateFormat(new Date(d.dt * 1000 - 1 + this.timeZone)
               .toUTCString(),"UTC:m/d(ddd)");
      });


    //天気予報のアイコンを表示する
    let rotated = translated.selectAll("g").data(this.forecastList).enter()
      .append("g");
    let image = rotated.append("image")
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
        x:(d,i) => {return Math.cos(rScale(new Date(d.dt * 1000 + this.timeZone).getUTCHours()) * Math.PI / 180) * radius},
        y:(d,i) => {return Math.sin(rScale(new Date(d.dt * 1000 + this.timeZone).getUTCHours()) * Math.PI / 180) * radius},
        href:(d) => {
          if(typeof d.weather === "undefined"){
            return "/assets/images/finished-icon.png";
          }else{
            let dn = "d";
            if(!this.isSun(d.dt + this.timeZone / 1000)){
              dn = "n";
            }
            let iconName = d.weather[0].icon
                          .slice(0,d.weather[0].icon.length - 1)
                          + dn;
            return "http://openweathermap.org/img/w/"+iconName+".png";
          }
        }
      });

    //時間をテキストで表示する 例）21:00
    let nowScale = d3.scale.linear()
      .domain([0,24])
      .range([90,450]);

    let text = rotated.append("text")
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
        x:(d,i) => {
          return Math.cos(rScale(new Date(d.dt * 1000 + this.timeZone).getUTCHours()) * Math.PI / 180) * (radius + 40) + 3;
        },
        y:(d,i) => {
          return Math.sin(rScale(new Date(d.dt * 1000 + this.timeZone).getUTCHours()) * Math.PI / 180) * (radius + 40) + 30;
        }
      })
      .text((d,i) => {
        var dateFormat = require('dateformat');
        return new Date(d.dt * 1000 + this.timeZone).getUTCHours() + ":00";
      });

    //現在の太陽or月を表示する
    let nowIcon = translated.append("image")
      .attr({
        x:0,
        y:0
      })
      .transition()
      .duration(500)
      .ease("linear")
      .attr({
        x:() => {
          return Math.cos(nowScale(this.date.getUTCHours()) * Math.PI / 180)
                 * (radius - 50);
        },
        y:() => {
          return Math.sin(nowScale(this.date.getUTCHours()) * Math.PI / 180)
                 * (radius - 50);
        },
        href: () => {
          let tempDate = new Date(this.forecastList[0].dt * 1000 + this.timeZone - 1);
          if(this.date.getUTCDate() !== tempDate.getUTCDate()){
            return null;
          }else if(this.isSun(this.date.getTime() / 1000)){
            return "http://openweathermap.org/img/w/01d.png";
          }else{
            return "http://openweathermap.org/img/w/01n.png";
          }
        }
      });

    //真ん中に点をつける
    let center = translated.append("circle")
      .attr({
        cx:()=>{return 25;},
        cy:()=>{return 25;},
        r:2,
        fill:"orange"
      });

    //円グラフで日の出、日没を表現する
    let risedt =this.sunrise;
    let setdt = this.sunset;
    let deySecond = 24 * 60 * 60;
    let dataArr = [
       {score: setdt - risedt},
       {score: deySecond - (setdt - risedt)}
    ];
    let colors = [
      "255, 0, 0",
      "0, 0, 255"
    ];
    let riseScale = d3.scale.linear()
      .domain([0,deySecond])
      .range([180,540]);

    //合計値を算出する上でのラムダ．
    let actGettingScore = function(d){return d.score;};
    //arcオブジェクトは扇形に相当するd操作を生成する．
    let arc = d3.svg.arc()
      .startAngle(function(d){return 0;})
      .endAngle(function(d){return Math.PI * 2 * d.score/ deySecond;})
      .innerRadius(function(d){return 20;})
      .outerRadius(function(d){return radius + 20;});

    let temp = new Date(risedt * 1000 + this.timeZone);
    let riseSecond =
      temp.getUTCHours() * 3600 + temp.getUTCMinutes() * 60 + temp.getUTCSeconds();
    let circleGraph = translated.append("g");
    circleGraph.selectAll("path")
      .data(dataArr)
      .enter()
      .append("path")
      .attr({
        fill: (d,i) => {return "rgba("+colors[i]+", 0.0)";}
      })
      .transition()
      .duration(500)
      .ease("linear")
      .attr({
        d: (d,i) => {return arc(d);},
        transform: (d,i) => {
          //累計値を計算して，回転角に変換する．
          let subArr = i;
          if(i == 0){
            subArr = [];
          }else{
            subArr = dataArr.slice(0, i);
          }
          return "translate(25,25),rotate("
                    + 360 * d3.sum(subArr, actGettingScore) / deySecond +
                 "),rotate("
                    + riseScale(riseSecond) +
                 ")";
        },
        stroke: "white",
        fill: (d,i) => {return "rgba("+colors[i]+", 0.1)";}
      });
  }

  //TODO:今日かそれ以外かで処理を分ける
  /*
   *日付をもらいForecastListを更新し
   *dt:秒単位
   */
  updateForecastList(dt){
    //データの初期化
    this.forecastList = [];
    this.notDataCount = 0;

    let date = new Date(dt * 1000 + this.timeZone);
    date.setUTCHours(0);
    //21時から24時の間が次の日判定になってしまうため - 1をする
    let tempDate = new Date(this.json.list[0].dt * 1000 + this.timeZone - 1);
    //今日か今日以外か
    if(date.getUTCDate() === tempDate.getUTCDate()){
      //表示しないアイコン数
      this.notDataCount = Math.ceil(tempDate.getUTCHours() / 3 - 1);
      //21時以降だと-1になってしまうので
      if(this.notDataCount == -1){
        this.notDataCount = 7;
      }
      for(let i = 0; i < this.notDataCount; i++){
        let forwardDt = this.json.list[0].dt - (3600 * 3) * (this.notDataCount - i);
        this.forecastList.push({"dt":forwardDt});
      }
      for(let i = 0; i < 8 - this.notDataCount; i++){
        this.forecastList.push(this.json.list[i]);
      }
    }else{
      let i = 0;
      let count = 0;
      while(count < 8){
        let forecast = this.json.list[i++];
        let temp = date.getTime() / 1000 + 1;
        if(forecast.dt + this.timeZone / 1000 >= temp){
          this.forecastList.push(forecast);
          count++;
        }
      }
    }
    console.log(this.forecastList);
  }

  /*
   *緯度、経度を入れるとoffsetを返す
   *return offset秒単位
   */
  timeZoneOffset(lon,lat){
    let timeZone;
    let url = "https://maps.googleapis.com/maps/api/timezone/json?"
             +"location="+lon+","+lat+"&"
             +"timestamp=0&sensor=false";
    let json = $.ajax({

      type: "GET",
      url:url,
      async: false,
      success: (json) => {
        timeZone = json.rawOffset;
      },
  		error: (err) => {
  			console.log(err);
  		}
    });
    return timeZone;
  }
  /*
   *指定された時刻が太陽か月かを判断する
   */
  isSun(dt){
    let temp = new Date(dt * 1000);
    let minutes = temp.getUTCHours() * 60 + temp.getUTCMinutes();
    temp = new Date(this.sunrise * 1000 + this.timeZone);
    let riseMinutes = temp.getUTCHours() * 60 + temp.getUTCMinutes();
    temp = new Date(this.sunset * 1000 + this.timeZone);
    let setMinutes = temp.getUTCHours() * 60 + temp.getUTCMinutes();

    if(riseMinutes > setMinutes){
      setMinutes += 24 * 60;
    }

    if(riseMinutes <= minutes && minutes <= setMinutes){
      return true;
    }
    return false;
  }
}
