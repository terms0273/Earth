package controllers;

import java.util.*;
import models.Account;
import dto.*;
import Services.*;
import filters.*;
import play.data.Form;
import play.mvc.*;

import static play.mvc.Results.badRequest;
import static play.mvc.Results.ok;
import static play.mvc.Results.redirect;

import views.html.*;

/**
 *
 * @author y-aiyoshizawa
 */
public class UserController extends Controller{
        
    /**
     * ログインページ表示用アクションメソッド
     * @return 
     */
    public static Result login() {
        Form form = new Form(LoginUser.class);
        return ok(login.render(form));
    }
    
    /**
     * ログイン実行アクションメソッド
     * @return 
     */
    public static Result doLogin() {
        Form<LoginUser> form = new Form(LoginUser.class).bindFromRequest();
        if(form.hasErrors()) {
            return badRequest(login.render(form));
        }
        
        LoginUser loginUser = form.get();
        
        UserModelService userModelService = new UserModelService();
        Account user = userModelService.login(loginUser);
        if(user == null){
            flash("errer",userModelService.message);
            return badRequest(login.render(form));
        }
        session("id",user.id.toString());
        return redirect(routes.UserController.index());
    }
    
    /**
     * メインページ遷移用アクションメソッド
     * @return 
     */
    @Security.Authenticated(LoginFilter.class)
    public static Result index() {
        Form form = new Form(Account.class);
        return ok(index.render(form));
    }
    
    /**
     * ユーザー作成画面表示アクションメソッド
     * @return 
     */
    public static Result register() {
        Form form = new Form(CreateUser.class);
        return ok(register.render(form));
    }
    
    /**
     * ユーザー作成実行アクションメソッド
     * @return 
     */
    public static Result create(){
        Form<CreateUser> form = new Form(CreateUser.class).bindFromRequest();
        if(form.hasErrors()){
            return badRequest(register.render(form));
        }
        
        UserModelService userModelService = new UserModelService();
        
        Account user = userModelService.cureateUser(form.get());
        if(user == null){
            flash("errer",userModelService.message);
            return badRequest(register.render(form));
        }
        flash("success",userModelService.message);
        return redirect(routes.UserController.login());
    }
    
    /**
     * ユーザー削除用ユーザー一覧画面表示用アクションメソッド
     * @return 
     */
    @Security.Authenticated(AdminFilter.class)
    public static Result userList() {
        long id = Long.parseLong(session("id"));
        
        UserModelService userModelService = new UserModelService();
        
        List<Account> tempUserList = userModelService.getUserList(id);
        if(tempUserList == null) {
            flash("errer",userModelService.message);
            return redirect(routes.UserController.index());
        }
        return ok(userList.render(tempUserList));
    }
    
    /**
     * ユーザー削除実行アクションメソッド
     * @param id
     * @return 
     */
    @Security.Authenticated(AdminFilter.class)
    public static Result delete(long id) {
        UserModelService userModelService = new UserModelService();
        
        userModelService.deleteUser(id);
        flash("success",userModelService.message);
        return redirect(routes.UserController.userList());
    }
    
    /**
     * ユーザー編集画面表示用アクションメソッド
     * @return 
     */
    @Security.Authenticated(LoginFilter.class)
    public static Result edit() {
        long id = Long.parseLong(session("id"));
        Account user = Account.find.byId(id);
        EditUser editUser = new EditUser(user);
        
        Form<EditUser> editUserForm = new Form(EditUser.class).fill(editUser);
        Form<EditUserPassword> editUserPasswordForm = new Form(EditUserPassword.class);
        
        return ok(edit.render(editUserForm,editUserPasswordForm));
    }
    
    /**
     * ユーザー編集実行アクションメソッド(パスワード以外)
     * @return 
     */
    @Security.Authenticated(LoginFilter.class)
    public static Result update() {
        Form<EditUser> editUserForm = new Form(EditUser.class).bindFromRequest();
        if(editUserForm.hasErrors()) {
            Form<EditUserPassword> editUserPasswordForm = new Form(EditUserPassword.class);
            return badRequest(edit.render(editUserForm,editUserPasswordForm));
        }
        long id = Long.parseLong(session("id"));
        
        UserModelService userModelService = new UserModelService();
        
        Account user = userModelService.updateUser(id, editUserForm.get());
        if(user == null) {
            flash("errer",userModelService.message);
            Form<EditUserPassword> editUserPasswordForm = new Form(EditUserPassword.class);
            return badRequest(edit.render(editUserForm,editUserPasswordForm));
        }
        flash("success",userModelService.message);
        return redirect(routes.UserController.index());
    }
    
    /**
     * パスワード変更実行アクションメソッド
     * @return 
     */
    @Security.Authenticated(LoginFilter.class)
    public static Result passwordUpdate() {
        long id = Long.parseLong(session("id"));
        Form<EditUserPassword> editUserPasswordForm = new Form(EditUserPassword.class).bindFromRequest();
        Account user = Account.find.byId(id);             //エラー時のフォームに今登録されている値を
        EditUser editUser = new EditUser(user);     //入れるために使われる
        
        if(editUserPasswordForm.hasErrors()) {
            Form<EditUser> editUserForm = new Form(EditUser.class).fill(editUser);
            return badRequest(edit.render(editUserForm,editUserPasswordForm));
        }
        
        UserModelService userModelService = new UserModelService();
        
        Account updateUser = userModelService.updatePasswordUser(id, editUserPasswordForm.get());
        if(updateUser == null) {
            flash("errer",userModelService.message);
            Form<EditUser> editUserForm = new Form(EditUser.class).fill(editUser);
            return badRequest(edit.render(editUserForm,editUserPasswordForm));
        }
        flash("success",userModelService.message);
        return redirect(routes.UserController.index());
    }
    
    /**
     * ログアウト実行アクションメソッド
     * @return 
     */
    @Security.Authenticated(LoginFilter.class)
    public static Result logout() {
        session().clear();
        return redirect(routes.UserController.login());
    }
}
