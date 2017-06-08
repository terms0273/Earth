import * as d3 from "d3";

export default class OneDayWeatherForecast{
  constructor(){}

  init(weather){

    //TODO再描画処理にしたほうがいいかも
    d3.select("#one-day svg").remove();

    //メンバー変数の初期化
    this.date = new Date();
    this.sunrise = weather.sunrise;
    this.sunset = weather.sunset;

    let url = "http://api.openweathermap.org/data/2.5/forecast?q=" +
    weather.cityName +
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
    let notDataCount = (new Date(json.list[0].dt * 1000).getHours()) / 3 - 1;
    for(let i = 0; i < notDataCount; i++){
      data.push(null);
    }
    for(let i = 0; i < 8 - notDataCount; i++){
      data.push(json.list[i]);
    }
    let lc = 0;

    // d3.extent()で、データの最大値と最小値が[最大値,最小値]で出る。
    let dataExtent = d3.extent(data);

    // 360度になるように均等に角度を割りふる。
    let rScale = d3.scale.linear()
      .domain([0,data.length])
      .range([135,495]);

    let nowScale = d3.scale.linear()
      .domain([0,24])
      .range([90,450]);

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
            return "" //TODO:過ぎた予報のイメージ画像
          }else{
            return "http://openweathermap.org/img/w/"+d.weather[0].icon+".png";
          }
        }
      });

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
        x:(d,i) => {return Math.cos(rScale(i) * Math.PI / 180) * radius},
        y:(d,i) => {return Math.sin(rScale(i) * Math.PI / 180) * radius}
      })
      .text((d,i) => {return (i * 3 + 3  % 24) + ":00"});
  }

  isSun(){
    let dt = this.date.getTime() / 1000;
    if(this.sunrise <= dt && dt <= this.sunset){
      return true;
    }
    return false;
  }
}
