package models;

import java.util.*;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.*;
import play.db.ebean.*;
import play.data.format.*;
import org.mindrot.jbcrypt.BCrypt;
import play.data.validation.*;

@Entity
@Table(name = "accounts")
public class Account extends Model {
    
    public static final int TYPE_ADMIN;
    
    public static final int TYPE_USER;
    
    static {
        TYPE_ADMIN = 0;
        TYPE_USER = 1;
    }

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotNull
    @Column(unique=true)
    public String userName;

    @NotNull
    public String password;

    @NotNull
    public String fullName;

    @Column(columnDefinition = "integer default 1")
    public Integer type = 1;

    @Column(columnDefinition = "integer default 1")
    public Integer isDelete = 1;

    public static Finder<Long, Account> find = new Finder<Long, Account>(Long.class, Account.class);
    
    /**
     * saveするときにパスワードをハッシュ化する
     */
    public void passwordHashSave(){
        password = BCrypt.hashpw(password, BCrypt.gensalt());
        super.save();
    }
    
    /**
     * saveするときにパスワードをハッシュ化する
     */
    public void passwordHashUpadate(){
        password = BCrypt.hashpw(password, BCrypt.gensalt());
        super.update();
    }
}
