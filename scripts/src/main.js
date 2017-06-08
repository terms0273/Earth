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

    let newCity = $("#input-city").val();
    function updateWeather(){
    weather.send(newCity,map);
    setTimeout(()=>{weekly.init(weather.city);}, 500);
  }

  $("#tab-weather-forecast").click(() =>{
    if($("#tab-weather-forecast").parent().attr("aria-expanded") === "false"){
      weekly.init(weather.city);
    }
  });
});
