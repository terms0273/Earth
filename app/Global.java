
import akka.actor.ActorSystem;
import java.util.List;
import models.Account;
import org.mindrot.jbcrypt.BCrypt;
import play.*;
import play.api.mvc.EssentialFilter;
import play.filters.csrf.CSRFFilter;
/**
 *
 * @author y-aiyoshizawa
 */
public class Global extends GlobalSettings{
    @Override
    public <T extends EssentialFilter> Class<T>[] filters(){
        return new Class[]{
            CSRFFilter.class
        };
    }
    
    /**
     * アプリケーションスタート時に一度のみ呼び出されるメソッド
     * @param app 
     */
    @Override
    public void onStart(Application app) {
        // 管理者ユーザー一覧取得
        List<Account> users = Account.find.where().eq("type",0).findList();
        
        // ユーザーが存在しない or 管理者ユーザーが存在しなければ新たにユーザーを作る
        if (users == null || users.isEmpty()) {
            try {
                Account newUser = new Account();
                String hashedPassword = BCrypt.hashpw("admin", BCrypt.gensalt());
                newUser.password = hashedPassword;
                newUser.userName = "admin";
                newUser.fullName = "admin";
                // 初期データは管理ユーザ
                newUser.type = 0;

                // もう一人は一般ユーザー
                Account newUser2 = new Account();
                String hashedPassword2 = BCrypt.hashpw("user", BCrypt.gensalt());
                newUser2.password = hashedPassword2;
                newUser2.userName = "user";
                newUser2.fullName = "user";
                newUser2.type = 1;
                
                // トランザクション用 ここまででthrowがあればcatchされるのでsaveされない
                newUser.save();
                newUser2.save();
            } catch (Exception e) {
                // とりあえず何もしない
            }
        }
    }
}
