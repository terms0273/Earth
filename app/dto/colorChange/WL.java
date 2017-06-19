package dto.colorChange;

import dto.colorChange.ColorCloudAll;
import dto.colorChange.ColorIcon;
import dto.colorChange.ColorWindSpeed;
import dto.colorChange.ColorTemp;
import dto.colorChange.ColorMain;
import dto.colorChange.ColorPressure;
import dto.colorChange.ColorChange;
import dto.colorChange.ColorDI;
import dto.colorChange.ColorHumidity;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import models.Weather;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.time.DateFormatUtils;

/**
 * 過去の天気情報を1時間ごとに一覧表示する DB内の情報が重複している場合、欠損している場合の対応をしていない（24時間分の表記がない日もある）
 * 東京の情報のみ表示
 *
 * @author r-takahashi
 */
public class WL {

    public List<String> str1;

    public WL(List<Weather> list) {
        // 各変数名は、DB内の表示名に従う
        str1 = new ArrayList<String>();
        map = new LinkedHashMap<String, List<ColorChange>>();
        List<ColorChange> icon = new ArrayList<ColorChange>();
        List<ColorChange> main = new ArrayList<ColorChange>();
        List<ColorChange> temp = new ArrayList<ColorChange>();
        List<ColorChange> windSpeed = new ArrayList<ColorChange>();
        List<ColorChange> cloudAll = new ArrayList<ColorChange>();
        List<ColorChange> pressure = new ArrayList<ColorChange>();
        List<ColorChange> humidity = new ArrayList<ColorChange>();
        List<ColorChange> DI = new ArrayList<ColorChange>();
        List<ColorChange> lat = new ArrayList<ColorChange>();
        List<ColorChange> lon = new ArrayList<ColorChange>();
        List<ColorChange> sunrise = new ArrayList<ColorChange>();
        List<ColorChange> sunset = new ArrayList<ColorChange>();        
        
        for (Weather l : list) {
            DateFormat timestampFormat1 = new SimpleDateFormat("HH:mm");
            str1.add(timestampFormat1.format(l.dt));
            icon.add(new ColorIcon(l.icon));
            main.add(new ColorMain(l.main));
            temp.add(new ColorTemp(l.temp));
            windSpeed.add(new ColorWindSpeed(l.windSpeed));
            cloudAll.add(new ColorCloudAll(l.cloudAll));
            pressure.add(new ColorPressure(l.pressure));
            humidity.add(new ColorHumidity(l.humidity));
            DI.add(new ColorDI(l.temp, l.humidity));
            lat.add(new ColorLat(l.lat));
            lon.add(new ColorLon(l.lon));
            sunrise.add(new ColorSunrise(l.sunrise));
            sunset.add(new ColorSunset(l.sunset));
        }
        map.put("ICON", icon);
        map.put("WEATHER", main);
        map.put("TEMPERATURE", temp);
        map.put("HUMIDITY", humidity);
        map.put("DI", DI);
        map.put("WIND-SPEED", windSpeed);
        map.put("PRESSURE", pressure);
        map.put("CLOUD-ALL", cloudAll);
        map.put("LAT", lat);
        map.put("LON", lon);
        map.put("SUNRISE",sunrise);
        map.put("SUNSET", sunset);
    }
    public Map<String, List<ColorChange>> map;
}
