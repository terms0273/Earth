export default class Weather{
    constructor(){
        this.city = "Tokyo";
    }
    print(json){
        this.city = json.name;
        if(typeof json.sys.country !== "undefined"){
          $("#city-name").html("<img src='/assets/images/flag/"+json.sys.country.toLowerCase()+".png'>" + this.city);
        }else{
          //画像が見つからない
          $("#city-name").html(this.city);
        }
        $("#weather").text(json.weather[0].main);
        $("#icon").html("<img src='http://openweathermap.org/img/w/"+json.weather[0].icon+".png'>");
        let num = Number(json.main.temp - 273 );
        $("#temperature").text(num.toFixed(1)+"℃");
        $("#wind").text(json.wind.speed+"m/s");
        $("#cloud").text("空全体の"+json.clouds.all+"%が雲");
        $("#pressure").text(json.main.pressure + "hPa");
        $("#humidity").text(json.main.humidity + "%");//湿度％


        this.lat = json.coord.lat;
        this.lon = json.coord.lon;
        $("#latlon").text("lat:" + this.lat + ",lot:" + this.lon);

        this.timeZone = this.timeZoneOffset(this.lat,this.lon) * 1000;

        var dateFormat = require('dateformat');

        this.sunrise = json.sys.sunrise;
        $("#sunrise")
        .text(dateFormat(new Date(this.sunrise * 1000 + this.timeZone).toUTCString(),"UTC:yyyy/mm/dd HH:MM"));

        this.sunset = json.sys.sunset;
        $("#sunset")
        .text(dateFormat(new Date(this.sunset * 1000 + this.timeZone).toUTCString(),"UTC:yyyy/mm/dd HH:MM"));
    }

    send(cityName,map){
        let url = "http://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=9ab6492bf227782c3c7ae7417a624014";

        $.ajax({
            url:url
        }).then((json) =>{
            console.log(json);
            this.print(json);
            map.changeCurrent(this.lat,this.lon);
        },(err) =>{
            console.log(err);
        });
    }

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
}
