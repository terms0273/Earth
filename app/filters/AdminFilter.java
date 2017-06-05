/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package filters;

import models.Account;
import play.mvc.Security;
import play.mvc.Result;
import play.mvc.Http.Context;
import static play.mvc.Results.redirect;
/**
 *
 * @author y-aiyoshizawa
 */
public class AdminFilter extends Security.Authenticator {
    
    /**
     * 管理者認証実行フィルタメソッド
     * @param ctx
     * @return 
     */
    @Override
    public String getUsername(Context ctx) {
        String sessionId = ctx.session().get("id");
        //ログインしているか
        if(sessionId == null) {
            return null;
        }
        long id = Long.parseLong(sessionId);
        
        String ret = null;
        Account user = Account.find.byId(id);
        //typeはadminか
        if(user.type == Account.TYPE_ADMIN) {
            ret = "admin";
        }
        return ret;
    }
    
    /**
     * 管理者認証失敗フィルタメソッド
     * @param ctx
     * @return 
     */
    @Override
    public Result onUnauthorized(Context ctx) {
        String returnUrl = ctx.request().uri();
        if(returnUrl == null) {
            returnUrl = "/";
        }
        ctx.session().put("returnUrl",returnUrl);
        return redirect(controllers.routes.UserController.index());
    }
}
