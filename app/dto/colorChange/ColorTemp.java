package dto.colorChange;

/**
 * 温度を表示している行の色分けを可能とするもの 夏日、真夏日、猛暑日の基準になる気温ごとに色分け
 * @author a-yamamoto
 */
public class ColorTemp extends ColorChange {

    public ColorTemp(double temp) {
        temp = Math.round(temp * 10);
        temp = temp / 10;
        setColorTemp(temp);
        super.elem = temp + "℃";
    }

    void setColorTemp(double temp) {
        //猛暑日
        if (temp >= 35.0) {
            super.color = "#ffb3f4";
        } //真夏日
        else if (temp >= 30.0) {
            super.color = "#ffb3cd";
        } //夏日
        else if (temp >= 25.0) {
            super.color = "#ffbeb3";
        } 
        else if(temp >= 20.0) {
            super.color = "#ffe4b3";
        }
        else if(temp >= 15.0) {
            super.color = "#f4ffb3";
        }
        else if(temp >= 10.0) {
            super.color = "#cdffb3";
        }
        else if(temp >= 5.0) {
            super.color = "#b3ffbe";
        } //氷点下
        else if (temp <= 0.0) {
            super.color = "#b3ffe4";
        } else {
            super.color = "#b3f4ff";
        }
    }

}
