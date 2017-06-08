import Weather from "./weather";
import Map from "./map";
import Graph from "./graph";


$(function() {
    let weather = new Weather();
    let map = new Map();
    let graph = new Graph();

    //検索ボタン押したときに呼ぶ
    $("#search-city").click(updateWeather);

    //グラフボタン押したとき展開
    $("#tag-graph").click(() =>{
      if($("#tag-graph").parent().attr("aria-expanded") === "false"){
        ;
      }
    });

    //チェックボックスにチェック
    $(":checkbox").click(()=>{
      graph.init(weather.city);
    });

    //エンターボタンで検索動作
    $("#input-city").keydown((e) =>{
        if(e.keyCode == 13){
            updateWeather();
        }
    });
    weather.send(weather.city);

    //検索したときの動作
    function updateWeather(){
        let newCity = $("#input-city").val();
        weather.send(newCity,map);
        setTimeout(function(){graph.init(weather.city)}, 500);
    }
});
