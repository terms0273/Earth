import * as d3 from "d3";

export default class OneDayWeatherForecast{
  constructor(){}

  init(weather){

    //TODO再描画処理にしたほうがいいかも
    d3.select("#one-day svg").remove();

    //メンバー変数の初期化
    this.date = new Date();
    this.date.setHours(3);
    this.sunrise = weather.sunrise;
    this.sunset = weather.sunset;

    let url = "http://api.openweathermap.org/data/2.5/forecast?q=" +
    weather.cityName +
    "&appid=9ab6492bf227782c3c7ae7417a624014";
    $.ajax({
        url:url
    }).then((json) =>{
      this.json = json;
      this.print();  //成功時
    },
      (err) =>{
        console.log(err);
      }
    );
  }

  print(){

    let width = 760;
    let height = 600;
    let radius = 100;
    let margin = 50;

    let svg = d3.select("#one-day").append("svg")
      .attr("width", width)
      .attr("height", height);

    // translateで画面中央に移動。
    let translated = svg.append("g")
      .attr("transform","translate(" + (radius + margin) +","+ (radius + margin) +")");


    //データの初期化
    let data = [];
    //表示しないアイコン数
    let notDataCount = new Date(this.json.list[0].dt * 1000).getHours() / 3 - 1;
    //21字以降だと-1になってしまうので
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
            return "http://openweathermap.org/img/w/03n.png" //TODO:過ぎた予報のイメージ画像
          }else{
            return "http://openweathermap.org/img/w/"+d.weather[0].icon+".png";
          }
        }
      });

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
        x:(d,i) => {return Math.cos(rScale(i) * Math.PI / 180) * (radius + 40) + 3},
        y:(d,i) => {return Math.sin(rScale(i) * Math.PI / 180) * (radius + 40) + 30}
      })
      .text((d,i) => {return (i * 3 + 3  % 24) + ":00"});

      let nowIcon = translated.append("image")
      .attr({
        x:0,
        y:0
      })
      .transition()
      .duration(500)
      .ease("linear")
      .attr({
        x:() => {return Math.cos(nowScale(this.date.getHours()) * Math.PI / 180) * (radius - 50)},
        y:() => {return Math.sin(nowScale(this.date.getHours()) * Math.PI / 180) * (radius - 50)},
        href: () => {
          if(this.isSun()){
            return "http://openweathermap.org/img/w/01d.png"
          }else{
            return "http://openweathermap.org/img/w/01n.png"
          }
        }
      });
    let center = translated.append("circle")
      .attr({
        cx:()=>{return 25},
        cy:()=>{return 25},
        r:2,
        fill:"orange"
      });


  let riseMinutes = new Date(this.sunrise * 1000).getHours() * 60 + new Date(this.sunrise * 1000).getMinutes();
  let setMinutes = new Date(this.sunset * 1000).getHours() * 60 + new Date(this.sunset * 1000).getMinutes();
  let deyMinutes = 24 * 60;
  var dataArr = [
     {score: setMinutes - riseMinutes},
     {score: deyMinutes - (setMinutes - riseMinutes)}
 ];
  var colors = [
    "rgba(255, 0, 0, 0.1)",
    "rgba(0, 0, 255, 0.1)"
  ];
  let riseScale = d3.scale.linear()
    .domain([0,deyMinutes])
    .range([180,540]);

 //合計値を算出する上でのラムダ．
 var actGettingScore = function(d){return d.score};
 //arcオブジェクトは扇形に相当するd操作を生成する．
 var arc = d3.svg.arc()
     .startAngle(function(d){return 0;})
     .endAngle(function(d){return Math.PI * 2 * d.score/ deyMinutes; })
     .innerRadius(function(d){return 20;})
     .outerRadius(function(d){return radius + 20;});
var circleGraph = translated.append("g");
 circleGraph.selectAll("path")
     .data(dataArr)
     .enter()
     .append("path")
     .attr({

     })
     .transition()
     .duration(500)
     .ease("linear")
     .attr({
       d: (d,i) => {return arc(d)},
       transform: (d,i) => {
           //累計値を計算して，回転角に変換する．
           var subArr = i == 0 ? []: dataArr.slice(0, i);
           return "translate(25,25),rotate(" + 360 * d3.sum(subArr, actGettingScore)/deyMinutes + "),rotate("+riseScale(riseMinutes)+")"
       },
       stroke: "white",
       fill: (d,i) => {return colors[i]}
     });

  }

  isSun(){
    let dt = this.date.getTime() / 1000;
    if(this.sunrise <= dt && dt <= this.sunset){
      return true;
    }
    return false;
  }
}
