package dto.colorChange;

/**
 * 湿度を色分けできるようにした 今回は色分けなし
 *
 * @author a-yamamoto
 */
public class ColorHumidity extends ColorChange {

    public ColorHumidity(int humidity) {
        setColorHumidity(humidity);
        super.elem = humidity + "%";
    }
    
   void setColorHumidity(int humidity) {
        if (humidity >= 90) {
            super.color = "#ffbeb3";
        } else if (humidity >= 80) {
            super.color = "#ffe4b3";
        } else if (humidity >= 70) {
            super.color = "#f4ffb3";
        } else if (humidity >= 60) {
            super.color = "#cdffb3";
        } else if (humidity >= 50) {
            super.color = "#b3ffbe";
        } else if (humidity >= 40) {
            super.color = "#b3ffe4";
        } else if (humidity >= 30) {
            super.color = "#b3f4ff";
        } else if (humidity >= 20) {
            super.color = "#b3cdff";
        } else if (humidity >= 10) {
            super.color = "#beb3ff";
        } else {
            super.color = "#e4b3ff";
        }
    }
}
