export default class Weather{
    constructor(){
        this.city = "Tokyo";
    }
    print(json){
        this.city = json.name;
        $("#city-name").html("<img src='/assets/images/flag/"+json.sys.country.toLowerCase()+".png'>" + this.city);
        $("#weather").text(json.weather[0].main);
        $("#icon").html("<img src='http://openweathermap.org/img/w/"+json.weather[0].icon+".png'>");
        let num = Number(json.main.temp - 273 );
        $("#temperature").text(num.toFixed(1)+"℃");
        $("#wind").text(json.wind.speed+"m/s");
        $("#cloud").text("空全体の"+json.clouds.all+"%が雲");
        $("#pressure").text(json.main.pressure + "hPa");
        $("#humidity").text(json.main.humidity + "%");//湿度％

        this.sunrise = json.sys.sunrise;
        $("#sunrise").text(new Date(this.sunrise * 1000));

        this.sunset = json.sys.sunset;
        $("#sunset").text(new Date(this.sunset * 1000));

        this.lat = json.coord.lat;
        this.lon = json.coord.lon;
        $("#latlon").text("lat:" + this.lat + ",lot:" + this.lon);

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
}
