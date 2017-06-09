import Weather from "./weather";
import Map from "./map";
import OneDayWeatherForecast from "./oneDayWeatherForecast";

$(function() {
  let weather = new Weather();
  let map = new Map();
  let oneDay = new OneDayWeatherForecast();

  weather.send(weather.city);
  setTimeout(()=>{oneDay.init(weather);}, 200);

  $("#search-city").click(updateWeather);
  $("#tab-weather-forecast").click(()=>{
    if($("#tab-weather-forecast").parent().attr("aria-expanded") === "false"){
      d3.select("svg").remove();
      oneDay.print();
    }
  });
  $("#input-city").keydown((e) =>{
    if(e.keyCode == 13){
      updateWeather();
    }
  });

  function updateWeather(){
    let newCity = $("#input-city").val();
    weather.send(newCity,map);
    setTimeout(()=>{oneDay.init(weather);}, 500);
  }
});
