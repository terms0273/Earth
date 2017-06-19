package dto.colorChange;

/**
 * 風速表示の行を色分け可能とするもの。 今回は色分けは行っていない。
 *
 * @author a-yamamoto
 */
public class ColorWindSpeed extends ColorChange {

    public ColorWindSpeed(double windSpeed) {
        setColorWindSpeed(windSpeed);
        super.elem = windSpeed + "m/s";
    }
    
    void setColorWindSpeed(double windSpeed) {
        //猛烈な風
        if (windSpeed >= 30.0) {
            super.color = "#ffb3f4";
        } //非常に強い風
        else if (windSpeed >= 20.0) {
            super.color = "#ffb3cd";
        } //強い風
        else if (windSpeed >= 15.0) {
            super.color = "#ffbeb3";
        } //やや強い風
        else if(windSpeed >= 10.0) {
            super.color = "#ffe4b3";
        }else if(windSpeed >= 8.0) {
            super.color = "#f4ffb3";
        }else if(windSpeed >= 6.0) {
            super.color = "#cdffb3";
        }else if(windSpeed >= 4.0) {
            super.color = "#b3ffbe";
        }else if(windSpeed >= 2.0) {
            super.color = "#b3ffe4";
        }else{
            super.color = "#b3f4ff";
        }
    }
}
