/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import java.time.LocalDateTime;
import java.util.*;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.*;
import play.db.ebean.*;
import play.data.format.*;
import play.data.validation.*;
import com.avaje.ebean.annotation.CreatedTimestamp;

/**
 *
 * @author y-fujiwara
 */
@Entity
@Table(name = "weathers")
public class Weather extends Model {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    @NotNull
    public int cityId;
    
    @NotNull
    public String name;
    
    @NotNull
    public int visibility;
    
    public double lat;
    
    public double lon;
    
    public int weatherid;
    
    public String main;
    
    public String description;
    
    public String icon;
    
    public double temp;
    
    public int pressure;
    
    public int humidity;
    
    public double tempMin;
    
    public double tempMax;
    
    public double windSpeed;
    
    public int windDeg;
    
    public int cloudAll;
    
    @Column(columnDefinition = "DATETIME")
    public Date dt;
    
    public String country;
    
    @Column(columnDefinition = "DATETIME")
    public Date sunrise;
    
    @Column(columnDefinition = "DATETIME")
    public Date sunset;
    
    @Column(columnDefinition = "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP")
    @CreatedTimestamp
    @NotNull
    public Date inserted_at;

    
    public static Finder<Long, Weather> find = new Finder<Long, Weather>(Long.class, Weather.class);
}
