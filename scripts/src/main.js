import Weather from "./weather";
import Map from "./map";
import OneDayWeatherForecast from "./oneDayWeatherForecast";

$(function() {
  let weather = new Weather();
  let map = new Map();
  let oneDay = new OneDayWeatherForecast();

  $("#search-city").click(updateWeather);
  $("#tab-weather-forecast").click(()=>{
    oneDay.init(weather.city);
  });
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



});
