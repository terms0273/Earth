/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package dto;

/**
 *
 * @author a-yamamoto
 */
public class ColorWindSpeed extends ColorChange {
    private static final String UNIT = "m/s";
    public ColorWindSpeed(double windSpeed) {
        
    }
    super.elem = windSpeed + UNIT;

}
