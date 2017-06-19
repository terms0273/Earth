/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dto.colorChange;

import java.util.Date;

/**
 *
 * @author a-yamamoto
 */
public class ColorSunrise extends ColorChange {
    public ColorSunrise(Date sunrise) {
        super.elem = sunrise + "";
    }
}
