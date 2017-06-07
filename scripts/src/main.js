import Weather from "./weather";
import Map from "./map";
import WeeklyWeatherForecast from "./weeklyWeatherForecast";

$(function() {
    let weather = new Weather();
    let map = new Map();
    let weekly = new WeeklyWeatherForecast();

    $("#search-city").click(updateWeather);
    $("#input-city").keydown((e) =>{
        if(e.keyCode == 13){
            updateWeather();
        }
    });
    weather.send(weather.city);

    function updateWeather(){
        let newCity = $("#input-city").val();
        weather.send(newCity,map);
    }

    $("#tab-weather-forecast").click(() =>{
      weekly.send(weather.city);
    });
});
