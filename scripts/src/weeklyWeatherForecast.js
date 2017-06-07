import * as d3 from "d3";

export default class WeeklyWeatherForecast {
  constructor() {

  }

  init(json) {
    var w = 500;
    var h = 200;
    var padding = 20;

    var svg = d3.select("body").append("svg").attr({width:w, height:h});

    var data = [];
    for (var i = 0; i < data.length; i++) {
      data[i] = json.list[i];
    }

    var imgs = d3.selectAll("")
    .data(data)
    .enter()
    .append('img')
    .attr({
      'src'   : function(data){
        return 'http://openweathermap.org/img/w/'+d.weather[0].icon+'.png';
      },
      'width' : 50,
      'height': 50,

    });
  }

  send(cityName) {
    let url = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" +
    cityName +
    "&appid=9ab6492bf227782c3c7ae7417a624014";

    $.ajax({
        url:url
    }).then((json) =>{
        console.log(json);
        this.init(json);
    },(err) =>{
        console.log(err);
    });
  }
}
