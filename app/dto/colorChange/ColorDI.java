package dto.colorChange;

/**
 * DIを計算し、配色するクラス　（ DI＝不快指数）
 *
 * @author r-takahashi
 */
public class ColorDI extends ColorChange {

    double DI = 0;

    /**
     * 不快指数を計算する 小数点第２位を切り上げて、elemにString型で代入する
     */
    public ColorDI(double temp, int humidity) {
        DI = Math.round((0.81 * temp + 0.01 * humidity * (0.99 * temp - 14.3) + 46.3) * 10);
        DI = DI / 10;
        setColorDI(DI);
        super.elem = DI + "";
    }

    /**
     * 不快指数を色分けして表示する http://keisan.casio.jp/exec/system/1202883065　参照
     */
    void setColorDI(double DI) {
        // 暑くてたまらない
        if (DI >= 85.0) {
            super.color = "#E4B3FF";
        } // 暑くて汗が出る
        else if (DI >= 80.0) {
            super.color = "#FFB3CD";
        } // やや暑い
        else if (DI >= 75.0) {
            super.color = "#FFBEB3";
        } // 暑くない
        else if (DI >= 70.0) {
            super.color = "#F4FFB3";
        } // 快い
        else if (DI >= 65.0) {
            super.color = "#CDFFB3";
        } // 何も感じない
        else if (DI >= 60.0) {
            super.color = "#B3FFBE";
        } // 肌寒い
        else if (DI >= 55.0) {
            super.color = "#B3FFE4";
        } // 寒い
        else {
            super.color = "#B3F4FF";
        }
    }
}
