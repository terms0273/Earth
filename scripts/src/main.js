import Weather from "./weather";
import Map from "./map";
import Graph from "./graph";


$(function() {
    let weather = new Weather();
    let map = new Map();

    $("#search-city").click(updateWeather);
    $("#tag-graph").click(() =>{
      let graph = new Graph();
      graph.send(weather.city);
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
