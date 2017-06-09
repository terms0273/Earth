import * as d3 from "d3";

export default class OneDayWeatherForecast{
  constructor(){}

  /**
   *jsonを新しく持ってくる
   *そしてprint()を呼び出す
   */
  init(weather){

    d3.select("#one-day svg").remove();

    //メンバー変数の初期化
    this.date = new Date();
    //現在の日付の時間を変更する デバッグ用コメント
    //this.date.setHours(3);
    this.sunrise = weather.sunrise;
    this.sunset = weather.sunset;

    let url = "http://api.openweathermap.org/data/2.5/forecast?q=" +
    weather.cityName +
    "&appid=9ab6492bf227782c3c7ae7417a624014";
    $.ajax({
      url:url
    }).then((json) =>{
      //成功したときの処理
      console.log(json);
      this.json = json;
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
        + (radius + margin) +")"
      );

    //データの初期化
    let data = [];
    //表示しないアイコン数
    let notDataCount = new Date(this.json.list[0].dt * 1000).getHours() / 3 - 1;
    //21時以降だと-1になってしまうので
    if(notDataCount == -1){
      notDataCount = 7
    }
    for(let i = 0; i < notDataCount; i++){
      data.push(null);
    }
    for(let i = 0; i < 8 - notDataCount; i++){
      data.push(this.json.list[i]);
    }

    // 360度になるように均等に角度を割りふる。
    let rScale = d3.scale.linear()
      .domain([0,data.length])
      .range([135,495]);

    let rotated = translated.selectAll("g").data(data).enter()
      .append("g");

    //天気予報のアイコンを表示する
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
        x:(d,i) => {return Math.cos(rScale(i) * Math.PI / 180) * radius},
        y:(d,i) => {return Math.sin(rScale(i) * Math.PI / 180) * radius},
        href:(d) => {
          if(d === null){
            return "/assets/images/finished-icon.png";
          }else{
            return "http://openweathermap.org/img/w/"+d.weather[0].icon+".png";
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
          return Math.cos(rScale(i) * Math.PI / 180) * (radius + 40) + 3;
        },
        y:(d,i) => {
          return Math.sin(rScale(i) * Math.PI / 180) * (radius + 40) + 30;
        }
      })
      .text((d,i) => {return (i * 3 + 3  % 24) + ":00";});

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
          return Math.cos(nowScale(this.date.getHours()) * Math.PI / 180)
                 * (radius - 50);
        },
        y:() => {
          return Math.sin(nowScale(this.date.getHours()) * Math.PI / 180)
                 * (radius - 50);
        },
        href: () => {
          if(this.isSun()){
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

    let temp = new Date(risedt * 1000);
    let riseSecond =
      temp.getHours() * 3600 + temp.getMinutes() * 60 + temp.getSeconds();
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

  /*
   *太陽か月かを判断する
   */
  isSun(){
    let dt = this.date.getTime() / 1000;
    if(this.sunrise <= dt && dt <= this.sunset){
      return true;
    }
    return false;
  }
}
