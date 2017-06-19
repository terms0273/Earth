package dto.colorChange;

/**
 * 気圧の値の変化で色を変化させる処理
 * @author a-yamamoto
 */
public class ColorPressure extends ColorChange {

    private static final String UNIT = "hPa";

    public ColorPressure(int pressure) {
        setColorPressure(pressure);
        super.elem = pressure + UNIT;
    }

    /**
     * 2hPa変化すると体調に影響するという情報を見たため 平均の気圧の高さである1013hPaを基準に、3hPaずつ色を変化させている。
     */
    void setColorPressure(int pressure) {
        if (pressure >= 1016) {
            super.color = "#ffbeb3";
        } else if (pressure >= 1013) {
            super.color = "#ffe4b3";
        } else if (pressure >= 1010) {
            super.color = "#f4ffb3";
        } else if (pressure >= 1007) {
            super.color = "#cdffb3";
        } else if (pressure >= 1004) {
            super.color = "#b3ffbe";
        } else if (pressure >= 1001) {
            super.color = "#b3ffe4";
        } else if (pressure >= 998) {
            super.color = "#b3f4ff";
        } else if (pressure >= 997) {
            super.color = "#b3cdff";
        } else if (pressure >= 996) {
            super.color = "#beb3ff";
        } else {
            super.color = "#e4b3ff";
        }
    }

}
