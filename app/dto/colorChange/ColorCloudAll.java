package dto.colorChange;

/**
 * 空を雲が覆っている割合を表示する行の色分け可能とするもの。 今回は色分けは行っていない。
 *
 * @author a-yamamoto
 */
public class ColorCloudAll extends ColorChange {

    public ColorCloudAll(int cloudAll) {
        setColorCloudAll(cloudAll);
        super.elem = cloudAll + "%";
    }
    
    void setColorCloudAll(int cloudAll) {
        if (cloudAll >= 95) {
            super.color = "#ffbeb3";
        } else if (cloudAll >= 85) {
            super.color = "#ffe4b3";
        } else if (cloudAll >= 75) {
            super.color = "#f4ffb3";
        } else if (cloudAll >= 65) {
            super.color = "#cdffb3";
        } else if (cloudAll >= 55) {
            super.color = "#b3ffbe";
        } else if (cloudAll >= 45) {
            super.color = "#b3ffe4";
        } else if (cloudAll >= 35) {
            super.color = "#b3f4ff";
        } else if (cloudAll >= 25) {
            super.color = "#b3cdff";
        } else if (cloudAll >= 15) {
            super.color = "#beb3ff";
        } else {
            super.color = "#e4b3ff";
        }
    }
}
